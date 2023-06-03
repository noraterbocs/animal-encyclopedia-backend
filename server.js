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
newGeneratedText:{
  type:String
},
 mainCharacter:{
  type:String
 },
location:{
  type:String
},
friends:{
  type:String
},
genre:{
  type:String
},
userId:{
  type:String
},
userAvatar:{
  type:String
},
username:{
  type:String
},
image:{
  type:String,
  default:'https://placehold.co/200'
},
createdAt:{
  type:Date,
  default:Date.now
 },
 title:{
  type:String
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

// Get all users and their total scores
app.get("/users",authenticateUser);
app.get("/users", async (req, res) => {
  try {
const limit = parseInt(req.query.limit) || 10; // default limit is 10
    const users = await User.find({}, "username totalScore avatar _id")
      .sort({ totalScore: -1 }) // Sort by createdAt field in descending order
      .limit(limit);

    const usersData = users.map((user) => ({
      username: user.username,
      avatar: user.avatar,
      id: user._id,
      totalScore: user.totalScore
    }));
    res.status(200).json({ success: true, response: usersData });
  } catch (error) {
    res.status(500).json({ success: false, response: "Internal server error." });
  }
});


//updating total score, history, badges, avatar
app.patch("/user",authenticateUser);
app.patch("/user", async (req, res) => {
const salt = bcrypt.genSaltSync();
 try {
const {badges, avatar, history, username, password } = req.body;
    const accessToken = req.header("Authorization");

const updateFields = {};
 if (history) {
      updateFields.$push = {};
      if (history) {
        updateFields.$push.history = { $each: [history] };
        updateFields.$inc = {totalScore: parseInt(history.score)}
      }
  }
  if (badges) {
      if (!updateFields.$push) {
        updateFields.$push = {};
      }
      updateFields.$push.badges = { $each: [badges] };
  }
  if(avatar){
     if (!updateFields.$set) {
        updateFields.$set = {};
      }
      updateFields.$set= { avatar: avatar }
  }
    if(username){
       if (!updateFields.$set) {
        updateFields.$set = {};
      }
      updateFields.$set= { username: username }
  }
      if(password){
         if (!updateFields.$set) {
        updateFields.$set = {};
      }
      updateFields.$set= { password: bcrypt.hashSync(password, salt) }
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

//Delete user account
app.delete("/user",authenticateUser);
app.delete("/user", async (req, res) => {
 try {
    const accessToken = req.header("Authorization");
    const deletedUser = await User.deleteOne(
      { accessToken: accessToken },
    );
    if (deletedUser) {
      res.status(200).json({ success: true, response: 'Your account was successfully deleted!' });
    } else {
      res.status(404).json({ success: false, response: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, response: error });
  }
});

//Generating a story:
app.post("/completions",authenticateUser);
app.post("/completions",async(req, res)=>{
    const { mainCharacter, location, friends, genre } = req.body;
// generate text
  const options={
    method: 'POST',
    headers:{
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      model:'gpt-3.5-turbo',
       messages:[
        {"role": "user", "content": `Tell a funny kids story in 10 words that has a life lesson and starts with a title.
        It should be about a ${mainCharacter} who lived in ${location} together with ${friends}.
        The genre is ${genre}.
        Give all characters names.`},
       ],
      max_tokens: 30
    })
  }
  try{
    const response = await fetch('https://api.openai.com/v1/chat/completions', options)
    const newText = await response.json()
    if(newText){
      const accessToken = req.header("Authorization");

      // 3/0: to be commented back to generate image:
    // const optionsImage={
    // method: 'POST',
    // headers:{
    // 'Authorization': `Bearer ${API_KEY}`,
    // 'Content-Type':'application/json'
    // },
    // body: JSON.stringify({
    // prompt: `A ${mainCharacter} and ${friends} in ${location} in cartoon style.`,
    // n: 1,
    // size: "256x256",
    // // response_format: "b64_json"
    // })
    // }
    // 3/1: to be commented back to generate image:
    // const responseImage = await fetch('https://api.openai.com/v1/images/generations', optionsImage)
    // const newImage = await responseImage.json()

      const trimmedText = newText.choices[0].message.content.trim()
      const newlineIndex = trimmedText.indexOf("\n")

    const user = await User.findOne({ accessToken: accessToken })
    const newGame = await new Game ({
    mainCharacter: mainCharacter,
    location: location,
    friends:friends,
    genre:genre,
    title:trimmedText.substring(0, newlineIndex).trim(),
    newGeneratedText:trimmedText.substring(newlineIndex + 1).trim(),
    userId:user._id,
    userAvatar:user.avatar,
    username:user.username
    // 3/2: to be commented back to generate image:
    // image:newImage.data[0].url
    }).save();

 res.status(200).json({success:true, response:newGame})}
  }catch(error){
    console.error(error)
  }
})
//Get all generated stories
app.get("/completion",authenticateUser);
app.get("/completion", async (req, res) => {
  try {
    const games = await Game.find({},)
    .sort({ createdAt: -1 })
    res.status(200).json({ success: true, response: games });
  } catch (error) {
    res.status(500).json({ success: false, response: "Internal server error." });
  }
});

//Get all generated stories
app.get("/completion/lastgeneratedstory",authenticateUser);
app.get("/completion/lastgeneratedstory", async (req, res) => {
  const accessToken = req.header("Authorization");
   const user = await User.findOne({ accessToken: accessToken })
   console.log(user)
  try {
    if (user) {
      const lastGeneratedStory = await Game.find({ userId: user._id.toString() }).sort({ createdAt: -1 }).limit(1)
      console.log(lastGeneratedStory)
      res.status(200).json({ success: true, response: lastGeneratedStory[0].createdAt });
    } else {
      res.status(401).json({ success: false, response: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, response: "Internal server error." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});