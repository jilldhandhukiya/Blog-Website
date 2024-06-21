const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  subtitle: {
    type: String,
    required: true,
    trim: true
  },

  image: {
    type: String,
    required: true,
    trim: true 
  },

  content: {
    type: String,
    required: true,
    trim: true 
  },

  tags: {
    type: String,
    enum: ['Legal', 'Finance'],
    required: true,
  },

}, { timestamps: true });


const Post = mongoose.model("Post", UserSchema);

module.exports = Post;
