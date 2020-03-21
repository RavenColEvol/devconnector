const { check, validationResult } = require('express-validator')

const profileRules = () => [
    check('status', "Status is required")
        .not()
        .isEmpty(),
    check('skills', 'Skills is required')
        .not()
        .isEmpty()
]

const experienceRules = () => [
    check('title', 'Title is required')
        .not()
        .isEmpty(),
    check('company', 'Company name is required')
        .not()
        .isEmpty(),
    check('from', 'From date is required')
        .not()
        .isEmpty()
]

const educationRules = () => [
    check('school', 'School name is required')
        .not()
        .isEmpty(),
    check('degree', 'Degree info is required')
        .not()
        .isEmpty(),
    check('from', 'From date is required')
        .not()
        .isEmpty(),
    check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty()
]

const Validator = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    return next();
}


module.exports = {
    profileRules,
    experienceRules,
    educationRules,
    Validator,
}