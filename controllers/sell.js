const Products = require("../modules/product");
const Bills = require("../modules/bill");
const Customer = require("../modules/customer");
const customerChangeHistory = require("../modules/history_change_customer");

// Lấy danh sách sản phẩm thuộc về một người dùng cụ thể
const find_code = async (req, res) => {
    const {user} = req.body;
    try {
        // Tìm user theo email
        const products = await Products.find({owner: user.id_owner});
        if (products) {
            console.log(products);
            const send = {product: [...products], message: "success"};
            res.json(send);
        } else {
            res.status(500).json({message: "Error"});
        }
    } catch (error) {
        console.error("show error", error);
        res.status(500).json({message: "Error", error});
    }
};

const get_customer = async (req, res) => {
    const {user} = req.body;
    try {
        // Tìm user theo email
        const customers = await Customer.find({owner: user.id_owner})
            .populate("creator")
            .sort({orderDate: -1}) // Sắp xếp theo ngày đặt hàng, nếu muốn
            .lean();
        if (customers) {
            const send = {customers: [...customers], message: "success"};
            res.json(send);
        } else {
            res.status(500).json({message: "Error"});
        }
    } catch (error) {
        console.error("show error", error);
        res.status(500).json({message: "Error", error});
    }
};

// Tạo khách hàng mới
const create_customer = async (req, res) => {
    const {name, email, phone, user} = req.body;
    try {
        let check = await Customer.findOne({phone});
        if (check) {
            return res.json({message: "Số điện thoại này đã được đăng ký"});
        }
        let new_customer = new Customer({
            name,
            email,
            phone,
            owner: user.id_owner,
            creator: user._id,
        });
        await new_customer.save();
        res.json({new_customer, message: "success"});
    } catch (err) {
        return res.status(404).json({message: "Error"});
    }
};

const history = async (req, res) => {
    const {owner, customerId, totalAmount, items, paymentMethod, notes, discount, vat, creator} =
        req.body;
    try {
        let newBill;
        if (customerId != "") {
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

            let customer = await Customer.findById(check._id);
            const currentMoney = parseFloat(
                customer.money.toString().replace(/\./g, "")
            );
            let rate = customer.rate;
            if (customer.firstPurchaseDate === null) {
                customer = await Customer.findByIdAndUpdate(
                    check._id,
                    {
                        rate: rate + 1,
                        $set: {
                            money: (
                                currentMoney +
                                parseFloat(totalAmount.toString().replace(/\./g, ""))
                            ).toLocaleString("vi-VN",),
                        },
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
                        $set: {
                            money: (
                                currentMoney +
                                parseFloat(totalAmount.toString().replace(/\./g, ""))
                            ).toLocaleString("vi-VN",),
                        },
                        lastPurchaseDate: Date.now(),
                    },
                    {new: true}
                );
            }
        } else {
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
        await newBill.save();
        for (const item of items) {
            const product = await Products.findById(item.productID);
            if (product) {
                product.stock_in_shelf -= item.quantity;
                product.rate=product.rate+1;
                if (product.stock_in_shelf < 0) {
                    product.stock_in_shelf = 0;
                }
            }
            await product.save();
        }
        res.json({ message: "success" });
    } catch (err) {
        console.error("Error saving history:", err);
        return res.status(404).json({message: "Error"});
    }
};

const get_history = async (req, res) => {
    const { user } = req.body;
    try {
        console.log(user);
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

        res.status(200).json(activities);
    } catch (error) {
        console.error("Error in get_history:", error); // Log lỗi chi tiết
        res.status(500).json({ message: error.message });
    }
};
const get_history_customer = async (req, res) => {
    const { user } = req.body;
    try {
        const activities = await customerChangeHistory.find({ owner: user.id_owner }) // Lấy lịch sử hoạt động của người chủ
            .populate('employee', 'name email') // Lấy tên nhân viên
            .populate('customer')
            .sort({ timestamp: -1 }) // Sắp xếp theo thời gian
            .select('employee customer action timestamp details') // Chọn các trường cần thiết
            .lean();
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error in get_history:', error); // Log lỗi chi tiết
        res.status(500).json({ message: error.message });
    }
};
const edit_customer=async (req,res)=>{
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

        console.log(filteredFields)
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
                console.error('Error saving history:', err);
            }
        }
        res.json({ message: "success" });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
const delete_customer = async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    find_code,
    create_customer,
    history,
    get_customer,
    get_history,
    get_history_customer,
    edit_customer,
    delete_customer
};

