"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectToDB = connectToDB;
exports.sequelize = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var sequelize = new _sequelize.default('AIFMRM_ERS', null, null, {
  dialect: 'mssql',
  dialectOptions: {
    server: 'localhost',
    authentication: {
      type: 'default',
      options: {
        userName: 'admin',
        password: 'admin'
      }
    },
    options: {
      database: 'AIFMRM_ERS',
      port: 1434,
      encrypt: false
    }
  }
}); // const sequelize = new Sequelize(
//     process.env.DB_NAME, 
//     process.env.DB_USERNAME, 
//     process.env.DB_PASSWORD, 
//     {
//         host: process.env.DB_URL,
//         dialect: process.env.DB_DIALECT,
//         dialectOptions: {
//             options: {
//                 database: process.env.DB_NAME,
//                 port: process.env.DB_PORT,
//                 encrypt: false
//             }
//         }
//     }
// );

exports.sequelize = sequelize;

function connectToDB() {
  sequelize.authenticate().then(function () {
    console.log('Connection has been established successfully.');
  }).catch(function (err) {
    console.error('Unable to connect to the database:', err);
  });
}