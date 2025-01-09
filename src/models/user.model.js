import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,  //cloudinary url
        required: true

    },
    coverimage: {
        type: String
    },
    watchhistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "password is required"]
    },
    refreshToken: {
        type: String,

    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 19)
    next();
});

userSchema.method.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)

}
userSchema.method.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPAIRY

        }

    )
}
userSchema.method.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPAIRY

        }

    )
}


export const User = mongoose.model("User", userSchema)