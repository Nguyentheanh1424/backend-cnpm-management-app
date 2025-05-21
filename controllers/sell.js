const Products = require("../modules/product");
const Bills = require("../modules/bill");
const Customer = require("../modules/customer");
const customerChangeHistory = require("../modules/history_change_customer");
const { formatProduct, formatCustomer, formatBill, formatMoney } = require("../utils/dataFormatter");
const { sendSuccess, sendError, sendNotFound, sendBadRequest } = require("../utils/responseHandler");
const { asyncHandler } = require("../utils/errorHandler");
const logger = require("../config/logger");

/**
 * Lấy danh sách sản phẩm thuộc về một người dùng cụ thể
 */
const findCode = asyncHandler(async (req, res) => {
    const {user} = req.body;

    // Tìm user theo email
    const products = await Products.find({owner: user.id_owner});

    // Format each product using the standardized formatter
    const formattedProducts = products.map(product => formatProduct(product));

    return sendSuccess(res, { products: formattedProducts });
}, { errorMessage: "Error retrieving products" });

/**
 * Lấy danh sách khách hàng thuộc về một người dùng cụ thể
 */
const getCustomer = asyncHandler(async (req, res) => {
    const {user} = req.body;

    // Tìm khách hàng theo owner
    const customers = await Customer.find({owner: user.id_owner})
        .populate("creator")
        .sort({orderDate: -1}) // Sắp xếp theo ngày đặt hàng, nếu muốn
        .lean();

    // Format each customer using the standardized formatter
    const formattedCustomers = customers.map(customer => formatCustomer(customer));

    return sendSuccess(res, { customers: formattedCustomers });
}, { errorMessage: "Error retrieving customers" });

/**
 * Tạo khách hàng mới
 */
const createCustomer = asyncHandler(async (req, res) => {
    const {name, email, phone, user} = req.body;

    // Check if a phone number already exists
    let check = await Customer.findOne({phone});
    if (check) {
        return sendBadRequest(res, "Số điện thoại này đã được đăng ký");
    }

    // Create a new customer
    let new_customer = new Customer({
        name,
        email,
        phone,
        owner: user.id_owner,
        creator: user._id,
    });

    await new_customer.save();

    // Format the new customer using the standardized formatter
    const formattedCustomer = formatCustomer(new_customer);

    return sendSuccess(res, { customer: formattedCustomer }, "Tạo khách hàng thành công", 201);
}, { errorMessage: "Error creating customer" });

/**
 * Tạo hóa đơn mới và cập nhật thông tin khách hàng
 */
const history = asyncHandler(async (req, res) => {
    const {owner, customerId, totalAmount, items, paymentMethod, notes, discount, vat, creator} = req.body;

    let newBill;
    if (customerId !== "") {
        // Find or create a customer
        let check = await Customer.findOne({phone: customerId});
        if (!check) {
            const new_customer = new Customer({
                phone: customerId,
                owner,
                firstPurchaseDate: Date.now(),
                lastPurchaseDate: Date.now(),
                creator: creator
            });
            await new_customer.save();
            check = await Customer.findOne({phone: customerId});
        }

        // Create the new bill with a customer
        newBill = new Bills({
            owner,
            creator,
            customerId: check._id,
            totalAmount,
            items,
            paymentMethod,
            notes,
            discount,
            vat
        });

        // Update customer information
        let customer = await Customer.findById(check._id);

        // Use formatMoney for consistent money formatting
        const currentMoney = typeof customer.money === 'string' 
            ? parseFloat(customer.money.replace(/\./g, ""))
            : (customer.money || 0);

        const totalAmountValue = typeof totalAmount === 'string'
            ? parseFloat(totalAmount.replace(/\./g, ""))
            : (totalAmount || 0);

        const newMoneyValue = currentMoney + totalAmountValue;
        const formattedMoney = formatMoney(newMoneyValue);

        let rate = customer.rate || 0;

        // Update customer based on purchase history
        if (customer.firstPurchaseDate === null) {
            customer = await Customer.findByIdAndUpdate(
                check._id,
                {
                    rate: rate + 1,
                    money: formattedMoney,
                    firstPurchaseDate: Date.now(),
                    lastPurchaseDate: Date.now(),
                },
                {new: true}
            );
        } else {
            customer = await Customer.findByIdAndUpdate(
                check._id,
                {
                    rate: rate + 1,
                    money: formattedMoney,
                    lastPurchaseDate: Date.now(),
                },
                {new: true}
            );
        }
    } else {
        // Create the new bill without a customer
        newBill = new Bills({
            owner,
            totalAmount,
            items,
            paymentMethod,
            notes,
            discount,
            vat,
            creator
        });
    }

    // Save the bill
    await newBill.save();

    // Update product inventory
    for (const item of items) {
        const product = await Products.findById(item.productID);
        if (product) {
            product.stock_in_shelf -= item.quantity;
            product.rate = product.rate + 1;
            if (product.stock_in_shelf < 0) {
                product.stock_in_shelf = 0;
            }
            await product.save();
        }
    }

    // Format the bill using the standardized formatter
    const formattedBill = formatBill(newBill);

    return sendSuccess(res, { bill: formattedBill }, "Tạo hóa đơn thành công", 201);
}, { errorMessage: "Error creating bill" });

