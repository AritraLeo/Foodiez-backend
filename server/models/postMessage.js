// models/postMessage.js

import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    description: String, // Adding a description field for the food/restaurant details
    restaurantName: String, // Adding a field for the restaurant name
    imageUrl: String, // Adding a field for an image of the food/restaurant
    tags: [String],
    creator: String,
    likes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
