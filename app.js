const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser')
const connectDB = require('./utils/db')
const cors = require('cors')
const useragent = require('express-useragent');
require('dotenv').config()



const app = express()

//CORS
app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
      credentials: true,
    })
  );

  connectDB();

  //Body parser for incoming request
app.use(bodyParser.json());


//Securing HTTP headers
app.use(helmet());


//Get user agent
app.use(useragent.express());

const signupRoute = require('./routes/signup/signup')
const authRoute = require('./routes/signup/login')
const details = require('./routes/wallet/wallet')
const invest = require('./routes/wallet/invest')
const plan = require('./routes/wallet/plan')


app.use('/api', details)
app.use('/api', signupRoute)
app.use('/api', authRoute)
app.use('/api', invest)
app.use('/api', plan)

app.listen(process.env.PORT || 3000)