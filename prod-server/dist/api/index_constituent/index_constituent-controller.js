"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_all = get_all;

var IndexConstituent = require('../../model/index_constituent-model').default;

var StringUtil = require('../utilities/string-util');

function get_all(req, res) {
  // Get All Constituents
  var constituents = IndexConstituent.findAll().then(function (item) {
    return res.status(200).json({
      results: item
    });
  }).catch(function (err) {
    return res.status(400).json({
      error: err.message
    });
  });
}