import { DateTime } from 'mssql';
import {sequelize} from '../config/db';

var IndexRep = require('../../repository/index-repository').default;
var IndexConstituent = require('../../model/index_constituent-model').default;
const StringUtil = require('../utilities/string-util')

export function get_all(req, res) {
    IndexConstituent.findOne({
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(constituent) {
        get_for_date(res, constituent.Date);
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_constituent(req, res) {
    var constituentCode = req.params["constituentCode"]
    var indexCode = req.params["indexCode"]
    var date = req.params["date"]

    var indexRep = new IndexRep(indexCode)
    indexRep.date = date
    indexRep.getConstituentAndData(constituentCode, indexCode, date)
    .then(function(results){
        if (results["success"] == 1) {
            return res.status(200).json({ results: results["data"] });
        }
        return res.status(400).json({ error: results["message"] });
    })
    .catch(function (err) {
        return res.status(400).json({ error: err });
    });
}

function get_for_date(res, date) {
    IndexConstituent.findAll({
        where: sequelize.literal(" Date = '"+date+"'")
    })
    .then(function(constituents){
        return res.status(200).json({ results: constituents });
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}