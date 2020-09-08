"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;

// import * as StringUtil from '../utilities/string-util.js';
var StringUtil = require('../utilities/string-util');

function index(req, res) {
  var validation = validateIndex(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      message: validation.message
    });
  } // returning http response codes


  return res.status(204).json();
}

function validateIndex(body) {
  var errors = '';

  if (StringUtil.isEmpty(body.username)) {
    errors += "Username is required";
  }

  if (StringUtil.isEmpty(body.password)) {
    errors += 'Password is required';
  }

  return {
    isValid: StringUtil.isEmpty(errors),
    mesage: errors
  };
}