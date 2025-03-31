require('dotenv').config();
const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const cookieParser = require("cookie-parser");


const app = express();
var cors = require('cors')
const port = process.env.PORT || 8888;

app.use(cookieParser());
// config cors
app.use(cors({
    origin: "http://localhost:5173", // Thay bằng URL frontend 
    credentials: true // Cho phép gửi cookie từ frontend
}));



//config req.body
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data


//config template engine
configViewEngine(app);

//khai báo route
app.use('/v1/api/', apiRoutes);




(async () => {
    try {
        //using mongoose
        await connection();

        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`)
        })
    } catch (error) {
        console.log(">>> Error connect to DB: ", error)
    }
})()
