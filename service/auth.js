const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

function createtoken(user) {
    const payload = {
        id : user._id,
        name : user.fullname,
        email : user.email,
        profileImageURL : user.profileImageURL,
        role : user.role,
    }
    return jwt.sign(payload,secret);
}

function getUser(token){
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null; 
  }
}

module.exports = { createtoken , getUser };