/**
 * Lấy lịch sử hóa đơn của một người dùng cụ thể
 */
const getHistory = asyncHandler(async (req, res) => {
    const { user } = req.body;

    const activities = await Bills.find({ owner: user.id_owner })
        .populate("owner")
        .populate("creator")
        .populate("customerId")
        .populate({
            path: "items.productID",
            model: "Products",
        })
        .sort({ orderDate: -1 })
        .lean();

    // Format each bill using the standardized formatter
    const formattedBills = activities.map(bill => formatBill(bill));

    return sendSuccess(res, formattedBills);
}, { errorMessage: "Error retrieving bill history" });
/**
 * Lấy lịch sử thay đổi thông tin khách hàng
 */
const getHistoryCustomer = asyncHandler(async (req, res) => {
    const { user } = req.body;

    const activities = await customerChangeHistory.find({ owner: user.id_owner }) // Lấy lịch sử hoạt động của người chủ
        .populate('employee', 'name email') // Lấy tên nhân viên
        .populate('customer')
        .sort({ timestamp: -1 }) // Sắp xếp theo thời gian
        .select('employee customer action timestamp details') // Chọn các trường cần thiết
        .lean();

    return sendSuccess(res, activities);
}, { errorMessage: "Error retrieving customer history" });
const editCustomer=async (req, res)=>{
    const { user, customer_edit } = req.body;
    try {
        let customer = await Customer.find({ _id: customer_edit._id });
        if(customer.length==0){        res.json({ message: "Không tìm thấy customer" });}
        customer = customer[0];
        let check = await Customer.findOne({
            _id: { $ne: customer._id },
            owner:user.id_owner,
            phone: customer_edit.phone
        });
        if (check) {
            return res.json({ message: "Số điện thoại này đã được đăng ký" });
        }


        const oldProduct = JSON.parse(JSON.stringify(customer));

        customer = await Customer.findByIdAndUpdate(
            customer_edit._id,
            customer_edit,
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({ message: 'customer not found' });
        }

        const updatedFields = Object.keys(customer_edit);

        const filteredFields = updatedFields.filter(field => {
            if(field=='creator'||field=='owner'||field=="updatedAt") {
                return false;}
            if(field=="rate"){
                customer_edit[field] =parseInt(customer_edit[field])
            }
            return oldProduct[field] !== customer_edit[field]
        });

        logger.info('Filtered fields:', filteredFields)
        if (filteredFields.length > 0) {
            const changes = filteredFields.map(field => {
                const oldValue = oldProduct[field];
                const newValue = customer_edit[field];

                return `${field} changed from '${oldValue}' to '${newValue}'`;
            });

            const history = new customerChangeHistory({
                owner: user.id_owner,
                employee: user._id,
                customer: customer_edit.name,
                action: 'update',
                details: `${changes.join(', ')} `
            });

            try {
                await history.save();
            } catch (err) {
                logger.error('Error saving history:', err);
            }
        }
        res.json({ message: "success" });
    } catch (error) {
        logger.error('Server Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
const deleteCustomer = async (req, res) => {
    const { user,customer_delete,detail } = req.body;
    try {
        const customer = await Customer.findByIdAndDelete(customer_delete._id);
        if (!customer) {
            return res.status(404).json({ message: 'supplier not found' });
        }
        const history = new customerChangeHistory({
            owner: user.id_owner,
            employee: user._id,
            customer: customer.phone,
            action: 'delete',
            details: detail
        });
        await history.save();
        res.status(200).json({ message: 'success' });
    } catch (error) {
        logger.error('Error deleting customer:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    findCode,
    getCustomer,
    createCustomer,
    history,
    getHistory,
    getHistoryCustomer,
    editCustomer,
    deleteCustomer
}
