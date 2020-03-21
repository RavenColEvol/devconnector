const { check, validationResult } = require('express-validator')

const authRules = () => [
    check('email', 'Please enter a valid email.').isEmail(),
    check('password', 'Password is required').exists()
]

const authValidator = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(422).json({
        errors: errors.array()
    })
}

module.exports = {
    authRules,
    authValidator
}