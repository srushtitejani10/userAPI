const { query } = require('express');
const User = require('../modal/UserModel');
const fs = require('fs');
const path = require('path');

module.exports.addData = async (req, res) => {
    try {

        var page = 0;
        var per_page = 2;
        if(req.query.page){
            page = req.query.page
        }
        let search ='';
        if(req.query.search){
            search = req.query.search;
        }
        let userData = await User.find({status: true,
            $or:[
                {username:{ $regex:search,$options:'i'}},
                {email:{ $regex:search,$options:'i'}}
            ]
        }).skip(page*per_page).limit(per_page);

        let userTotalData = await User.find({status: true,
            $or:[
                {username:{ $regex:search,$options:'i'}},
                {email:{ $regex:search,$options:'i'}}
            ]
        }).countDocuments();

        let totalPage = Math.ceil(userTotalData/per_page);

        let userFalseData = await User.find({status: false});
        if (userData) {
            console.log("Insert Data");
            return res.status(200).json({ msg: "Request get successfully", data:userData,deactiveData:userFalseData,totalPage:totalPage,page:page,search});
        }
        else {
            return res.status(200).json({ msg: 'data not get', error: "err"});  
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ msg: 'something wrong', error: "err"})
    }
}

module.exports.insertData = async (req, res) => {
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

module.exports.statusChange = async(req,res)=>{
    try{
        console.log(req.query); 
        let checkUserData = await User.findById(req.query.userId);
        if(checkUserData){
            if(req.query.userStatus=="true"){
                let changeStatus = await User.findByIdAndUpdate(req.query.userId,{status:false});
                if(changeStatus){
                    return res.status(200).json({msg:'status deactive Successfully'});
                } else{
                    return res.status(200).json({msg:'status not updated'});
                }
            } else{
                let changeStatus = await User.findByIdAndUpdate(req.query.userId,{status:true});
                if(changeStatus){
                    return res.status(200).json({msg:'status Active Successfully'});
                } else{
                    return res.status(200).json({msg:'status not updated'});
                }
            }
        }
    }
    catch(err){
        return res.status(400).json({msg:'something wrong',error:err});
    }
}