"use strict";

var _interopRequireDefault = require("/home/miguel/MPhil_Fintech/INF5006Z/Project/repo/mevn-stack/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var taskSchema = new _mongoose.default.Schema({
  title: String,
  body: String,
  dueDate: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  author: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'user'
  }
});
taskSchema.set('timestamps', true); // Adds create_at and updated_at timestamps

var _default = _mongoose.default.model('task', taskSchema);

exports.default = _default;