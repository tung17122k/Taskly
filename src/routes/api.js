const express = require('express');
const { createUser, handleLogin, handleRefreshToken, getUser } = require('../controllers/userController');
const auth = require('../middleware/auth');

const routerAPI = express.Router();

routerAPI.all("*", auth)


routerAPI.post('/register', createUser)

routerAPI.get('/user', getUser)

routerAPI.post('/login', handleLogin)

routerAPI.post("/refresh-token", handleRefreshToken);







module.exports = routerAPI; //export default