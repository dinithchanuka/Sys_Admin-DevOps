const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required:true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type:String, required: true }
});

module.exports = mongoose.model('Patient',patientSchema);