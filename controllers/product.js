const Product = require('../modules/product');
const History = require('../modules/history');
const Cloudinary = require('cloudinary').v2;
const Suppliers = require('../modules/supplier');
const SupplierChangeHistory = require('../modules/history_change_supplier');
const mongoose = require('mongoose');

Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Lấy ds sản phẩm
const show = async (req, res) => {
    const {user} = req.body;
    try {
        const products = await Product.find({owner: user.id_owner});
        res.json(products);
    } catch (error) {
        console.error('show error:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

// Chỉnh sửa sản phẩm
const edit = async (req, res) => {
    const {user, product_edit, detail, check} = req.body;
    try {
        let product = await Product.find({_id: product_edit._id});
        product = product[0];

        if (product.image && product.image.public_id && check) {
            const publicId = product.image.public_id;
            const result = await Cloudinary.uploader.destroy(publicId);
            if (result.error) {
                console.error("Error deleting image from Cloudinary:", result.error);
            }
            console.log("Cloudinary delete result:", result);
        }

        const oldProduct = JSON.parse(JSON.stringify(product));
        product = await Product.findByIdAndUpdate(
            product_edit._id,
            product_edit,
            {new: true, runValidators: true}
        );

        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        const updateFields = Object.keys(product_edit);

        const filteredFields = updateFields.filter(field => {
            if (field == 'supplier') {
                return oldProduct[field] !== product_edit[field]._id;
            }
            if (field == "image") {
                return JSON.stringify(oldProduct[field]) !== JSON.stringify(product_edit[field]);
            }
            return oldProduct[field] !== product_edit[field];
        });

        if (filteredFields.length > 0) {
            const changes = filteredFields.map(field => {
                if (field == 'supplier' && field == 'image') return `${field} changed`;
                const oleValue = oldProduct[field];
                const newValue = product_edit[field];
                return `${field} changed from ${oleValue} to ${newValue}`;
            });
            const history = new History({
                owner: user.id_owner,
                employee: user._id,
                product: product_edit.name,
                action: 'update',
                details: `${detail + "  "} \n${changes.join(', ')}. `
            });
            try {
                await history.save();
            } catch (err) {
                console.error('Error saving history:', err);
            }
        }
        res.json({message: "success"});
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Xóa sản phẩm
const deletes = async (req, res) => {
    const {user, product_delete, detail} = req.body;
    try {
        const product = await Product.findByIdAndDelete(product_delete._id);

        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        const history = new History({
            owner: user.id_owner,
            employee: user._id,
            product: product.name,
            action: 'delete',
            details: detail
        });

        await history.save();

        if (product.image && product.image.public_id) {
            const publicId = product.image.public_id;
            const result = await Cloudinary.uploader.destroy(publicId);
            if (result.error) {
                console.error('Error deleting image from Cloudinary:', result.error);
            }
            console.log('Cloudinary delete result:', result);
        }
        res.status(200).json({message: 'Product deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Lấy chi tiết sản phẩm
const show_detail = async (req, res) => {
    try {
        const product = await Product.findOne({_id: req.params.id})
            .populate("supplier")
            .lean(); // chuyển đổi tài liệu thành đối tượng JavaScript thuần túy
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};

// Tạo sản phẩm mới
const create = async (req, res) => {
    const {user, newPr, detail} = req.body;
    console.log({
        ...newPr,
    });
    const Check = await Product.find({owner: user.id_owner, sku: newPr.sku})
    if (Check.length > 0) {
        return res.status(500).json({message: 'sku đã bị trùng'});
    }
    try {
        const newProduct = new Product({
            ...newPr,
            owner: user.id_owner
        });
        await newProduct.save();
        try {
            const history = new History({
                owner: user.id_owner,
                employee: user._id,
                product: newPr.name,
                action: 'create',
                details: detail,
            });
            await history.save();
            res.status(201).json({message: "Success"});
        } catch (err) {
            res.status(500).json({message: 'Server error2', err});
        }

    } catch (error) {
        console.error('Error in get_history:', error); // Log lỗi chi tiết
        res.status(500).json({message: error.message});
    }
};

// Lấy lịch sử thay đổi sản phẩm
const get_history = async (req, res) => {
    const {user} = req.body;
    try {
        const activities = await History.find({owner: user.id_owner})
            .populate('employee', 'name email')
            .sort({timestamp: -1})
            .select('employee product action timestamp details')
            .lean();
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error in get_history:', error);
        res.status(500).json({message: error.message});
    }
};

const get_supplier = async (req, res) => {
    const {user} = req.body;
    try {
        const suppliers = await Suppliers.find({owner: user.id_owner})
            .populate("creator")
            .sort({orderDate: -1})
            .lean();
        if (suppliers) {
            const send = {suppliers: [...suppliers], message: "success"};
            res.json(send);
        } else {
            res.status(500).json({message: "Error"});
        }
    } catch (error) {
        console.error('show error:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

// Tạo nhà cung cấp mới
const create_supplier = async (req, res) => {
    const {name, email, phone, address, user} = req.body;
    try {
        let check = await Suppliers.findOne({owner: user.id_owner, phone});
        if (check) {
            return res.status(500).json({message: 'Số điện thoại đã tồn tại'});
        }
        let new_supplier = new Suppliers({
            name,
            email,
            phone,
            owner: user.id_owner,
            creator: user._id
        })
        await new_supplier.save();
        res.json({new_supplier, message: "success"});
    } catch (error) {
        console.error('show error:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

// Chỉnh sửa nhà cung cấp
const edit_supplier = async (req, res) => {
    const {user, supplier_edit} = req.body;
    try {
        let supplier = await Suppliers.find({_id: supplier_edit._id});
        if (supplier.length == 0) {
            return res.json({message: "Không tìm thấy supplier"});
        }
        supplier = supplier[0];
        let check = await Suppliers.findOne({
            _id: {$ne: supplier._id},
            owner: user.id_owner,
            phone: supplier_edit.phone
        });
        if (check) {
            console.log(check)
            return res.json({message: "Số điện thoại này đã được đăng ký"});
        }
        const oldProduct = JSON.parse(JSON.stringify(supplier));

        // Cập nhật thông tin sản phẩm
        supplier = await Suppliers.findByIdAndUpdate(
            supplier_edit._id,
            supplier_edit,
            {new: true, runValidators: true}
        );

        if (!supplier) {
            return res.status(404).json({message: 'supplier not found'});
        }

        const updatedFields = Object.keys(supplier_edit);

        // Loại bỏ trường createdAt khỏi danh sách thay đổi
        const filteredFields = updatedFields.filter(field => {
            if (field == 'creator' || field == 'owner') {
                return false;
            }

            return oldProduct[field] !== supplier_edit[field]
        });

        console.log(filteredFields)
        if (filteredFields.length > 0) {
            // Lấy các thay đổi chi tiết (so sánh cũ và mới)
            const changes = filteredFields.map(field => {
                const oldValue = oldProduct[field];
                const newValue = supplier_edit[field];

                // Ghi lại thay đổi theo format "field changed from oldValue to newValue"
                return `${field} changed from '${oldValue}' to '${newValue}'`;
            });

            const history = new supplierCHistory({
                owner: user.id_owner, //
                employee: user._id,
                supplier: supplier_edit.name,
                action: 'update',
                details: `${changes.join(', ')}. `  // Thêm chi tiết thay đổi vào lịch sử
            });

            try {
                await history.save();
            } catch (err) {
                console.error('Error saving history:', err);
            }
        }
        res.json({message: "success"});
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Lấy lịch sử thay đổi
const get_history_supplier = async (req, res) => {
    const {user} = req.body;
    try {
        const activities = await SupplierChangeHistory.find({owner: user.id_owner})
            .populate('employee', 'name email')
            .populate('supplier')
            .sort({timestamp: -1})
            .select('employee supplier action timestamp details')
            .lean();
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error in get_history:', error);
        res.status(500).json({message: error.message});
    }
};

// Xóa nhà cung cấp
const delete_supplier=async(req,res)=>{
    const { user,supplier_delete,detail } = req.body;
    try {
        const supplier = await Suppliers.findByIdAndDelete(supplier_delete._id);
        if (!supplier) {
            return res.status(404).json({ message: 'supplier not found' });
        }
        const history = new supplierCHistory({
            owner: user.id_owner,
            employee: user._id,
            supplier: supplier.name,
            action: 'delete',
            details: detail
        });
        await history.save();
        res.status(200).json({ message: 'success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy sản pẩm theo nhà cung cấp
const getProductsBySupplier = async (req, res) => {
    const { productId,ownerId } = req.query;
    console.log(productId,ownerId)
    const objectIdSupplierId = new mongoose.Types.ObjectId(productId);
    // Kiểm tra xem productId có tồn tại trong query params không
    if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
    }
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "Suppliers",
                    localField: "supplier",
                    foreignField: "_id",
                    as: "supplierDetails",
                },
            },
            {
                $unwind: {
                    path: "$supplierDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    "supplierDetails._id": objectIdSupplierId,
                    "supplierDetails.owner":new mongoose.Types.ObjectId(ownerId),
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    image: 1,
                    purchasePrice: 1,
                    "supplierDetails._id": 1,
                    "supplierDetails.name": 1,
                    "supplierDetails.email": 1,
                },
            },
        ]);
        if (products.length === 0) {
            return res
                .status(404)
                .json({ message: "No products found for this supplier" });
        }
        // Trả về danh sách sản phẩm nếu tìm thấy
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by supplier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Tìm sản phẩm theo tên
const getProductsByProductName = async (req, res) => {
    const { query,ownerId } = req.query;
    const objectProductId = query;
    console.log(query,ownerId)
    if (!objectProductId) {
        return res.status(400).json({ error: "Product ID is required" });
    }
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "Suppliers",
                    localField: "supplier",
                    foreignField: "_id",
                    as: "supplierDetails",
                },
            },
            {
                $unwind: {
                    path: "$supplierDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    name: {
                        $regex: objectProductId,
                        $options: "i",
                    },
                    "supplierDetails.owner": new mongoose.Types.ObjectId(ownerId)
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    image: 1,
                    purchasePrice: 1,
                    "supplierDetails._id": 1,
                    "supplierDetails.name": 1,
                    "supplierDetails.email": 1,
                },
            },
        ]);
        if (products.length === 0) {
            return res
                .status(404)
                .json({ message: "No products found for this supplier" });
        }
        // Trả về danh sách sản phẩm nếu tìm thấy
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by supplier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Xuất tất cả các hàm dưới dạng một đối tượng để sử dụng trong các routes
module.exports = {
    show,
    edit,
    deletes,
    show_detail,
    create,
    get_history,
    get_supplier,
    create_supplier,
    edit_supplier,
    get_history_supplier,
    delete_supplier,
    getProductsBySupplier,
    getProductsByProductName,
}



