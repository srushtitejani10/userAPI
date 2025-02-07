const User = require('../modal/UserModel');
const fs = require('fs');
const path = require('path');

module.exports.insertData = async (req, res) => {
    try {
        let userData = await User.find();
        if (userData) {
            console.log("Insert Data");
            return res.status(200).json({ msg: "Request get successfully", userData});
        }
        else {
            return res.status(200).json({ msg: 'data not get', error: "err"})

        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ msg: 'something wrong', error: "err"})
    }
}

module.exports.addData = async (req, res) => {
    try {
        var image='';
        if(req.file){
            image = User.imgPath+'/'+req.file.filename;
        }
        req.body.userImage = image;

        let userData = await User.create(req.body);
        if (userData) {
            return res.status(200).json({ msg: "User Record Added Successfully", data: req.body })
        }
        else {
            return res.status(200).json({ msg: "failed to add record"})
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "something went wrong"});
    }
}

module.exports.delData = async(req,res)=>{
    
    let findData = await User.findById(req.params.id);
    if(findData){
        try{
            var imgPath = path.join(__dirname,'..',findData.userImage);
            await fs.unlinkSync(imgPath);
        } catch(err){
            console.log('image not found');
        }
    }
    let userData = await User.findByIdAndDelete(req.params.id);
    if (userData) {
        return res.status(200).json({ msg: "User Record Deleted Successfully", data: userData })
    }
    else {
        return res.status(200).json({ msg: "failed to delete record"})
    }
}

module.exports.getSingleData = async(req,res)=>{
    try{
        console.log(req.query.dataId);
        let singleData = await User.findById(req.query.dataId);
        if(singleData){
            return res.status(200).json({msg:'user record found', data:singleData})
        }
        else{
            return res.status(200).json({msg:'user not found'})
        }
    }
    catch(err){
        return res.status(400).json({msg:'something wrong',error:err});
    }
}

module.exports.updateData = async(req,res)=>{
    try{
        let findData = await User.findById(req.params.id);
        if(findData){
            try{
                var imgPath = path.join(__dirname,'..',findData.userImage);
                await fs.unlinkSync(imgPath);
            } catch(err){
                console.log('image not found');
            }
            var image = '';
            req.body.userImage= User.imgPath+'/'+req.file.filename;
        }
        console.log(req.body.userId);
        console.log(req.body);
        let updateData = await User.findByIdAndUpdate(req.body.userId,req.body);
        if(updateData){
            return res.status(200).json({msg:'record updated',data:req.body});
        }
        else{
            return res.status(200).json({msg:'record not update'})
        }
    }
    catch(err){
        return res.status(400).json({msg:'something wrong',error:err});
    }
}