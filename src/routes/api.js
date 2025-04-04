const express = require('express');
const { createUser, handleLogin, handleRefreshToken, getUser } = require('../controllers/userController')

const routerAPI = express.Router();


routerAPI.post('/register', createUser)

routerAPI.get('/user', getUser)

routerAPI.post('/login', handleLogin)

routerAPI.post("/refresh-token", handleRefreshToken);







module.exports = routerAPI; //export default