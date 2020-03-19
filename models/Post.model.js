const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PostSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text : {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    like: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comment: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: String,
            avatar: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = Post = mongoose.model('posts', PostSchema);