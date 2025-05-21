const Suppliers = require('../modules/supplier');
const { Types } = require("mongoose");
const { formatSupplier } = require('../utils/dataFormatter');
const { sendSuccess, sendError, sendBadRequest } = require('../utils/responseHandler');
const { asyncHandler } = require('../utils/errorHandler');

/**
 * Get supplier suggestions based on search query
 */
const getSupplierSuggestion = asyncHandler(async (req, res) => {
    const { query, ownerId } = req.query;

    if (!query) {
        return sendBadRequest(res, 'Query parameter is required');
    }

    const suppliers = await Suppliers.find({
        name: { $regex: query, $options: 'i' },
        owner: new Types.ObjectId(ownerId)
    })
    .select('_id name email phone address owner')
    .limit(5);

    // Format each supplier using the standardized formatter
    const formattedSuppliers = suppliers.map(supplier => formatSupplier(supplier));

    return sendSuccess(res, formattedSuppliers);
}, { errorMessage: 'Error searching suppliers' });

module.exports = {
    getSupplierSuggestion
}
