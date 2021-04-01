const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    firstname: 
    {
        type : String,
        required : true
    },
    lastname:
    {
        type : String,
        required : true
    },
    email: 
    {
        type: String,
        required: true,
        unique: true
    },
    password: 
    {
       type: String,
       required: true,

    }
});

UserSchema.pre("save", function(next) {
    var user = this;

    bcrypt.genSalt(10)
    .then((salt) => {
        //hash the password

        bcrypt.hash(user.password, salt)
        .then((encryptedPwd) => {
            user.password = encryptedPwd;
            next();
        })
        .catch((err) => {
            console.log(`Error occured when hashing. ${err}`);
        });

    })
    .catch((err) => {
        console.log(`Error occured when salting. ${err}`);
    });
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;