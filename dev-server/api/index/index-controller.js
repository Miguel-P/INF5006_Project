import { DateTime } from 'mssql';
import {sequelize} from '../config/db';

var IndexRep = require('../../repository/index-repository').default;
var IndexConstituentModel = require('../../model/index_constituent-model').default;
const StringUtil = require('../utilities/string-util')

export function get_all(req, res) {
    
    // First find most recent date in the constituents
    IndexConstituentModel.findOne({
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(constituent) {
        var indexRep = new IndexRep("J203");
        indexRep.getData(constituent.Date)
        .then(function(results){
            if (results["success"] == 1){
                return res.status(200).json({ results: indexRep });
            }
            return res.status(400).json({ error: results["message"] });
        })
        .catch(function (err) {
            return res.status(400).json({ error: err });
        });

    })
    .catch(function (err) {
        return res.status(400).json({ error: err });
    });
}

export function get_index(req, res) {
    var indexCode = req.params["indexCode"]
    var date = req.params["date"]

    var indexRep = new IndexRep(indexCode);
    indexRep.getData(date)
    .then(function(results){
        if (results["success"] == 1){
            return res.status(200).json({ results: indexRep });
        }
        return res.status(400).json({ error: results["message"] });
    })
    .catch(function (err) {
        return res.status(400).json({ error: err });
    });
}
