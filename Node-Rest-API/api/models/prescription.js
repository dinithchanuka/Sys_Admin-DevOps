const mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    date: { type: Date },
    medicines: { type: String }

});

module.exports = mongoose.model('Prescription',prescriptionSchema);