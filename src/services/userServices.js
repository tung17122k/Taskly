const User = require("../models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUserService = async (userData) => {
    const { username, email, password } = userData;
    //hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);
    console.log(">>>>hash password: ", hashPassword);
    try {
        const user = await User.create({
            username,
            email,
            password: hashPassword,
            role: "user",
        });
        console.log(">>>check user: ", user);
        return user;
    } catch (error) {
        console.log(error);

    }
}

module.exports = {
    createUserService
}