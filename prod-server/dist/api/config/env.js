"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEnvironment = setEnvironment;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function setEnvironment(app) {
  if (process.env.NODE_ENV !== 'production') {
    setDevEnv(app);
  } else {
    setProdEnv(app);
  }
}

function setDevEnv(app) {
  process.env.NODE_ENV = 'development';
  process.env.DB_DIALECT = 'mssql';
  process.env.DB_URL = 'localhost';
  process.env.DB_PORT = 1434;
  process.env.DB_NAME = 'AIFMRM_ERS';
  process.env.DB_USERNAME = 'admin';
  process.env.DB_PASSWORD = 'admin';
  console.log("Setting development environment");
  app.use((0, _morgan.default)('dev'));
  app.use((0, _cors.default)());
  app.use(_bodyParser.default.json());
}

function setProdEnv(app) {
  process.env.DB_DIALECT = 'mssql';
  process.env.DB_URL = 'localhost';
  process.env.DB_PORT = 1434;
  process.env.DB_NAME = 'AIFMRM_ERS';
  process.env.DB_USERNAME = 'admin';
  process.env.DB_PASSWORD = 'admin';
  app.use(_bodyParser.default.json());
  app.use((0, _morgan.default)('dev'));
  app.use((0, _cors.default)());
  app.use(_express.default.static(__dirname + '/../dist'));
  console.log("Setting production environment");
}