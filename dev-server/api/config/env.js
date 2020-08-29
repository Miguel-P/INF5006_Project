import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

export function setEnvironment(app) {
    if (process.env.NODE_ENV !== 'production') {
        setDevEnv(app);
    }
    else {
        setProdEnv(app);
    }
}

function setDevEnv(app) {
    process.env.NODE_ENV = 'development';
    process.env.DB_URL = 'mongodb://127.0.0.1:27017'; // if you're not using wsl for dev and windows for mongo, use mongodb://localhost:27017
    console.log("Setting development environment");
    app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.json());
}

function  setProdEnv(app) {
    process.env.DB_URL = 'mongodb://localhost:27017/vue-db';
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.static(__dirname + '/../dist'))
    console.log("Setting production environment");
}