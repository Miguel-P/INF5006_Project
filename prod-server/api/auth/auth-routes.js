"use strict";

var _interopRequireWildcard = require("/home/miguel/MPhil_Fintech/INF5006Z/Project/repo/mevn-stack/node_modules/@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("/home/miguel/MPhil_Fintech/INF5006Z/Project/repo/mevn-stack/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var controller = _interopRequireWildcard(require("./auth-controller"));

var router = _express.default.Router();

router.post('/auth', controller.index);
var _default = router;
exports.default = _default;