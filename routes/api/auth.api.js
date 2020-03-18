const router = require('express').Router();
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')

const auth = require('../../middleware/auth')
const User = require('../../models/User.model')
const {authRules, authValidator} = require('../validators/auth.validator')

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


// @route   POST api/auth
// @desc    Authenticate & Get token
// @access  Public
router.post('/', authRules(), authValidator, async (req, res) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(422).json({ errors: [{ msg: 'Invalid Credentials.' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res
                    .status(422)
                    .json({msg: 'Invalid Credentials'})
        }

        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 36000
        }, (err, token)=> {
            if(err) throw err;
            res.json({ token })
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

})

module.exports = router;