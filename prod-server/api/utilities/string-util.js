require("core-js/modules/es.string.trim");

var _classCallCheck = require("C:/Users/Takunda/Desktop/Mphil_FinTech/INF5006S/Code/INF5006_Project/node_modules/@babel/runtime/helpers/classCallCheck");

var _createClass = require("C:/Users/Takunda/Desktop/Mphil_FinTech/INF5006S/Code/INF5006_Project/node_modules/@babel/runtime/helpers/createClass");

module.exports = /*#__PURE__*/function () {
  "use strict";

  function StringUtil() {
    _classCallCheck(this, StringUtil);
  }

  _createClass(StringUtil, null, [{
    key: "isEmpty",
    value: function isEmpty(value) {
      return !value || !value.trim();
    }
  }, {
    key: "capitalise",
    value: function capitalise(word) {
      return word.charAt(0).toUpperCase();
    }
  }]);

  return StringUtil;
}();