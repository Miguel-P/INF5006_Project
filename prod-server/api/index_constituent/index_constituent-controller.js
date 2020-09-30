var IndexConstituent = require('../../model/index_constituent-model').default;

var StringUtil = require('../utilities/string-util');

export function get_all(req, res) {
  // Get most recent constituents
  var mostRecent = IndexConstituent.findOne({
    order: [['Date', 'DESC']]
  });
  IndexConstituent.findAll({
    where: {
      Date: {
        $eq: mostRecent.Date
      }
    }
  }).then(function (item) {
    return res.status(200).json({
      results: item
    });
  }).catch(function (err) {
    return res.status(400).json({
      error: err.message
    });
  });
}