const express = require('express');

const routes = express.Router();

const userCtl = require('../controller/userController');

const passport = require('passport');

const User = require('../modal/UserModel');

routes.use('/auth',require('../routes/authRoute'))

routes.get('/unauth', async(req,res)=>{
    return res.status(400).json({msg:'you are unauthorized'})
})
routes.get('/',passport.authenticate('jwt',{failureRedirect:'/unauth'}),userCtl.insertData)

routes.post('/addData',passport.authenticate('jwt',{failureRedirect:'/unauth'}),User.uploadImage,userCtl.addData);

routes.delete('/delData/:id',passport.authenticate('jwt',{failureRedirect:'/unauth'}),userCtl.delData);

routes.get('/getSingleData',passport.authenticate('jwt',{failureRedirect:'/unauth'}),userCtl.getSingleData);

routes.put('/updateData',passport.authenticate('jwt',{failureRedirect:'/unauth'}),User.uploadImage,userCtl.updateData)



module.exports = routes;