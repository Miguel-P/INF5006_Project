"use strict";

var _interopRequireDefault = require("/home/miguel/MPhil_Fintech/INF5006Z/Project/repo/mevn-stack/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _stringUtil = require("../api/utilities/string-util");

// import bcrypt from 'bcrypt-nodejs'; this library is now defunct. Need to upgrade project to use newer version
var userSchema = new _mongoose.default.Schema({
  username: String,
  first: String,
  last: String,
  password: String
});
userSchema.set('timestamps', true); // Returns a transient field client-side without actually adding it to the schema

userSchema.virtual('fullName').get(function () {
  var first = _stringUtil.StringUtil.capitalize(this.first.toLowerCase());

  var last = _stringUtil.StringUtil.capitalize(this.last.toLowerCase());

  return "".concat(first, " ").concat(last);
}); // // Static methods that can be called from anywhere (e.g., User.passwordMatches)
// userSchema.statics.passwordMatches = function(password, hash) {
//     return bcrypt.compareSync(password, hash);
// }
// // Runs validation before saving a user
// userSchema.pre('save', function(next) {
//     this.username = this.username.toLowerCase();
//     this.first = this.first.toLowerCase();
//     this.last = this.last.toLowerCase();
//     const unsafePassword = this.password;
//     this.password = bcrypt.hashSync(unsafePassword); // Will encrypt the user's password
//     next();
// });

var _default = _mongoose.default.model('user', userSchema);

exports.default = _default;