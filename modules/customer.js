const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String},
    phone: { type: String, required: true }, // required = true trường này bắt buộc phải có giá trị khi tạo mới một khách hàng.
    email: { type: String},
    rate: { type: Number,default:0},
    owner: {
        type: mongoose.Schema.Types.ObjectId, // cho biết đây là một tham chiếu đến một document khác trong MongoDB
        ref: 'Users',
        required: true
    },
    creater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    money:{
        type:String,
        default:"0.000"
    },
    lastPurchaseDate: { type: Date ,default:null},
    firstPurchaseDate: { type: Date ,default:null},
}, { timestamps: true });

const Customer = mongoose.model('Customers', customerSchema,'Customers'); // Tạo model Customer từ schema customerSchema và ánh xạ nó với collection 'Customers' trong MongoDB
module.exports = Customer; // Xuất model Customer để có thể sử dụng ở các tệp khác trong ứng dụng
