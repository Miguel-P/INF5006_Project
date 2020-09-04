var IndexConstituent = require('../../model/index_constituent-model').default;
const StringUtil = require('../utilities/string-util')

export function get_all(req, res) {
    // Get All Constituents
    var constituents = IndexConstituent
        .findAll()
        .then(function(item){
            return res.status(200).json({ results: item });
        }).catch(function (err) {
            return res.status(400).json({ error: err.message});
        });
}