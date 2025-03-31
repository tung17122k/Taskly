require("dotenv").config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const createUserService = async (userData) => {
    const { username, email, password } = userData;
    //hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);
    try {
        const user = await User.create({
            username,
            email,
            password: hashPassword,
            role: "user",
        });

        return user;
    } catch (error) {
        if (error.code === 11000) {
            return { error: "Email đã tồn tại, vui lòng chọn email khác." };
        }
        return { error: "Đã có lỗi xảy ra, vui lòng thử lại." };
    }
}

const loginService = async (email, password) => {
    try {
        //fetch user by email
        const user = await User.findOne({ email: email }).exec();

        if (user) {
            // compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { message: "Password không hợp lệ.", EC: 2 };
            } else {
                // create access token
                const payload = {
                    email: user.email,
                    username: user.username,
                }
                const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE, });
                const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
                    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
                });

                return {
                    access_token,
                    refresh_token,
                    user: {
                        email: user.email,
                        username: user.username,
                    }
                };
            }
        } else {
            return { message: "Email không hợp lệ.", EC: 1 };
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
    refreshTokenService
}