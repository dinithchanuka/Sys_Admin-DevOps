const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const Doctor = require('../models/doctor');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null,Math.random().toString(36).substring(6)+file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/',(req, res, next) => {

    Doctor.find()
    .select('name email _id doctorImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            doctors: docs.map( doc => {
                return{
                    name: doc.name,
                    email: doc.email,
                    doctorImage: doc.doctorImage,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/doctor/"+doc._id
                    }
                }
            })
        };
        console.log(docs);
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/',checkAuth, upload.single('doctorImage'), (req, res, next) => {

    console.log(req.file);
    const doctor = new  Doctor({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        doctorImage: req.file.path
    });
    doctor
        .save()
        .then(result => {
            console.log(result); 
            res.status(200).json({
                message: 'Doctor were created',
                createdDoctor: {
                    name: result.name, 
                    email: result.email,
                    doctorImage: result.doctorImage,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/doctor/"+result._id
                    } 
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

router.get('/:doctorID',(req, res, next) => {

    const id = req.params.doctorID;
    Doctor.findById(id)
    .select('name email _id doctorImage')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get All Doctors',
                    url: 'http://localhost/doctor'
                }
            });
        }else{
            res.status(404).json({
                message: 'No Valid entry found for provided ID'
            });
        }   
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:doctorID',(req, res, next) => {

    const id = req.params.doctorID;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Doctor.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product Updated',
            request:{
                type: 'GET',
                url: 'http://localhost:3000/doctor/'+id
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

router.delete('/:doctorID',(req, res, next) => {

    const id = req.params.doctorID;//problem in  here
    Doctor.findByIdAndDelete({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;