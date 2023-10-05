const express = require('express');
const User = require('./models/UserModel');
require('dotenv').config({path:'.env.dev'});
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 9090;
const userRouter = require('./routes/UserRoutes');
const serviceRouter = require("./routes/ServiceRoutes");
const BookingRouter = require("./routes/BookingRoutes")
const { specs, swaggerUi } = require('./config/swagger'); 
const url = process.env.MONGO_DB_URL;
const cors = require('cors');
app.use(cookieParser());
mongoose.connect(url, { useNewUrlParser: true });
app.use(express.json());
const con = mongoose.connection;
app.use(cors());
con.on('open', async () => {
  console.log('DataBase connected.......');
  const admin = await User.findOne({role:"ADMIN"});
if(!admin){
  const password = await bcrypt.hash("rootroot",10)
  User.create({
    username:"root",
    email:"admin@gmail.com",
    password:password,
    role:"ADMIN"
  });
} 
});
app.use('/user', userRouter);
app.use("/service",serviceRouter)
app.use("/booking",BookingRouter)
const options = {
    customCss: '.swagger-ui .topbar { display: none } ',
    customSiteTitle: "Bike Service"
  };
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs,options));

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
