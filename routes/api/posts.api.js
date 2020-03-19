const router = require('express').Router();

const User = require('../../models/User.model')
const Post = require('../../models/Post.model')
const Profile = require('../../models/Profile.model')
const auth = require('../../middleware/auth')
const {postRules, commentRules, Validator} = require('../validators/posts.validator')

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', postRules(), [auth, Validator] , async (req, res) => {
    
    try {
        const user = await User.findById({_id : req.user.id}).select('-password');
    
        const newPost = new Post({
            text : req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

})


// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({date : -1});
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})


// @route   GET api/posts/:post_id
// @desc    Get post by id
// @access  Public
router.get('/:post_id', async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.post_id });
        res.json(post);
    } catch (err) {
        if(err.kind == 'ObjectId') {
            return res.json({msg : "Invalid Post request"});
        }
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})


// @route   DELETE api/posts/:post_id
// @desc    Delete post by id
// @access  Private
router.delete('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.deleteOne({ _id: req.params.post_id , user : req.user.id});
        if(post){
            return res.json(post);
        }
        return res.json({msg:'Invalid Post request.'})
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})


// @route   PUT api/posts/like/:post_id
// @desc    Add likes
// @access  Private
router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.post_id});
        if(post.like.length > 0 && post.like.filter(l => l.user.toString() === req.user.id).length > 0) {
            const index = post.like.map(e => e.user.toString()).indexOf(req.user.id);
            post.like.splice(index,1);
        } else {
            post.like.unshift({'user': req.user.id});
        }
        await post.save();
        res.json(post.like);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})


// @route   PUT api/posts/comment/:post_id
// @desc    Add comments
// @access  Private
router.put('/comment/:post_id', commentRules(), [auth, Validator], async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.post_id});
        const user = await User.findById({ _id: req.user.id }).select('-password');
        const comment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comment.unshift(comment);
        await post.save();
        res.json(post.comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})


// @route   PUT api/posts/comment/:post_id/:comment_id
// @desc    Delete comment
// @access  Private
router.put('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.post_id});

        const index = post.comment.map(e => e._id).indexOf(req.params.comment_id);
        
        if(index === -1)
            return res.status(400).json({ msg: 'Comment not found'})
        
        if(post.comment[index].user.toString() !== req.user.id)
            return res.status(400).json({ msg: 'User not authorized'})
    
        
        post.comment.splice(index, 1);
        await post.save();
        res.json(post.comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})


module.exports = router;