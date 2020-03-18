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

    const extractedErrors = []
    errors.array().map(error => extractedErrors.push({ [error.param]: error.msg }))

    return res.status(422).json({
        errors: extractedErrors
    })
}

module.exports = {
    authRules,
    authValidator
}