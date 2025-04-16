const User = require("../models/user")
const { createUserService, loginService, refreshTokenService, getUserService } = require("../services/userServices")

const createUser = async (req, res) => {
    const result = await createUserService(req.body)


    if (result.error) {
        return res.status(400).json({
            message: result.error,
            errorCode: 400,
        })
    }
    return res.status(200).json({
        data: result,
        message: "create user success"
    })
}

const getUser = async (req, res) => {
    const { limit, page } = req.query
    const result = await getUserService(limit, page)

    return res.status(200).json({
        data: result.data,
        total: result.total,
        message: "get user success"
    })
}


const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            EC: 1,
            message: "Email và password là bắt buộc"
        });
    }

    const data = await loginService(email, password);

    if (data.EC !== 0) {
        return res.status(400).json({
            EC: data.EC,
            message: data.message,
            data: null
        });
    }

    res.cookie("refresh_token", data.refresh_token, {
        // httpOnly: true, // Không thể truy cập từ JavaScript (chống XSS)
        // secure: true, // Chỉ gửi qua HTTPS (cần bật khi deploy)
        sameSite: "Strict", // Chống CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return res.status(200).json({
        EC: 0,
        message: "login success",
        data: data
    })
}

const handleRefreshToken = async (req, res) => {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
        return res.status(401).json({
            message: "Refresh token không hợp lệ.",
            errorCode: 401,
        });
    }
    const result = await refreshTokenService(refresh_token);

    if (result.error) {
        return res.status(403).json({
            message: result.error,
            errorCode: 403,
        });
    }

    return res.status(200).json({
        message: "Refresh token thành công",
        data: result,
    });
}

const getAccount = async (req, res) => {
    return res.status(200).json(req.user)
}



module.exports = {
    createUser,
    getUser,
    handleLogin,
    handleRefreshToken,
    getAccount
}