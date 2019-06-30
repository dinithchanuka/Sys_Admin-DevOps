const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Prescription = require('../models/prescription');
const Doctor = require('../models/doctor');

router.get('/',(req, res, next) => {

    Prescription.find()
        .select('doctor medicines _id') 
        .populate('doctor','name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        doctor: doc.doctor,
                        medicines: doc.medicines,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/prescription/'+doc._id
                        }
                    }
                })
                
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/',(req, res, next) => { 

    Doctor.findById(req.body.doctorId)
        .then(doctor => {
            if(!doctor){
                return res.status(404).json({
                    message: "Product Not Found"
                });
            }
            const prescription = new Prescription({
                _id: mongoose.Types.ObjectId(),
                medicines: req.body.medicines, 
                doctor: req.body.doctorId   
            });
            return prescription.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Prescription Stored',
                createdPrescription: {
                    _id: result._id,
                    doctor: result.doctor,
                    medicines: result.medicines   
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/prescription/'+result._id   
                }  
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:prescriptionID',(req, res, next) => {

    Prescription.findById(req.params.prescriptionID)
        .populate('doctor','name')
        .exec()
        .then(prescription => {
            if(!prescription){
                return res.status(404).json({
                    message: 'Prescription Not Found'
                });
            }
            res.status(200).json({
                prescription: prescription,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/prescription'
                }   
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:patientId',(req, res, next) => {
    res.status(200).json({
        message: 'Updated patient',
        patientId: req.params.patientId
    });
});

router.delete('/:prescriptionID',(req, res, next) => {

    const id = req.params.prescriptionID;
    Prescription.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Prescription Deleted',
                request: {
                    type: 'POST',
                    url: 'http;//localhost:3000/prescription',
                    body: { prescriptionId: 'ID', Medicines: 'String' }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;