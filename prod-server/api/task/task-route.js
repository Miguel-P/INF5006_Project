"use strict";

var _interopRequireWildcard = require("/home/miguel/MPhil_Fintech/INF5006Z/Project/repo/mevn-stack/node_modules/@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("/home/miguel/MPhil_Fintech/INF5006Z/Project/repo/mevn-stack/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var controller = _interopRequireWildcard(require("./tasks-controller"));

var router = _express.default.Router();

// in other words, whenever these routes are
// accessed, the controller task will perform the action
router.post('/task', controller.create);
router.get('/task', controller.show);
router.get('/task/:id', controller.update);
router.put('/task', controller.create);
router.delete('/task', controller.remove);
var _default = router;
exports.default = _default;