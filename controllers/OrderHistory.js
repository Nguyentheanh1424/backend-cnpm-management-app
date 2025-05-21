const mongoose = require("mongoose");
const OrderHistory = require("../modules/order_history");
const OrderDetailHistory = require("../modules/order_detail_history");
const LoggingOrder = require("../modules/logging_order");
const Products = require("../modules/product");
const Suppliers = require("../modules/supplier");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "ntheanh0104@gmail.com", // Email của bạn
        pass: "igimrjmnxgdywfon", // Mật khẩu ứng dụng
    },
});

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: "ntheanh0104@gmail.com",
            to: to,
            subject: subject,
            text: text,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
        return { success: true };
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return { success: false, error: error.message };
    }
};

const template = (listOrder, orderId) => {
    if (!listOrder || listOrder.length === 0) return null;
    return (
        `Kính gửi ${listOrder[0].supplier},\n` +
        `Mã đơn hàng: ${orderId}\n` +
        `Ngày yêu cầu: ${new Date().toLocaleDateString('vi-VN')}\n` +
        listOrder.map(
            (order) => `- ${order.quantity} sản phẩm ${order.name}\n`
        ).join('') +
        `Vui lòng liên hệ qua email ${listOrder[0].userEmail || 'support@example.com'} để xác nhận.\n` +
        `Cảm ơn!`
    );
};

