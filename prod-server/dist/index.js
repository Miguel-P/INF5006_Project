"use strict";

var _express = _interopRequireDefault(require("express"));

var _env = require("./api/config/env");

var _db = require("./api/config/db");

var _routes = require("./routes.js");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
} // Bring in the express package


var app = (0, _express.default)(); // instantiate a new express app

var port = 3000;
(0, _env.setEnvironment)(app);
(0, _db.connectToDB)();
(0, _routes.registerRoutes)(app); // creating a route

app.get('/', function (req, res) {
  if (process.env.NODE_ENV !== 'production') {
    return res.send("Running server in dev mode");
  } else {
    return res.sendFile("index.html", {
      root: __dirname + '/../dist/'
    });
  }
}); // use sudo npm install nodemon -g 
// package to get hot reloads for express servers
// and can now run: nodemon dev-server/index.js to serve the web server

app.listen(port, function () {
  console.log("E.g. app listening at http://localhost:".concat(port));
});