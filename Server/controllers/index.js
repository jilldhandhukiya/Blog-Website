const fs = require('fs');
const multer = require('multer');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/User");
const Posts = require("../models/Posts");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

async function Verify(request, response) {
    const { username, password } = request.body;
    try {
        const userInfo = await User.findOne({ username });
        if (!userInfo) {
            return response.status(401).json({ message: 'Invalid username' });
        }

        if (userInfo.password !== password) {
            return response.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: userInfo._id, username: userInfo.username },
            JWT_SECRET,
            { expiresIn: '48h' }
        );

        response.cookie('token', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        }).json({
            username: userInfo.username,
            id: userInfo._id
        });

    } catch (err) {
        console.error(err);
        response.status(500).json({ message: 'Internal server error' });
    }
}

async function AuthToken(request, response) {
    const token = request.cookies.token;
    if (!token) return response.status(401).json({ message: 'Access Denied. No Token Provided.' });

    try {
        const data = jwt.verify(token, JWT_SECRET);
        request.user = data;
        response.status(200).json({ data });
    } catch (err) {
        console.error(err);
        response.status(400).json({ message: 'Invalid Token' });
        response.cookie('token', '', {
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 48 * 60 * 60 * 1000 // 48 hours
        });
    }
}

async function UserPosts(request, response) {
    const token = request.cookies.token;
    try {
        const data = jwt.verify(token, JWT_SECRET);
        const posts = await Posts.find({ authorId: data.id }, '_id title subtitle image tags createdAt').exec();

        response.status(201).json(posts)

    } catch (err) {
        console.error(err);
        response.status(400).json({ message: 'Invalid Token' });
        response.cookie('token', '', {
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production'
        });
    }
}

// Convert Image to Base64
const convertImageToBase64 = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) return reject(err);
            resolve(data.toString('base64'));
        });
    });
};

async function UploadPost(req, res) {

    try {
        // Ensure a file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Extract fields from request body and file path
        const { title, subtitle, content, tag, UserInfo } = req.body;
        const imagePath = req.file.path;
        try {
            // Convert image file to Base64
            const base64Image = await convertImageToBase64(imagePath);

            const authorId = mongoose.Types.ObjectId.createFromHexString(UserInfo.substring(1, 25));

            // Create a new post object
            const newPost = new Posts({
                title,
                subtitle,
                image: base64Image,
                content,
                tags: tag,
                authorId,
            });

            // Save the new post to the database
            newPost.save().then(() => console.log("Data Inserted"));

            // Delete the temporary image file after saving to database
            fs.unlink(imagePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting the file:', unlinkErr);
                }
            });

            // Send success response to frontend
            res.status(201).json({ message: 'Post uploaded successfully', post: newPost });
        } catch (err) {
            console.error('Error converting image to Base64 or saving post:', err);
            res.status(500).json({ message: 'Failed to upload post' });
        }
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ message: 'Failed to upload post' });
    }
}

module.exports = { Verify, AuthToken, UserPosts, UploadPost };
