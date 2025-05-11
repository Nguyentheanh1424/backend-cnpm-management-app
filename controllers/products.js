const Products = require('../modules/products');
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
        const products = await Products.find({owner: user.id_owner});
        res.json(products);
    } catch (error) {
        console.error('show error:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

// Chỉnh sửa sản phẩm
const edit = async (req, res) => {
    const {user, product_edit, detail, check} = req.body;
    try {
        let product = await Products.find({_id: product_edit._id});
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
        product = await Products.findByIdAndUpdate(
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
    const { user, product_delete, detail } = req.body;
    try {
        const product = await Products.findByIdAndDelete(product_delete._id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
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
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết sản phẩm
const show_detail = async (req, res) => {
    try {
        const product = await Products.findOne({_id: req.params.id})
            .populate("supplier")
            .lean(); // chuyển đổi tài liệu thành đối tượng JavaScript thuần túy
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
}

// Tạo sản phẩm mới
const create = async (req, res) => {
    const {user, newPr, detail} = req.body;
    console.log({
        ...newPr,
    });
    const Check = await Products.find({owner: user.id_owner, sku: newPr.sku})
    if (Check.length > 0) {
        return res.status(500).json({message: 'sku đã bị trùng'});
    }
    try {
        const newProduct = new Products({
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
}

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


