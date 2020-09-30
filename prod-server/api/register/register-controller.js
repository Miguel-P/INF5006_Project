// import {StringUtil} from '../utilities/string-util.js'
var StringUtil = require('../utilities/string-util');

export function index(req, res) {
  var validation = validateIndex(req.body);

  if (!validation.iSValid) {
    return res.status(400).json({
      message: validation.message
    });
  }

  var user = {
    username: req.body.username.toLowerCase(),
    password: req.body.password
  };
  console.log(user); // 201 is generally the code used after an object was created

  return res.status(201).json();
}

function validateIndex(body) {
  var errors = '';

  if (StringUtil.isEmpty(body.username)) {
    errors += 'Username is required';
  }

  if (StringUtil.isEmpty(body.password)) {
    errors += 'Password is required';
  }

  return {
    isValid: StringUtil.isEmpty(errors),
    message: errors
  };
}