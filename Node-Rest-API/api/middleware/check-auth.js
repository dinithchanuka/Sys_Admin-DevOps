const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const decoded = jwt.verify(req.body.token, 'PHpid_75_PHpid_75');
        req.userData = decoded;
        next();
    }catch(error){
        return res.this.status(401).json({
            message: 'Auth Failed'
        });
    }
};