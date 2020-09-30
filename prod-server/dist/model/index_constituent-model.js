"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = require("../api/config/db");

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
} //const sequelize = new Sequelize({dialect: 'mssql'})


var IndexConstituent = _db.sequelize.define('IndexConstituent', {
  Date: {
    primaryKey: true,
    type: _sequelize.default.DATE
  },
  Alpha: {
    primaryKey: true,
    type: _sequelize.default.STRING,
    allowNull: false
  },
  Instrument: {
    type: _sequelize.default.STRING,
    allowNull: false
  },
  Gross_Market_Capitalisation: {
    field: 'Gross Market Capitalisation',
    type: _sequelize.default.FLOAT
  },
  Cumulative_Market_Capitalisation: {
    field: 'Cumulative Market Capitalisation',
    type: _sequelize.default.FLOAT
  }
}, {
  tableName: 'tbl_Index_Constituents',
  timestamps: false
});

var _default = IndexConstituent;
exports.default = _default;