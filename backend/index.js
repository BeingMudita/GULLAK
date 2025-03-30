require('dotenv').config();

const config = require('./config');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const {authenticateToken}= require('./utilities');
const fs = require('fs');
const path = require('path');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');
const Memory = require('./models/memory.model');
const upload = require('./multer');

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

//Get Memory
app.get("/get-memory", authenticateToken, async (req, res) => {
    const {userId} = req.user;
    try{
        const memory = await Memory.find({userId: userId}).sort({isFavorite: -1});
        res.status(200).json({stories: memory});
    } catch (err) {
        res.status(500).json({message: "An error occurred", error: err.message});
    }
});

//Route to handle image upload
app.post("/upload-image", upload.single("image"), async (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({message: "Please upload an image"});
        }
        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(200).json({imageUrl});
    }catch(err){
        res.status(500).json({message: "An error occurred", error: err.message});
    }
});

//Delete an image from memory
app.delete("/delete-image", authenticateToken, async (req, res) => {
    const { imageUrl } = req.query;
    if(!imageUrl){
        return res.status(400).json({message: "Image URL is required"});
    }
    try{
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, "uploads", filename);
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
            return res.status(200).json({message: "Image deleted successfully"});
        }else{ 
            return res.status(404).json({message: "Image not found"});
        }
    }catch(err){
        res.status(500).json({message: "An error occurred", error: err.message});
    }
});

//Edit Memory
app.put("/edit-memory/:id", authenticateToken, async (req, res) => {
    const { title, story, withPerson, imageUrl, memoryDate } = req.body;
    const { id } = req.params;
    const {userId} = req.user;

    // Validate required fields
    if (!title || !story || !withPerson || !imageUrl || !memoryDate) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Convert memory date from milliseconds to Date object
    const parsedMemoryDate = new Date(memoryDate);
    try{
        //Find memory by id and ensure it belongs to the authenticated user
        const memory = await Memory.findOne({ _id: id, userId: userId });
        if (!memory) {
            return res.status(404).json({ message: "Memory not found" });
        }

        const placeholderimage = `http://localhost:8000/assests/placeholder.jpg`;

        memory.title = title;
        memory.story = story;
        memory.withPerson = withPerson;
        memory.imageUrl = imageUrl || placeholderimage;
        memory.memoryDate = parsedMemoryDate;

        await memory.save();
        return res.status(200).json({ message: "Memory updated successfully" });
    }catch(err){
        res.status(500).json({message: "An error occurred", error: err.message});
    }
});

//Delete Memory
app.delete("/delete-memory/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try{
        const memory = await Memory.findOne({ _id: id, userId: userId });
        if (!memory) {
            return res.status(404).json({ message: "Memory not found" });
        }

        //Delete memory
        await memory.deleteOne({ _id: id, userId: userId });
        const imageUrl = memory.imageUrl;
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, "uploads", filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting image:", err);
            }
        });
        res.status(200).json({ message: "Memory deleted successfully" });
    }catch(err){
        res.status(500).json({message: "An error occurred", error: err.message});
    }
});

//Favorite Memory
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const { isFavorite } = req.body;

    if (typeof isFavorite !== "boolean") {
        return res.status(400).json({ message: "Invalid value for isFavorite" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid memory ID" });
    }

    try {
        const memory = await Memory.findOne({ _id: id, userId });
        if (!memory) {
            return res.status(404).json({ message: "Memory not found" });
        }

        memory.isFavorite = isFavorite;
        await memory.save();
        res.status(200).json({ message: "Memory updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
});


//Search memory
app.get("/search", authenticateToken, async (req, res) => {
    const {query} = req.query;
    const {userId} = req.user;
    if(!query){
        return res.status(400).json({message: "Query is required"});
    }
    try{
        const serachResults = await Memory.find({
            userId: userId,
            $or: [
                {title: { $regex: query, $options: 'i' } },
                {story: { $regex: query, $options: 'i' } },
                {withPerson: { $regex: query, $options: 'i' } }
            ],
        }).sort({isFavorite: -1});

        return res.status(200).json({stories: serachResults});
    }catch(err){
        return res.status(500).json({message: "An error occurred", error: err.message});
    }
});

//Filter memory by date
app.get("/memory/filter", authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
    }

    try {
        const filteredMemories = await Memory.find({
            userId: userId,
            memoryDate: {
                $gte: parsedStartDate,
                $lte: parsedEndDate
            }
        }).sort({ isFavorite: -1 });

        return res.status(200).json({ stories: filteredMemories });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
});


//Serve static files from the uploads and assests directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.json()); // Enable JSON parsing


app.listen(8000);
module.exports = app;