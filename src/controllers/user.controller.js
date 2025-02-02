import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const users = await User.findById(userId)
        console.log(users);

        const accessToken = users.generateAccessToken()
        const refreshToken = users.generateRefreshToken()

        console.log(accessToken);



        users.refreshToken = refreshToken
        await users.save({ validateBeforeSave: false })

        return { refreshToken, accessToken }

    } catch (error) {
        throw new ApiError(500, "Somthing went wrong while generating refresh and access Token")
    }
}
const registerUser = asyncHandler(async (req, res) => {

    //get user details from frontend
    const { fullname, email, password, username } = req.body

    if ([fullname, email, password, username].some((field) =>
        field?.trim() === "")) {
        throw new ApiError(400, "all fileds are required")
    }

    //user alredy available or not by (email, or username, mobile name)

    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existUser) {
        throw new ApiError(409, "user with email and username alredy exist")
    }

    // check for images check for avatar
    // console.log(existUser)
    const avatarLocalPath = req.files?.avatar[0]?.path;

    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is require")
    }

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    // upload them to cloudinary
    const avtar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avtar) {
        throw new ApiError(400, " Avatar is requirer")
    }



    //create user object- crate entry in db
    const user = await User.create({
        fullname,
        avatar: avtar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })
    // remove password and refresh tokenfield from response
    const createUser = await User.findById(user._id).select(
        "-password -refreshToken")
    // check for user creation   
    console.log(createUser)
    if (!createUser) {
        throw new ApiError(500, "Somthing went wrong while registering user")
    }
    // return res
    return res.status(201).json(
        new ApiResponse(200, createUser, "User Register Successfull")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    // console.log(req.body)
    if (!email && !username) {
        throw new ApiError(400, "email Id Not exist")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "User Does not Exist")
    }
    // console.log("user find ")

    const isPasswordVaild = await user.isPasswordCorrect(password)
    console.log(isPasswordVaild);

    if (!isPasswordVaild) {
        throw new ApiError(401, "Invaide Credentials")
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password, -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "user Logged in Successfuly")
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const option = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("refreshToken", option)
        .clearCookie("accessToken", option)
        .json(new ApiError)
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const newToken = req.cookie.refreshToken || req.body.refreshToken
    if (!newToken) {
        throw new ApiError(401, "Unauthorise Request")
    }
    try {
        const deCodeToken = jwt.verify(
            newToken,
            process.env.REFRESH_TOKEN_SECRET,
        )
        const tempUser = await User.findById(deCodeToken._id)
        if (!tempUser) {
            throw new ApiError(401, "Invailed refresh Token")
        }
        if (newToken !== tempUser?.refreshToken) {
            throw new ApiError(401, "Refresh token expire or used")
        }

        const option = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(tempUser._id)
        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, option)
            .cookie("accessToken", accessToken, option)
            .json(
                new ApiResponse(
                    200, { accessToken, refreshToen: newRefreshToken }, "Access token Refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invailied refresh Token")

    }
})

const changePasswordUser = asyncHandler (async (req, res) => {
    const {newPassword, oldPassword} = req.body
    if ([newPassword, oldPassword].some((field) => filed?.trim()==="")){
        throw new ApiError(401, "Invailed Credential")
    }
    
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
