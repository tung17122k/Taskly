const express = require('express');
const { createUser, handleLogin, handleRefreshToken, getUser, getAccount, putUpdateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { createCategory, getCategory, deleteCategory } = require('../controllers/categoryController');

const routerAPI = express.Router();

routerAPI.all("*", auth)


routerAPI.post('/register', createUser)

routerAPI.get('/user', getUser)

routerAPI.put('/user', putUpdateUser)

routerAPI.delete('/user', deleteUser)

routerAPI.post('/login', handleLogin)

routerAPI.post("/refresh-token", handleRefreshToken);

routerAPI.get("/account", getAccount)

routerAPI.post('/category', createCategory)

routerAPI.get('/category', getCategory)

routerAPI.delete('/category', deleteCategory)







module.exports = routerAPI; //export default