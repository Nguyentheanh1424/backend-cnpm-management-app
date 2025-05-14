const Products = require("../modules/products");
const Bills = require("../modules/bill");
const Customer = require("../modules/customer");
const customerCHistory = require("../modules/history_change_customer");
const findcode = async (req, res) => {
    const { user } = req.body;
    try {
        // Tìm user theo email
        const products = await Products.find({ owner: user.id_owner });
        if (products) {
            console.log(products);
            const send = { product: [...products], message: "success" };
            res.json(send);
        } else {
            res.status(500).json({ message: "Error" });
        }
    } catch (error) {
        console.error("show error", error);
        res.status(500).json({ message: "Error", error });
    }
};
const get_customer = async (req, res) => {
    const { user } = req.body;
    try {
        // Tìm user theo email
        const customers = await Customer.find({ owner: user.id_owner })
            .populate("creator")
            .sort({ orderDate: -1 }) // Sắp xếp theo ngày đặt hàng, nếu muốn
            .lean();
        if (customers) {
            const send = { customers: [...customers], message: "success" };
            res.json(send);
        } else {
            res.status(500).json({ message: "Error" });
        }
    } catch (error) {
        console.error("show error", error);
        res.status(500).json({ message: "Error", error });
    }
};
const create_customer = async (req, res) => {
    const { name, email, phone, user } = req.body;
    try {
        let check = await Customer.findOne({ phone });
        if (check) {
            return res.json({ message: "Số điện thoại này đã được đăng ký" });
        }
        let new_customer = new Customer({
            name,
            email,
            phone,
            owner: user.id_owner,
            creator:user._id,
        });
        await new_customer.save();
        res.json({new_customer, message: "success" });
    } catch (err) {
        return res.status(404).json({ message: "Error" });
    }
};
const history = async (req, res) => {

};
const get_history = async (req, res) => {

};
const get_history_customer = async (req, res) => {

};
const edit_customer = async (req, res) => {

};
const delete_customer = async (req, res) => {

};