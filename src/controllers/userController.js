const User = require("../models/user")
const { createUserService } = require("../services/userServices")

const createUser = async (req, res) => {
    const result = await createUserService(req.body)
    if (result) {
        return res.status(200).json({
            data: result,
            message: "create user success"
        })
    }
}

module.exports = {
    createUser
}