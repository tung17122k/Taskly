require("dotenv").config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const createUserService = async (userData) => {
    const { username, email, password } = userData;
    // check if user exists

    const user = await User.findOne({ email }).exec();
    if (user) {
        return { error: "Email đã tồn tại, vui lòng chọn email khác." };
    }

    //hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);
    try {
        const user = await User.create({
            username,
            email,
            password: hashPassword,
            // role: "customer",
        });

        return user;
    } catch (error) {

        return { error: error };
    }
}

const getUserService = async (limit, page) => {
    try {
        let result = [];
        let total = 0
        total = await User.countDocuments({}).exec();

        if (limit && page) {
            result = await User.find({}).limit(limit).skip(parseInt((page - 1) * limit)).select("-password").exec();
        } else {
            result = await User.find({}).select("-password").exec();
        }


        return {
            data: result,
            total: total
        };
    } catch (error) {
        console.log(error);
        return { error: "Đã có lỗi xảy ra, vui lòng thử lại." };
    }

}


const updateUserService = async (data) => {
    let { username, role, userId } = data;
    if (!userId) {
        return { error: "Đã có lỗi xảy ra, vui lòng thử lại." };
    try {
        let result = await User.updateOne({ _id: userId }, { username, role }).exec();
        return result;
    } catch (error) {
        console.log(error);
        return { error: "Đã có lỗi xảy ra, vui lòng thử lại." };
    }
}

const deleteAUserService = async (userId) => {
    try {
        let result = await User.deleteById({ _id: userId }).exec();
        return result
    } catch (error) {
        console.log(error);
        return { error: "Đã có lỗi xảy ra, vui lòng thử lại." };
    }
}

const loginService = async (email, password) => {
    try {
        //fetch user by email
        const user = await User.findOne({ email: email }).exec();


        if (!user) {
            return {
                EC: 1,
                message: "Email không tồn tại"
            };
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { message: "Password không hợp lệ.", EC: 2 };
        } else {
            // create access token
            const payload = {
                email: user.email,
                username: user.username,
                role: user.role,
            }
            const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE, });
            const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
                expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
            });

            return {
                access_token,
                refresh_token,
                EC: 0,
                user: {
                    email: user.email,
                    username: user.username,
                    role: user.role,
                }
            };
        }



    } catch (error) {
        console.log(error);
    }
}
const refreshTokenService = async (refreshToken) => {

    try {
        if (!refreshToken) {
            return { error: "Refresh token không hợp lệ." };
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        if (!decoded.email) {
            return { error: true, message: "User không tồn tại" };
        }

        const user = await User.findOne({ email: decoded.email }).exec();

        if (!user) {
            return { error: "Refresh token không hợp lệ." };
        }

        const payload = {
            email: decoded.email,
            username: decoded.username,
            role: decoded.role,
        };

        const newAccessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || "15m" }
        );

        return { access_token: newAccessToken };

    } catch (error) {
        return { error: "Refresh token không hợp lệ hoặc đã hết hạn." };
    }
}



module.exports = {
    createUserService,
    loginService,
    refreshTokenService,
    getUserService,
    updateUserService,
    deleteAUserService
}