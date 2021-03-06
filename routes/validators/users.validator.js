const { check, validationResult } = require('express-validator')

const userValidationRules = () => [
    check('name', "Name is required")
        .not()
        .isEmpty(),
    check('email', "Please enter a valid email")
        .isEmail(),
    check('password', "Password length should be 6+ characters")
        .isLength({ min: 6 })
]

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty())
        return next();
    return res.status(422).json({
        errors: errors.array(),
    })
}

module.exports = {
    userValidationRules,
    validate
}