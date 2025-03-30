const express = require('express');
const { createUser } = require('../controllers/userController')

const routerAPI = express.Router();


routerAPI.post('/register', createUser)





module.exports = routerAPI; //export default