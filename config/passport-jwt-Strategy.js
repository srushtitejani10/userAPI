const passport = require('passport');

const Sjwt = require('passport-jwt').Strategy;

const Ejwt = require('passport-jwt').ExtractJwt;

var opts = {
    jwtFromRequest : Ejwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'secretKey'
}

const signUp = require('../modal/SignUpModel');

passport.use(new Sjwt(opts, async function(payload,done){
    let checkUserData = await signUp.findOne({email:payload.userData.email});
    if(checkUserData){
        return done(null, checkUserData);
    }
    else{
        return done(null, false)
    }
}))

passport.serializeUser((user,done)=>{
    return done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    let userData = await signUp.findById(id);
    if(userData){
        return done(null, userData);
    }
    else{
        return done(null, false);
    }
})
