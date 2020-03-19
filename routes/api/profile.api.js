const router = require('express').Router();
const normalize = require('normalize-url');
const config = require('config')
const request = require('request');

const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile.model')
const User = require('../../models/User.model')
const { profileRules, Validator, experienceRules, educationRules} = require('../validators/profile.validator')

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('users', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({
                msg: "There is no profile for this user"
            });
        }

        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


// @route   POST api/profile
// @desc    Create or Update Profile
// @access  Private
router.post('/', profileRules(), [auth, Validator], async (req, res) => {
    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
    } = req.body;

    // Build profile object
    const profileFields = {
        user: req.user.id,
        company,
        location,
        website: website === '' ? '' : normalize(website, { forceHttps: true }),
        bio,
        skills: Array.isArray(skills)
            ? skills
            : skills.split(',').map(skill => ' ' + skill.trim()),
        status,
        githubusername
    };
    
    const socialfields = { youtube, twitter, instagram, linkedin, facebook };

    for (const [key, value] of Object.entries(socialfields)) {
        if (value)
            socialfields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialfields;
    
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            profile = await Profile.findOneAndUpdate({ user: req.user.id },
                { $set: profileFields },
                { new: true });
            return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Erro')
    }
})

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile)
            return res.status(400).json({msg:'No profile found for requested user.'})       
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') 
            res.status(400).json({msg:'No profile found for requested user.'})
        res.status(500).send("Server Error");
    }
})


// @route   DELETE api/profile/
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user : req.user.id });
        await User.findOneAndRemove({ _id : req.user.id });
        res.json({msg : 'User Profile Deleted'})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({err:'Server Error'});
    }
})


// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience', experienceRules(),[auth , Validator], async (req, res) => {
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user : req.user.id});
        profile.experience.unshift(newExp);
        await profile.save()
        res.json(profile)
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


// @route   DELETE api/profile/experience/:exp_id
// @desc    DELETE profile experience
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education', educationRules(),[auth , Validator], async (req, res) => {
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user : req.user.id});
        profile.education.unshift(newEdu);
        await profile.save()
        res.json(profile)
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


// @route   DELETE api/profile/education/:edu_id
// @desc    DELETE profile education
// @access  Private
router.delete('/education/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


// @route   GET api/profile/github/:username
// @desc   GET user repos from Github
// @access  Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers : {
                'user-agent':'node-js'
            }
        };
        request(options, (err, response, body) => {
            if(err) {
                console.error(err);
            }
            if(response.statusCode !== 200) {
                return res.send("User not found")
            }
            res.json(JSON.parse(body));
        })
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


module.exports = router;