const express = require('express');
const mongoose = require('mongoose');
authRoutes = require("./routes/authRoutes")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require("cors")
const { requireAuth, checkUser } = require("./middlewares/authMiddleware")


const app = express() 




const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// middleware
app.use(express.static('public'));  
app.use(express.json())  
app.use(cookieParser())
app.use(cors(corsOptions));
// app.use(bodyParser())


// view engine
app.set('view engine', 'ejs');  

// database connection
const dbURI = 'mongodb://localhost:27017/JSW_auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000, () => console.log("Connected to DB")))
  .catch((err) => console.log(err));

// routes

app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)

