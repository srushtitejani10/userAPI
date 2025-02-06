const signUp = require('../modal/SignUpModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signUp = async(req,res)=>{
    try{
        console.log(req.body);
        let checkData = await signUp.find({email:req.body.email}).countDocuments();
        if(!checkData){
            if(req.body.password == req.body.confirmPassword){
                req.body.password = await bcrypt.hash(req.body.password,10);
                let signUpUser = await signUp.create(req.body);
                if(signUpUser){
                    return res.status(200).json({msg:'user signup successfully'})
                } else{
                    return res.status(200).json({msg:'user not signup'})
                }
            } else{
                return res.status(200).json({msg:'password and confirm-password are not match'})
            }
        } else{
            return res.status(200).json({msg:'email already exist please try another email!!'})
        }
    }
    catch(err){
        return res.status(400).json({msg:'something wrong',error:err});
    }
}

module.exports.signIn = async(req,res)=>{
    try{
        let checkEmail = await signUp.findOne({email:req.body.email});
        if(checkEmail){
            let checkPassword = await bcrypt.compare(req.body.password,checkEmail.password)
            if(checkPassword){
                let token = await jwt.sign({userData:checkEmail},'secretKey');
                if(token){
                    return res.status(200).json({msg:'login succefully', data:token})
                }
                else{
                    return res.status(200).json({msg:'user not login'})
                }
            } else{
                return res.status(200).json({msg:'password is incorect'})
            }
        }
        else{
            return res.status(200).json({msg:'email not found'})
        }
    }
    catch(err){
        return res.status(400).json({msg:'something wrong',error:err});
    }
}