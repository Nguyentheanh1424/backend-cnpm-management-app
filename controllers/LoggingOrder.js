const mongoose = require("mongoose");
const LoggingOrder = require('../modules/logging_order')
const OrderDetailHistory = require('../modules/order_detail_history')
const Products = require('../modules/product')
const getLogging = async(req,res)=>{
    try {
        const { search, limit = 10, page = 1,ownerId } = req.query;
        const limitNum = Math.max(1, parseInt(limit));
        const pageNum = Math.max(1, parseInt(page));

        let query = {};

        if (search) {
            if (mongoose.Types.ObjectId.isValid(search)) {
                query.orderDetailId = new mongoose.Types.ObjectId(search);;
            } else if (Date.parse(search)) {
                query.createdAt = {
                    $gte: new Date(search),
                    $lt: new Date(new Date(search).setDate(new Date(search).getDate() + 1))
                };
            } else {
                query.userName = { $regex: search, $options: 'i' };
            }
        }
        query.ownerId = new mongoose.Types.ObjectId(ownerId);
        console.log("query :", query)
        const skip = (pageNum - 1) * limitNum;

        const logs = await LoggingOrder.aggregate([
            {
                $match: query
            },
            {
                $skip: skip
            },
            {
                $limit: limitNum
            },

            {
                $lookup: {
                    from: 'OrderDetailHistory',
                    localField: 'orderId',
                    foreignField: 'orderId',
                    as: 'orderDetail'
                }
            },
            {
                $unwind: {
                    path: '$orderDetail',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'Product',
                    localField: 'orderDetail.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    orderId: 1,
                    orderDetailId: '$orderDetail._id',
                    status: 1,
                    userName: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    details:1,
                    productName: {
                        $ifNull: ['$product.name', 'Không có sản phẩm']
                    },
                }
            }
        ]);
        const totalCount = await LoggingOrder.countDocuments(query);
        return res.status(200).json({
            logs,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNum),
            currentPage: pageNum,
            limit: limitNum
        });

    } catch (error) {
        console.error('Error fetching logging orders:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {
    getLogging
}