var Beta = require('../model/beta-model').default;
var EquityData = require('../model/equity_data-model').default;

import {sequelize} from '../api/config/db';

class IndexConstituent {

    constructor(date, alpha) {
      this.date = date;
      this.alpha = alpha;
      this.weight = 0;
    }

    static getConstituents(constituentModels) {
        var constituents= {};
        var totalCap = 0;
        for (var i = 0; i < constituentModels.length; i++) {
            var constituentModel = constituentModels[i];
            totalCap = totalCap + constituentModel.Gross_Market_Capitalisation;

            var constituent = new IndexConstituent(constituentModel["Date"],constituentModel["Alpha"]);
            constituent.grossMarketCapitalisation = constituentModel.Gross_Market_Capitalisation;
            constituents[constituentModel["Alpha"]] = constituent;
        }

        console.log("*** totalCap "+totalCap);
        // put in the weights and sort by that
        for (var key in constituents) {
            var constituent = constituents[key];
            constituent.totalCapitalisation = totalCap;
            constituent.weight = (constituent.grossMarketCapitalisation*100/totalCap).toFixed(2); 
        }

        //constituents.sort((a, b) => (a.grossMarketCapitalisation > b.grossMarketCapitalisation) ? -1 : 1);
        return constituents;
    }

    static async getConstituentData(indexCode, constituent){
        await constituent.getBetaData(indexCode)
        .then(function(beta) {
            //console.log("**** beta 1 ");
            constituent.Beta = beta;
        })
        .catch(function (err) {
            console.log("*** error getting beta: "+err);
        });
        
        await constituent.getEquityData()
        .then(function(equityData){
            constituent.EquityData = {}
            constituent.EquityData[constituent.date] = equityData;
        })
        .catch(function (err) {
            console.log("*** error getting equity data: "+err);
        });

        await constituent.getIndexEquityData(indexCode)
        .then(function(equityData){
            constituent.IndexEquityData = {}
            constituent.IndexEquityData[constituent.date] = equityData;
        })
        .catch(function (err) {
            console.log("*** error getting index equity data: "+err);
        });

        //constituent.trimEquityData(100)

        constituent.calculateEquityReturns();
        constituent.calculateIndexEquityReturns();
    }

    trimEquityData(number){
        var trimmedEquityData = []
        var trimmedIndexEquityData = []

        var equityData = this.EquityData[this.date]
        var indexEquityData = this.IndexEquityData[this.date]

        var increment = Math.trunc(equityData.length/number);
        var index = 0;
        while (index <= equityData.length - 1){
            trimmedEquityData.push(equityData[index])
            trimmedIndexEquityData.push(indexEquityData[index])
            index += increment
        }

        this.EquityData[this.date] = trimmedEquityData
        this.IndexEquityData[this.date] = trimmedIndexEquityData
    }

    async getBetaData(indexCode) {
        //var transaction = await sequelize.transaction();
        return await Beta.findOne({
            where: sequelize.literal(
                " MONTH([Date]) = MONTH('"+this.date+"') AND"+
                " YEAR([Date]) = YEAR('"+this.date+"') AND"+
                " Instrument = '"+this.alpha+"' AND"+
                " [Index] = '"+indexCode+"'"
            )
        });
    }

    async getEquityData() {
        var startDate = this.Beta.StartDate;

        return await EquityData.findAll({
            where: sequelize.literal(
                " (Date  BETWEEN '"+startDate+"' AND '"+this.date+"') AND"+
                " Instrument = '"+this.alpha+"' AND"+
                " LOWER(DATENAME(dw, [Date]))='friday'"
            ),
            order: [ [ 'Date', 'DESC' ]]
        })
        
    }

    async getIndexEquityData(indexCode) {
        var startDate = this.Beta.StartDate;
        return await EquityData.findAll({
            where: sequelize.literal(
                " (Date  BETWEEN '"+startDate+"' AND '"+this.date+"') AND"+
                " Instrument = '"+indexCode+"' AND"+
                " LOWER(DATENAME(dw, [Date]))='friday'"
            ),
            order: [ [ 'Date', 'DESC' ]]
        })
    }

    calculateEquityReturns(){
        var equityData = this.EquityData[this.date]
        console.log("** p0 "+equityData.length+" "+JSON.stringify(equityData[0]["Price"]))
        console.log("** p0 "+equityData.length+" "+JSON.stringify(equityData[equityData.length - 1]))
        var priceZero = equityData[equityData.length - 1]["Price"];
        
        for (var i = 0; i < equityData.length; i++) {
            var returns  = ((equityData[i]["Price"] - priceZero)*100/priceZero).toFixed(2);
            equityData[i].Return = returns;
        }
    }

    calculateIndexEquityReturns(){
        var indexEquityData = this.IndexEquityData[this.date]
        var priceZero = indexEquityData[indexEquityData.length - 1]["Price"];
        console.log("** p00 "+priceZero)
        for (var i = 0; i < indexEquityData.length; i++) {
            var returns  = ((indexEquityData[i]["Price"] - priceZero)*100/priceZero).toFixed(2);
            indexEquityData[i].Return = returns;
        }
    }
}

export default IndexConstituent;