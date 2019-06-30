const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const doctorRoutes = require('./api/routes/doctors');
const patientRoutes = require('./api/routes/patients');
const prescriptionRoutes = require('./api/routes/prescription');
const userRoutes = require('./api/routes/user');

mongoose.connect("mongodb+srv://isharadilshan:"+
    process.env.MONGO_PW+
    "@cluster0-2sai8.mongodb.net/test?retryWrites=true",
    { 
        useNewUrlParser: true 
    });

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Contrl-Allow-Headers',
    'Origin,X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/doctor',doctorRoutes);
app.use('/patient',patientRoutes);
app.use('/prescription',prescriptionRoutes);
app.use('/user',userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
       error: {
           message: error.message
       }
   });
});

module.exports = app;
