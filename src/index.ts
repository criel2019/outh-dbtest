import express from 'express'
import mongoose, { Collection, Error } from 'mongoose';
import dotenv from "dotenv";
import config from './config/config'
import cors from "cors"
import session from 'express-session'
import ConnectMongoDBSession from "connect-mongodb-session"

dotenv.config();

const app = express()
app.use(express.json());

app.set("trust proxy", 1);
mongoose
.connect(config.mongo.url, config.mongo.options)
.then((result) => {
       // console.log(result)
       console.log('connected')
})
.catch((error) => {
       console.log(error.message)
})

 
const MongoDBStore = ConnectMongoDBSession(session);
const mongoDBStore = new MongoDBStore({
	uri: config.mongo.url,
  databaseName : 'advist' ,
	collection: "users"
});

mongoDBStore.on("error", () => {
	// Error's here!
});


app.use(cors({ origin: "https://criel-front.netlify.app", credentials: true }))


app.use(
  session({ 
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    store: mongoDBStore,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  }))


var passport = require('./controller/user')(app)
var userRoutes = require('./routes/user')(passport)
app.get("/", (req : express.Request , res : express.Response, next : express.NextFunction) => {
    res.send("hello")
})

// app.use((req : express.Request , res : express.Response, next : express.NextFunction) => {
//        const error = new Error('Not Found');
//         res.status(404).json({
//               message : error.message
//         });
//  });
app.use("/user", userRoutes)

app.get('/debug', function(req, res) {
  res.send('Hello ' + JSON.stringify(req.session));
});
 


const port = process.env.PORT || 8081
app.listen(port,()=>console.log("start"+port))