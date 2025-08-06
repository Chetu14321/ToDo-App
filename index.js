const express=require('express')
const {StatusCodes} = require('http-status-codes')
require('dotenv').config()
const PORT=process.env.PORT
const app=express()
const connectdb=require("./db/db-connect")
const cookieParser=require("cookie-parser")
const path=require('path')
const todoRoutes=require('./route/todoRoute')

const cors = require('cors')


app.use(cors({
  origin: 'http://localhost:3000', // your React frontend URL
  credentials: true, // enable sending cookies
}));


// import cors from 'cors';
// app.use(cors()); // this line must be before any routes

app.use(express.static("./client/build"))
app.use(express.static("./build"))


app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.use(cookieParser(process.env.SECRET_KEY))


app.use(express.json())
// Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }))
// app.use(express.json())


//index route
app.get("/",async(req,res)=>{
    if(process.env.MODE==="development"){
    return res.status(StatusCodes.ACCEPTED).json({ message:"welcome to auth api"})
    }
    if(
        process.env.MODE==="production"
    ){
        res.sendFile("index.html",{root:path.join(__dirname,"/build")})    }
})

//api route
app.use(`/api/auth`,require('./route/auth.route'))
app.use('/api/todos', todoRoutes);



app.listen(PORT,function(){
    connectdb()
    console.log(`Server is running at http://localhost:${PORT}`)
})