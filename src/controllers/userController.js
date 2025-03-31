const User = require("../models/user")
const { createUserService } = require("../services/userServices")

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

module.exports = {
    createUser
}