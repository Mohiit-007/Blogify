  const mongoose = require("mongoose");
  const { createHmac, randomBytes } = require("crypto");

  const {createtoken} = require("../service/auth")

  const userSchema = new mongoose.Schema(
    {
      fullname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      salt: {
        type: String,
      //   required: true,
      },
      password: {
        type: String,
        required: true,
      },
      profileImage: {
        type: String,
        default: "/avatar.jpg",
      },
      role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
      },
    },
    { timestamps: true }
  );

  userSchema.pre("save", async function () {
    const user = this;

    if (!user.isModified("password")) {
      return ;
    }

    const salt = randomBytes(16).toString("hex");

    const hashedPassword = createHmac("sha256", salt)
      .update(user.password)
      .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

  });
  
  userSchema.static('matchpasswordandGenerateToken',async function (email , password) {
      const user =  await this.findOne({email})
      if(!user) throw new Error('User not found');
    
      const salt = user.salt;
      const userstoredhashedpassword = user.password;

      const userProvidedhashpassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

      if(userstoredhashedpassword !== userProvidedhashpassword) throw new Error('Incorrect password');

      // return {...user,password : undefined, salt : undefined};
      const token = createtoken(user);
      return token;
  })

  const User = mongoose.model("User", userSchema);
  module.exports = User;
