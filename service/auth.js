const JWT =  require("jsonwebtoken")

const secret = "mohit2005"

function createtoken(user){
    const payload = {
        name : user.fullname,
        id : user._id,
        email : user.email,
        profileImage : user.profileImage,
        role : user.role,
    };
    const token = JWT.sign(payload,secret);
    return token;
}

function verifytoken(token){
    return JWT.verify(token,secret);
}

module.exports = {
    createtoken , verifytoken ,
}