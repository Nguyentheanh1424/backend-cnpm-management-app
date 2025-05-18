const { mongo, default: mongoose } = require('mongoose');
const Suppliers =require('../modules/supplier')

const getSupplierSuggestion=async(req,res) =>{
    const { query,ownerId } = req.query;
    console.log(query,ownerId)
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const suppliers = await Suppliers.find({
            name: { $regex: query, $options: 'i' },
            owner: new mongoose.Types.ObjectId(ownerId)
        })
            .select('_id name').limit(5);
        res.json(suppliers);
    } catch (err) {
        console.error('Error searching suppliers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getSupplierSuggestion
}