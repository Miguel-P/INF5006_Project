"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;

var _taskRoute = _interopRequireDefault(require("./api/task/task-route.js"));

var _registerRoutes = _interopRequireDefault(require("./api/register/register-routes"));

var _userRoutes = _interopRequireDefault(require("./api/user/user-routes"));

var _authRoutes = _interopRequireDefault(require("./api/auth/auth-routes"));

var _index_constituentRoutes = _interopRequireDefault(require("./api/index_constituent/index_constituent-routes"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function registerRoutes(app) {
  app.use('/api', _taskRoute.default);
  app.use('/api', _registerRoutes.default);
  app.use('/api', _userRoutes.default);
  app.use('/api', _authRoutes.default);
  app.use('/api', _index_constituentRoutes.default);
}