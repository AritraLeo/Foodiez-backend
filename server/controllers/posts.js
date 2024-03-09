import express from 'express';
import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

const router = express.Router();

// GET all posts
export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a new post
export const createPost = async (req, res) => {
    const { title, description, restaurantName, imageUrl, tags } = req.body;
    const newPost = new PostMessage({
        title,
        description,
        restaurantName,
        imageUrl,
        tags,
        creator: req.userId,
        createdAt: new Date().toISOString(),
    });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Update an existing post
export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const { title, description, restaurantName, imageUrl, tags } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with this Id');
    const updatedPost = await PostMessage.findByIdAndUpdate(
        _id,
        { title, description, restaurantName, imageUrl, tags, _id },
        { new: true }
    );
    res.json(updatedPost);
};

// Delete an existing post
export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with this Id');
    await PostMessage.findByIdAndRemove(id);
    res.json({ message: 'Post deleted!' });
};

// Like a post
export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) return res.status(401).json({ message: 'Unauthenticated' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with this Id');
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
        // User has not liked the post, add like
        post.likes.push(req.userId);
    } else {
        // User has already liked the post, remove like
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);
};


// GET a specific post by ID
export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export default router;
