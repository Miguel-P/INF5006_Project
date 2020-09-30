// Bring in the express package
import express from 'express';
import { setEnvironment } from './api/config/env';
import { connectToDB } from './api/config/db';
import { registerRoutes } from './routes.js';
var app = express(); // instantiate a new express app

var port = 3000;
setEnvironment(app);
connectToDB();
registerRoutes(app); // creating a route

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