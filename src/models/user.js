const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        unqiue: true
    },
    confirmpassword: {
        type: String,
        required: true,
        unqiue: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

});

//  genrate token 
userSchema.methods.genrateToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString()}, "process.env.SECRET_KEY")
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (error) {
        res.send(error);
    }
}
// hashing password
userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
    next();

});

const User = new mongoose.model("User", userSchema);



module.exports = User;