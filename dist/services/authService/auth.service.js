import { StatusCodes } from "http-status-codes";
import AuthModel from "../../models/auth/auth.model";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const register = async (req, res) => {
    const { firstName, lastName, email, password, } = req.body;
    try {
        let user = await AuthModel.findOne({ email });
        if (user) {
            user.refreshToken = '';
            await user.save();
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exist" });
        }
        const newUser = new AuthModel({
            firstName,
            lastName,
            email,
            password,
            isAdmin: true
        });
        await newUser.save();
        const accessToken = jwt.sign({
            id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15m'
        });
        const refreshtToken = jwt.sign({
            id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        });
        newUser.refreshToken = refreshtToken;
        await newUser.save();
        res.cookie('auth', refreshtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 90000,
            sameSite: 'strict'
        });
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User has been created successfully",
            newUser,
            accessToken,
            refreshtToken
        });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await AuthModel.findOne({ email, isAdmin: true });
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Credentials" });
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Credentials" });
        }
        const accessToken = jwt.sign({
            id: user._id, email: user.email, isAdmin: user.isAdmin
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h"
        });
        res.cookie('auth', accessToken, {
            maxAge: 86400000,
            sameSite: 'strict',
            httpOnly: true,
            secure: process.env.JWT_SECRET_KEY === 'production'
        });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        user.refreshToken = refreshToken;
        await user.save();
        return res.status(StatusCodes.OK).json({
            message: "User has been logged in successfully",
            id: user._id,
            isAdmin: user.isAdmin,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};
const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Credentials" });
    }
    try {
        const userPayload = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
        const user = await AuthModel.findById(userPayload.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        }
        const newAccessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "15m"
        });
        return res.status(StatusCodes.OK).json({
            message: "New access token has been retrieved successfully",
            newAccessToken
        });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};
const userLogOut = async (req, res) => {
    try {
        res.cookie('auth', '', {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return res.status(StatusCodes.OK).json({
            message: "User has been logged out successfully"
        });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};
const updateAccount = async (req, res) => {
    const { firstName, lastName, email, password, } = req.body;
    const { id } = req.params;
    try {
        const updateUser = await AuthModel.findByIdAndUpdate(id, { firstName, lastName, email, password, isAdmin: true }, { new: true, runValidators: true });
        if (!updateUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User account doesn't exist" });
        }
        return res.status(StatusCodes.OK).json({
            message: "User has been updated successfully.",
            updateUser
        });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};
const removeUserAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteUser = await AuthModel.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User account doesn't exist" });
        }
        return res.status(StatusCodes.OK).json({
            message: "User's account has been deleted successfully.",
            deleteUser
        });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};
const fetchUsers = async (req, res) => {
    try {
        const users = await AuthModel.find();
        return res.status(StatusCodes.OK).json({ message: "Users have been fetched successfully", users });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};
const fetchUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await AuthModel.findById(id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User does not exist" });
        }
        return res.status(StatusCodes.OK).json({ message: "User has been fetched successfully", user });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};
export { register, login, userLogOut, refreshAccessToken, updateAccount, removeUserAccount, fetchUsers, fetchUser };
//# sourceMappingURL=auth.service.js.map