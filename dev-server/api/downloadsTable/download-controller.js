import { DateTime } from 'mssql';
import {sequelize} from '../config/db';
const { Op } = require("sequelize");

var FullBetaModel = require('../../model/full-beta-model').default;
var PortfolioMetrics = require('../../model/portfolio-metrics-model').default;
var IndustryPortfolioMetrics = require('../../model/industry-portf-model').default;
var SharesMetrics = require('../../model/shares-metrics-model').default;
const allIndexNames = require('../utilities/index-names')

export function get_all(req, res) {
    // First find most recent date in the constituents
    FullBetaModel.findAll({
        where: {Instrument: {[Op.notIn]: allIndexNames}}
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_indextable(req, res) {
    var proxy = req.params["proxy"]
    var date = req.params["date"]
    var period = req.params["period"]
    FullBetaModel.findAll({
        where: sequelize.literal(
            " \"Instrument\" IN (:indexes) AND"+
            " \"Index\" = '" + proxy + "' AND" +
            " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+date+"') AND '"+date+"')"
        ),
        replacements: {indexes: allIndexNames},
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_sharetable(req, res) {
    var proxy = req.params["proxy"]
    var date = req.params["date"]
    var period = req.params["period"]
    FullBetaModel.findAll({
        where: sequelize.literal(
            " \"Instrument\" NOT IN (:indexes) AND"+
            " \"Index\" = '" + proxy + "' AND" +
            " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+date+"') AND DATEADD(DAY,"+1+",'"+date+"'))"
        ),
        replacements: {indexes: allIndexNames},
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_dates(req, res) {
    FullBetaModel.sequelize.query('SELECT distinct "Date" from tbl_BA_Beta_Output order by "Date" desc', {
            type: FullBetaModel.sequelize.QueryTypes.SELECT
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

// Waiting on one or two pieces of info before I continue with this.
export function get_all_SharesMetrics(req, res) {
    // First find most recent date in the constituents
    SharesMetrics.findAll()
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_all_IndusPortfMetrics(req, res) {
    // First find most recent date in the constituents
    IndustryPortfolioMetrics.findAll()
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_all_PortfMetrics(req, res) {
    // First find most recent date in the constituents
    PortfolioMetrics.findAll()
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}