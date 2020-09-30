"use strict";

require("core-js/modules/es.array.find");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.show = show;

var _userModel = _interopRequireDefault(require("../../model/user-model"));

var _taskModel = _interopRequireDefault(require("../../model/task-model"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var StringUtil = require('../utilities/string-util');

function index(req, res) {
  // FIND ALL TASKS in database
  _taskModel.default.find({}, function (error, tasks) {
    if (error) {
      return res.status(500).json();
    }

    return res.status(200).json({
      tasks: tasks
    });
  }).populate('author', 'username', 'user'); // Populate will find the author that created the task and add it to the task (username only)

}

function create(req, res) {
  var id = auth.getUserId(req);

  _userModel.default.findOne({
    _id: id
  }, function (error, user) {
    if (error && !user) {
      return res.status(500).json();
    } // actually creating an object that will go into the database


    var task = new _taskModel.default(req.body.task);
    task.author = user._id;
    task.dueDate = (0, _moment.default)(task.dueDate); // this is how to save something to the database with mongoose

    task.save(function (error) {
      if (error) {
        return res.status(500).json();
      }

      return res.status(201).json();
    });
  });
}

function update(req, res) {
  return res.status(204).json();
}

function remove(req, res) {
  return res.status(204).json();
}

function show(req, res) {
  return res.status(200).json();
}