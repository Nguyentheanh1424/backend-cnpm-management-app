const Product = require('../modules/product');
const History = require('../modules/history');
const Cloudinary = require('cloudinary').v2;
const Suppliers = require('../modules/supplier');
const SupplierChangeHistory = require('../modules/history_change_supplier');
const mongoose = require('mongoose');
const logger = require('../config/logger');

Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Get a product list
const show = async (req, res) => {
    const {user} = req.body;
    try {
        const products = await Product.find({owner: user.id_owner});
        res.json(products);
    } catch (error) {
        logger.error('Error fetching products:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

// Edit product
const edit = async (req, res) => {
    const {user, product_edit, detail, check} = req.body;
    try {
        let product = await Product.find({_id: product_edit._id});
        product = product[0];

        if (product.image && product.image.public_id && check) {
            const publicId = product.image.public_id;
            const result = await Cloudinary.uploader.destroy(publicId);
            if (result.error) {
                logger.error("Error deleting image from Cloudinary:", result.error);
            }
            logger.info("Cloudinary delete result:", result);
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
                logger.error('Error saving product history:', err);
            }
        }
        res.json({message: "success"});
    } catch (error) {
        logger.error('Error updating product:', error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Delete product
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
                logger.error('Error deleting image from Cloudinary:', result.error);
            }
            logger.info('Cloudinary delete result:', result);
        }
        res.status(200).json({message: 'Product deleted successfully'});
    } catch (error) {
        logger.error('Error deleting product:', error);
        res.status(500).json({message: error.message});
    }
};

// Get product details
const showDetail = async (req, res) => {
    try {
        const product = await Product.findOne({_id: req.params.id})
            .populate("supplier")
            .lean();
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};

// Create a new product
const create = async (req, res) => {
    const {user, newPr, detail} = req.body;
    logger.info(`Creating new product: ${JSON.stringify(newPr)}`);
    const Check = await Product.find({owner: user.id_owner, sku: newPr.sku})
    if (Check.length > 0) {
        return res.status(500).json({message: 'SKU already exists'});
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
        logger.error('Error creating product:', error);
        res.status(500).json({message: error.message});
    }
};

// Get product change history
const getHistory = async (req, res) => {
    const {user} = req.body;
    try {
        const activities = await History.find({owner: user.id_owner})
            .populate('employee', 'name email')
            .sort({timestamp: -1})
            .select('employee product action timestamp details')
            .lean();
        res.status(200).json(activities);
    } catch (error) {
        logger.error('Error fetching product history:', error);
        res.status(500).json({message: error.message});
    }
};

const getSupplier = async (req, res) => {
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
        logger.error('Error fetching suppliers:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

// Create a new supplier
const createSupplier = async (req, res) => {
    const {name, email, phone, address, user} = req.body;
    try {
        let check = await Suppliers.findOne({owner: user.id_owner, phone});
        if (check) {
            return res.status(500).json({message: 'Phone number already exists'});
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
        logger.error('Error creating supplier:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

// Edit supplier
const editSupplier = async (req, res) => {
    const {user, supplier_edit} = req.body;
    try {
        let supplier = await Suppliers.find({_id: supplier_edit._id});
        if (supplier.length == 0) {
            return res.json({message: "Supplier not found"});
        }
        supplier = supplier[0];
        let check = await Suppliers.findOne({
            _id: {$ne: supplier._id},
            owner: user.id_owner,
            phone: supplier_edit.phone
        });
        if (check) {
            logger.warn(`Phone number ${supplier_edit.phone} already registered to another supplier`);
            return res.json({message: "This phone number is already registered"});
        }
        const oldProduct = JSON.parse(JSON.stringify(supplier));

        // Update product information
        supplier = await Suppliers.findByIdAndUpdate(
            supplier_edit._id,
            supplier_edit,
            {new: true, runValidators: true}
        );

        if (!supplier) {
            return res.status(404).json({message: 'supplier not found'});
        }

        const updatedFields = Object.keys(supplier_edit);

        // Filter out the createdAt field from the list of changes
        const filteredFields = updatedFields.filter(field => {
            if (field == 'creator' || field == 'owner') {
                return false;
            }

            return oldProduct[field] !== supplier_edit[field]
        });

        logger.debug(`Fields changed in supplier: ${JSON.stringify(filteredFields)}`);
        if (filteredFields.length > 0) {
            const changes = filteredFields.map(field => {
                const oldValue = oldProduct[field];
                const newValue = supplier_edit[field];

                return `${field} changed from '${oldValue}' to '${newValue}'`;
            });

            const history = new supplierCHistory({
                owner: user.id_owner, //
                employee: user._id,
                supplier: supplier_edit.name,
                action: 'update',
                details: `${changes.join(', ')}. `  // Add change details to history
            });

            try {
                await history.save();
            } catch (err) {
                logger.error('Error saving supplier history:', err);
            }
        }
        res.json({message: "success"});
    } catch (error) {
        logger.error('Error updating supplier:', error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Get change history
const getHistorySupplier = async (req, res) => {
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
        logger.error('Error fetching supplier history:', error);
        res.status(500).json({message: error.message});
    }
};

// Delete supplier
const deleteSupplier=async(req, res)=>{
    const { user,supplier_delete,detail } = req.body;
    try {
        const supplier = await Suppliers.findByIdAndDelete(supplier_delete._id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
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

// Get products by supplier
const getProductsBySupplier = async (req, res) => {
    const { productId,ownerId } = req.query;
    logger.info(`Fetching products for supplier ID: ${productId}, owner ID: ${ownerId}`);
    const objectIdSupplierId = new mongoose.Types.ObjectId(productId);
    // Check if productId exists in query params
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
        // Return the list of products if found
        res.status(200).json(products);
    } catch (error) {
        logger.error("Error fetching products by supplier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Search products by name
const getProductsByProductName = async (req, res) => {
    const { query,ownerId } = req.query;
    const objectProductId = query;
    logger.info(`Searching products with name: "${query}", owner ID: ${ownerId}`)
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
        // Return the list of products if found
        res.status(200).json(products);
    } catch (error) {
        logger.error("Error searching products by name:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    show,
    edit,
    deletes,
    showDetail,
    create,
    getHistory,
    getSupplier,
    createSupplier,
    editSupplier,
    getHistorySupplier,
    deleteSupplier,
    getProductsBySupplier,
    getProductsByProductName,
}
