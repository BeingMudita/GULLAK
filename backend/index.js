require('dotenv').config();

const config = require('./config');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const {authenticateToken}= require('./utilities');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');
const Memory = require('./models/memory.model');

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

//Create Account
app.post("/create-account", async (req, res) => {
    const {fullName, email, password} = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    const isUser = await User.findOne({email});
    if (isUser) {
        return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({fullName, email, password: hashedPassword});
    await user.save();

    const accessToken = jwt.sign({
        userId: user._id
    }, process.env.ACCESS_TOKEN_SECRET, 
    {expiresIn: "72h"});

    return res.status(201).json({
        error: false,
        user: {
            fullName: user.fullName,
            email: user.email
        },
        accessToken,
        message:"Registration successful"
    })
});

//Login Account
app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    const user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({message: "Invalid credentials"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({message: "Invalid credentials"});
    }
    const accessToken = jwt.sign({
        userId: user._id
    }, process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: "72h"});
    return res.json({
        error: false,
        user: {
            fullName: user.fullName,
            email: user.email
        },
        accessToken,
        message: "Login successful"
    })
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    const {userId} = req.user;
    const isUser = await User.findOne({ _id: userId });
    if (!isUser) {
        return res.status(400).json({message: "User not found"});
    }
    return res.json({
        error: false,
        user: isUser
    });
});

//Add Memory
app.post("/add-memory", authenticateToken, async (req, res) => {
    const { title, story, withPerson, imageUrl, memoryDate } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!title || !story || !withPerson || !imageUrl || !memoryDate) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Convert memory date from milliseconds to Date object
    const parsedMemoryDate = new Date(Number(memoryDate));
    if (isNaN(parsedMemoryDate.getTime())) {
        return res.status(400).json({ message: "Invalid memory date" });
    }

    try {
        const memory = new Memory({
            title,
            story,
            withPerson,
            imageUrl,
            memoryDate: parsedMemoryDate,
            userId
        });
        await memory.save();
        res.status(201).json({ story: memory, message: "Memory added successfully" });
    } catch (err) {
        console.error("Error adding memory:", err);
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
});

app.listen(8000);
module.exports = app;