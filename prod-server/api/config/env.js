"use strict";

var _interopRequireDefault = require("/home/miguel/MPhil_Fintech/INF5006Z/Project/repo/mevn-stack/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEnvironment = setEnvironment;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function setEnvironment(app) {
  if (process.env.NODE_ENV !== 'production') {
    setDevEnv(app);
  } else {
    setProdEnv(app);
  }
}

function setDevEnv(app) {
  process.env.NODE_ENV = 'development';
  process.env.DB_URL = 'mongodb://127.0.0.1:27017'; // if you're not using wsl for dev and windows for mongo, use mongodb://localhost:27017

  console.log("Setting development environment");
  app.use((0, _morgan.default)('dev'));
  app.use((0, _cors.default)());
  app.use(_bodyParser.default.json());
}

function setProdEnv(app) {
  process.env.DB_URL = 'mongodb://localhost:27017/vue-db';
  app.use(_bodyParser.default.json());
  app.use((0, _morgan.default)('dev'));
  app.use((0, _cors.default)());
  app.use(_express.default.static(__dirname + '/../dist'));
  console.log("Setting production environment");
}