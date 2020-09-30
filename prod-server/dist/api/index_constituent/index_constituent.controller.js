"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_all = get_all;

var _index_constituentModel = _interopRequireDefault(require("../../model/index_constituent-model"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var StringUtil = require('../utilities/string-util');

function get_all(req, res) {
  // Get All Constituents
  var constituents = _index_constituentModel.default.findAll();

  return res.status(200).json({
    index_constituents: constituents
  });
}