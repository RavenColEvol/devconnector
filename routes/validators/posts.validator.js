const { check, validationResult } = require('express-validator');


const postRules = () => [
    check('text', 'Text is required')
        .not()
        .isEmpty()
]

const commentRules = () => [
    check('text', 'Text is required')
        .not()
        .isEmpty()
]

const Validator = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = []
        errors.array().map(error => extractedErrors.push({ [error.param]: error.msg }))
        return res.status(422).json({ errors: extractedErrors })
    }
    return next();
}


module.exports = {
    postRules,
    commentRules,
    Validator
}