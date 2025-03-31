const express = require('express');
const { createUser, handleLogin, handleRefreshToken } = require('../controllers/userController')

const routerAPI = express.Router();


routerAPI.post('/register', createUser)

routerAPI.post('/login', handleLogin)

routerAPI.post("/refresh-token", handleRefreshToken);







module.exports = routerAPI; //export default