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
        if (error.code === 11000) {
            return { error: "Email đã tồn tại, vui lòng chọn email khác." };
        }
        return { error: "Đã có lỗi xảy ra, vui lòng thử lại." };
    }
}

module.exports = {
    createUserService
}