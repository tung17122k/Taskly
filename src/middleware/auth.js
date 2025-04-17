require("dotenv").config();
const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {
    const white_lists = ["/", "/login", "/register", "/refresh-token"];
    const path = req.path;

    if (white_lists.includes(path)) {
        return next();
    }

    if (req?.headers?.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        // console.log(">>>token", token);
        // verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(">>>decoded", decoded);
            req.user = decoded;
            // phân quyền admin crud user
            if (req.path === "/user" && decoded.role !== "admin") {
                return res.status(403).json({
                    message: "Forbidden. You are not allowed to access this resource.",
                    errorCode: 403,
                });
            }
            next();
        } catch (error) {
            return res.status(401).json({
                message: "Unauthorized",
                errorCode: 401,
            })
        }
    } else {
        return res.status(401).json({
            message: "Unauthorized",
            errorCode: 401,
        })
    }

}

module.exports = auth;