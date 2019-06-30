const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.status(200).json({
        message: 'Patients were fetched'
    });
});

router.post('/',(req, res, next) => {
    const patient = {
        patientId: req.body.patientId,
        phone: req.body.phone
    }
    res.status(200).json({
        message: 'Patient were created', 
        patient: patient
    });
});

router.get('/:patientId',(req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        patientId: req.params.patientId
    });
});

router.patch('/:patientId',(req, res, next) => {
    res.status(200).json({
        message: 'Updated patient',
        patientId: req.params.patientId
    });
});

router.delete('/:patientId',(req, res, next) => {
    res.status(200).json({
        message: 'Deleted patient',
        patientId: req.params.patientId
    });
});

module.exports = router;