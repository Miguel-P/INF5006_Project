// import * as StringUtil from '../utilities/string-util.js';
const StringUtil = require('../utilities/string-util');

export function index(req, res) {
    const validation = validateIndex(req.body);
    if (!validation.isValid) {
        return res.status(400).json({ message: validation.message });
    }
    // returning http response codes
    return res.status(204).json();
}

function validateIndex(body) {
    let errors = '';
    if (StringUtil.isEmpty(body.username)) {
        errors += "Username is required";
    }
    if (StringUtil.isEmpty(body.password)) {
        errors += 'Password is required';
    }

    return {
        isValid: StringUtil.isEmpty(errors),
        mesage: errors
    }
}