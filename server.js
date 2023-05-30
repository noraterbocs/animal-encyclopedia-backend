import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import validator from 'validator';
require('dotenv').config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
const listEndpoints = require('express-list-endpoints');
const API_KEY = process.env.API_KEY

// Routes
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

const isValidUsername = /^[a-zA-Z0-9_.-]{8,}$/
const userSchema = new mongoose.Schema({
  username: {
    type:String,
    required: true,
    unique: true,
     validate: {
      validator: (value) => isValidUsername.test(value)
    }
  },
  password: {
    type:String,
      required: true,
      validate: {
      validator: (value) => validator.isStrongPassword(value)
    }
  },
  email:{
    type:String,
    required:true,
    unique: true,
     validate: {
      validator: (value) => validator.isEmail(value)
    }
  },
  createdAt:{
    type:String,
    default: ()=> new Date()
  },
  accessToken: {
    // npm install crypto for this
    type:String,
    default: () => crypto.randomBytes(128).toString("hex")
  },
  avatar:{
    type:String,
    default:"/images/defaultAvatar.png"
  } ,
  badges:{
    type:Array,
    default:['/images/firstBadge.png']
  },
  history:{
    type:Array,
    default:[
    ]
  },
  totalScore:{
    type:Number,
    default:0
  }

});

const gameSchema = new mongoose.Schema({
newgeneratedText:{
  type:String
},
 previouslyGeneratedTexts:{
  type: Array
 }
});

const User = mongoose.model("User", userSchema);
const Game = mongoose.model("Game", gameSchema);

// register user and login requests
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
   try {
       // Perform password validation
    if (!validator.isStrongPassword(password)) {
      throw new Error("Invalid password. Password must be at least 8 characters long and contain a combination of uppercase letters, lowercase letters, numbers, and special characters.");
    }
    // Perform username validation
    if (!validator.matches(username, isValidUsername)) {
      throw new Error("Invalid username. Username must be at least 8 characters long and can only contain alphanumeric characters, underscores, dots, and dashes.");
    }
    // Perform email validation
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email address.");
    }
    const salt = bcrypt.genSaltSync();
    const newUser = await new User ({
      username: username,
      password: bcrypt.hashSync(password, salt),
      email:email
    }).save();
    if(newUser){
    res.status(201).json({
      success:true,
      response:{
        username: newUser.username,
        email: newUser.email,
        id: newUser._id,
        accessToken: newUser.accessToken,
        password:newUser.password
      }
    })
    } else {
    res.status(404).json({
    success:false,
    response:'Failed registration.'
})
    } 

  } catch (error) {
   console.log("Registration error:", error);
if(error.code === 11000){
  res.status(400).json({
        success: false,
        response: 'Username or email have been already used.',
      });
}
else if (error.message.includes("password")) {
      res.status(400).json({
        success: false,
        response: error.message,
      });
    } else if (error.message.includes("username")) {
      res.status(400).json({
        success: false,
        response: error.message,
      });
    } else if (error.message.includes("email")) {
      res.status(400).json({
        success: false,
        response: error.message,
      });
    } 
   
else {
      res.status(500).json({
        success: false,
        response: "Internal server error.",
      });
    }
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({
        success: true,
        response: {
          email: user.email,
          id: user._id,
          accessToken: user.accessToken
        }
      });
    } else {
      res.status(400).json({
        success: false,
        response: "The email address or password is incorrect. Please try again."
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response:{
        error:error,
        message:"Internal server error"
      }
    });
  }
});

// Authenticate user
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  try {
  const user = await User.findOne({accessToken: accessToken});
  if (user) {
    next();
  } else {
    res.status(401).json({
        success: false,
        response: "Authentication failed."
      })
  }
} catch (error) {
  res.status(500).json({
    success: false,
    response:{
      message:'Internal server error!',
      error:error
    } 
})
}};

// Get user info and post totalScore
app.get("/user",authenticateUser);
app.get("/user", async (req, res) => {
 const accessToken = req.header("Authorization");
 const user = await User.findOne({accessToken: accessToken});
 try{
 if(user){
res.status(200).json({success: true, response: user})
 }else{
  res.status(401).json({success: false, response: "Could not find user."})
 }
}catch(error){
  res.status(500).json({
    success: false,
    response:{
      message:'Internal server error',
      error:error
    } 
})
}
 
});

//updating total score, history, badges, avatar
app.patch("/user",authenticateUser);
app.patch("/user", async (req, res) => {
 try {
const { totalScoreIncrement, badges, avatar, history } = req.body;
    const accessToken = req.header("Authorization");

const updateFields = {
  // add username and password -> stretch goal
};
 if (history || totalScoreIncrement) {
      updateFields.$push = {};
      if (history) {
        updateFields.$push.history = { $each: [history] };
      }
      if (totalScoreIncrement) {
        updateFields.$inc = { totalScore: parseInt(totalScoreIncrement) };
      }
  }
  if (badges) {
      if (!updateFields.$push) {
        updateFields.$push = {};
      }
      updateFields.$push.badges = { $each: [badges] };
  }
  if(avatar){
      updateFields.$set= { avatar: avatar }
  }

    const user = await User.findOneAndUpdate(
      { accessToken: accessToken },
        updateFields,
      { new: true }
    );

    if (user) {
      res.status(200).json({ success: true, response: user });
    } else {
      res.status(404).json({ success: false, response: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, response: error });
  }
});

app.post("/completions",async(req, res)=>{
  const options={
    method: 'POST',
    headers:{
      'Authorization': `Bearer ${API_KEY}`,
      'Content-TYpe':'application/json'
    },
    body: JSON.stringify({
      model:'text-davinci-003',
      prompt:"Tell a story about a dog",
      max_tokens: 100,
    })
  }
  try{
const response = await fetch('https://api.openai.com/v1/completions', options)
const data = await response.json()
res.send(data)
console.log(data)
  }catch(error){
    console.error(error)
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});