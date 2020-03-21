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

    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })
    return next();
}


module.exports = {
    postRules,
    commentRules,
    Validator
}