const saveOrderHistory = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!req.body.user || !req.body.user.email) {
            throw new Error("User email is required");
        }
        if (!req.body.dataForm || Object.values(req.body.dataForm).length === 0) {
            throw new Error("Order list is required");
        }

        const listOrder = Object.values(req.body.dataForm);
        const ownerId = new mongoose.Types.ObjectId(req.body.user.ownerId);
        const tax = req.body.tax;
        const userId = req.body.user.id;
        const userName = req.body.user.name;
        const userEmail = req.body.user.email;
        const allOrderPromises = [];
        const allOrderDetailHistories = [];
        const allLoggingOrders = [];
        const productUpdates = [];
        const emailPromises = [];

        for (const suppOrders of listOrder) {
            const supplier = await Suppliers.findById(suppOrders[0].supplierId);
            if (supplier && supplier.email) {
                const emailContent = template(suppOrders, savedOrder._id);
                if (emailContent) {
                    emailPromises.push(
                        sendEmail(supplier.email, "Yêu cầu nhập hàng", emailContent)
                    );
                }
            }

            const generalStatus = suppOrders.some((item) => item.status === "pending")
                ? "pending"
                : "deliveried";
            const amount = suppOrders
                .reduce((acc, curr) => acc + Math.floor(Number(curr.price) * Number(curr.quantity)*(tax/100+1)), 0)
                .toString();
            const order = new OrderHistory({
                supplierId: suppOrders[0].supplierId,
                generalStatus,
                amount,
                ownerId,
                tax,
            });

            const savedOrder = await order.save({ session });

            const orderDetails = suppOrders.map((item) => ({
                orderId: savedOrder._id,
                productId: new mongoose.Types.ObjectId(item.productId),
                price: item.price,
                quantity: item.quantity,
                status: item.status,
                ownerId,
            }));
            allOrderDetailHistories.push(...orderDetails);

            const savedOrderDetails = await OrderDetailHistory.insertMany(allOrderDetailHistories, { session });
            const loggingOrders = savedOrderDetails.map((detail) => ({
                orderId: savedOrder._id,
                orderDetailId: detail._id,
                status: detail.status === "deliveried" ? "deliveried" : "create",
                userId,
                userName,
                details: "create a new item",
                ownerId,
                tax,
            }));
            allLoggingOrders.push(...loggingOrders);

            productUpdates.push(
                ...suppOrders
                    .filter((item) => item.status === "deliveried")
                    .map((item) => ({
                        updateOne: {
                            filter: { _id: item.productId },
                            update: { $inc: { stock_in_Warehouse: Number(item.quantity) } },
                        },
                    }))
            );
        }

        if (allOrderDetailHistories.length > 0) {
            allOrderPromises.push(
                OrderDetailHistory.insertMany(allOrderDetailHistories, { session })
            );
        }

        if (allLoggingOrders.length > 0) {
            allOrderPromises.push(
                LoggingOrder.insertMany(allLoggingOrders, { session })
            );
        }

        if (productUpdates.length > 0) {
            allOrderPromises.push(Products.bulkWrite(productUpdates));
        }

        const emailResults = await Promise.all(emailPromises);
        const emailErrors = emailResults.filter(result => !result.success);
        if (emailErrors.length > 0) {
            console.warn("Some emails failed to send:", emailErrors);
        }

        await Promise.all([...allOrderPromises]);

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({
            message: "Order history saved successfully!",
            emailErrors: emailErrors.length > 0 ? emailErrors : undefined
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error during the transaction:", error);
        res.status(500).send({ message: "An error occurred during the transaction", error: error.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const { search, ownerId } = req.query;
        let matchConditions = {};
        if (search) {
            if (mongoose.Types.ObjectId.isValid(search)) {
                matchConditions._id = new mongoose.Types.ObjectId(search);
            } else if (isNaN(Date.parse(search))) {
                matchConditions["supplier.name"] = { $regex: search, $options: "i" };
            } else {
                const parsedDate = new Date(search);
                if (isNaN(parsedDate)) {
                    return res.status(400).json({ error: "Invalid date format" });
                }
                // Tìm tất cả các đơn hàng trong ngày cụ thể (từ 00:00 đến 23:59:59)
                matchConditions.createdAt = {
                    $gte: parsedDate,
                    $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
                };
            }
        }
        console.log(matchConditions);
        const result = await OrderHistory.aggregate([
            {
                $lookup: {
                    from: "Supplier",
                    localField: "supplierId",
                    foreignField: "_id",
                    as: "supplier",
                },
            },
            {
                $match: {
                    ...matchConditions,
                    generalStatus: "pending",
                    ownerId: new mongoose.Types.ObjectId(ownerId),
                },
            },
            {
                $unwind: {
                    path: "$supplier",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    tax:1,
                    supplierId: 1,
                    generalStatus: 1,
                    amount: 1,
                    updatedAt: 1,
                    nameSupplier: "$supplier.name",
                    emailSupplier: "$supplier.email",
                    supplier_Id: "$supplier._id",
                },
            },
        ]);
        // Trả về kết quả
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in aggregate query:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
const updateOrderHistory = async (req, res) => {
    const newOrder = req.body;
    try {
        const orderH = await OrderHistory.findOne({
            _id: new mongoose.Types.ObjectId(newOrder.id),
        });
        if (!orderH) {
            return res.status(404).json({ message: "Order history not found" });
        }

        if (newOrder.status !== orderH.generalStatus) {
            const listOrderChange = await OrderDetailHistory.find({
                orderId: new mongoose.Types.ObjectId(newOrder.id),
                status: "pending",
            });
            if (newOrder.status === "deliveried") {
                const promises = listOrderChange.map(async (orderChange) => {
                    try {
                        await Products.updateOne(
                            { _id: orderChange.productId },
                            { $inc: { stock_in_Warehouse: Number(orderChange.quantity) } }
                        );

                        orderChange.status = "deliveried";
                        orderChange.updatedAt = newOrder.date;
                        await orderChange.save();

                        const newLogging = new LoggingOrder({
                            orderId: newOrder.id,
                            orderDetailId: orderChange._id,
                            status: "update",
                            userId: newOrder.userid,
                            userName: newOrder.userName,
                            details: newOrder.notes,
                            ownerId: newOrder.ownerId,
                            tax: newOrder.tax,
                        });
                        console.log(newLogging);
                        await newLogging.save();
                    } catch (error) {
                        console.error(
                            `Error updating order detail ${orderChange._id}:`,
                            error
                        );
                    }
                });
                await Promise.all(promises);
            } else if (newOrder.status === "Canceled") {
                const promises = listOrderChange.map(async (orderChange) => {
                    try {
                        orderChange.status = "canceled";
                        orderChange.updatedAt = newOrder.date;
                        await orderChange.save();

                        const newLogging = new LoggingOrder({
                            orderId: newOrder.id,
                            orderDetailId: orderChange._id,
                            status: "delete",
                            userId: newOrder.userid,
                            userName: newOrder.userName,
                            ownerId: newOrder.ownerId,
                            details: newOrder.notes,
                            tax:newOrder.tax,
                        });
                        console.log(newLogging)
                        await newLogging.save();

                    } catch (error) {
                        console.error(
                            `Error canceling order detail ${orderChange._id}:`,
                            error
                        );
                    }
                });
                await Promise.all(promises);
            }
        }

        orderH.updatedAt = newOrder.date;
        orderH.generalStatus = newOrder.status;
        orderH.amount = newOrder.total;

        await orderH.save();

        res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
        console.error("Error updating OrderHistory:", error);
        res
            .status(500)
            .json({ message: "Error updating order", error: error.message });
    }
};

const getSupplierByOrderId = async (req, res) => {
    const { orderId, ownerId } = req.query;
    console.log(ownerId);
    if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
    }

    try {
        const orders = await OrderHistory.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(orderId),
                },
            },
            {
                $lookup: {
                    from: "Supplier",
                    localField: "supplierId", // Trường trong orderHistory chứa _id nhà cung cấp
                    foreignField: "_id", // Trường _id trong collection supplier
                    as: "supplierDetails", // Kết quả nối sẽ được lưu trong trường này
                },
            },

            {
                $unwind: "$supplierDetails", // "Giải nở" (unwind) để chuyển dữ liệu từ mảng thành đối tượng
            },
            {
                $project: {
                    tax: 1,
                    supplierName: "$supplierDetails.name", // Lấy tên nhà cung cấp
                    supplierEmail: "$supplierDetails.email", // Lấy email nhà cung cấp
                },
            },
        ]);
        if (orders.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }
        console.log(orders[0])
        res.json(orders[0]);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getProductTop100 = async (req, res) => {
    const { ownerId } = req.query;

    const firstDayOfLastMonth = new Date();
    firstDayOfLastMonth.setMonth(firstDayOfLastMonth.getMonth() - 1);
    firstDayOfLastMonth.setDate(1);
    firstDayOfLastMonth.setHours(0, 0, 0, 0);

    const lastDayOfLastMonth = new Date(firstDayOfLastMonth);
    lastDayOfLastMonth.setMonth(lastDayOfLastMonth.getMonth() + 1);
    lastDayOfLastMonth.setDate(0);
    lastDayOfLastMonth.setHours(23, 59, 59, 999);

    if (!ownerId) {
        return res.status(400).json({ error: "Owner ID is required" });
    }

    try {
        const products = await OrderDetailHistory.aggregate([
            {
                $match: {
                    ownerId: new mongoose.Types.ObjectId(ownerId),
                    createdAt: {
                        $gte: firstDayOfLastMonth,
                        $lt: lastDayOfLastMonth,
                    },
                },
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $lookup: {
                    from: "Supplier",
                    localField: "product.supplier",
                    foreignField: "_id",
                    as: "supplier",
                },
            },
            {
                $unwind: {
                    path: "$supplier",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $addFields: {
                    numericQuantity: { $toDouble: "$quantity" }, // Chuyển quantity từ string sang number
                },
            },
            {
                $group: {
                    _id: "$productId",
                    totalQuantity: { $sum: "$numericQuantity" },
                    name: { $first: "$product.name" },
                    description: { $first: "$product.description" },
                    image: { $first: "$product.image" },
                    purchasePrice: { $first: "$product.purchasePrice" },
                    supplierId: { $first: "$supplier._id" },
                    supplierName: { $first: "$supplier.name" },
                    supplierEmail: { $first: "$supplier.email" },
                },
            },
            {
                $project: {
                    // productId: "$_id",
                    // _id: "$",
                    // totalQuantity: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    purchasePrice: 1,
                    supplierDetails:{
                        _id:'$supplierId',
                        name:'$supplierName',
                        email:'$supplierEmail',
                    },
                },
            },
            {
                $sort: {
                    totalQuantity: -1,
                },
            },
            {
                $limit: 100,
            },
        ]);

        return res.status(200).json(products);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred" });
    }
};


module.exports = {
    saveOrderHistory,
    getOrder,
    updateOrderHistory,
    getSupplierByOrderId,
    getProductTop100,
};
