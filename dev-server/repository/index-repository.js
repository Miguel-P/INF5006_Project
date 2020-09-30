import {sequelize} from '../api/config/db';
var IndexConstituentModel = require('../model/index_constituent-model').default;
var IndexConstituentRep = require('./index_constituent-repository');

class Index {
    constructor(code) {
        
        this.code = code;

        this.codeColumns = {
            "J203":"ALSI New","J204":"ALSI New",
            "J205":"Index New","J201":"Index New","J202":"Index New",
            "J200":"TOPI New","J210":"RESI New","J212":"FINI New","J211":"INDI New",
            "J254":"PCAP New","J253":"SAPY New","J232":"ALTI New"
        };

        this.alternateCodes = {
            "J203":"ALSI","J204":"FLED",
            "J205":"LRGC","J201":"MIDC","J202":"SMLC",
            "J200":"TOPI","J210":"RESI","J212":"FINI","J211":"INDI",
            "J254":"PCAP","J253":"SAPY","J232":"ALTI"
        };
    }

    set setDate(date){
        this.date = date;
    }

    /**
     * The method will get constituents data for the index
     * It also gets all the periods so that users can choose from UI
     * @param {*} date 
     */
    async getData(date) {
        var results = {"success":0};
        var code = this.code;
        var indexRep = this;
        var constituentModels;

        indexRep.date = date

        // Get all periods
        await IndexConstituentModel.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('Date')), 'Date']],
            order: [ [ 'Date', 'DESC' ]]
        })
        .then(function(dates){
            console.log("**** index rep dates "+dates.length);
            indexRep.dates = dates;
        })
        .catch(function (err) {
            results["message"] = err;
            console.log("*** dates error "+err)
            return results;
        });

        // Get all constituent models for specified period
        await IndexConstituentModel.findAll({
            where: sequelize.literal
            (
                " ["+this.codeColumns[this.code]+"] = '"+this.alternateCodes[this.code]+"' AND"+
                " Date = '"+date+"'"
            )
        })
        .then(function(constituents){
            console.log("**** index rep 1 "+constituents.length);
            constituentModels = constituents;
        })
        .catch(function (err) {
            results["message"] = err;
            return results;
        });

        // Gets the repository from the models and calculates the market values
        indexRep.constituents = IndexConstituentRep.getConstituents(constituentModels);
        
        // Gets the equity data of the consituent with biggest market share
        // Other constituents equity data can be obtained when user specifically selects on UI
        var key = Object.keys(indexRep.constituents)[0];
        await IndexConstituentRep.getConstituentData(code, indexRep.constituents[key]);

        results["success"] = 1;

        return results;
    }

    async getConstituentAndData(constituentCode) {
        var results = {"success":0}
        var indexColumn = this.codeColumns[this.code]
        var indexAlternateCode = this.alternateCodes[this.code]
        var constituent = null;

        await IndexConstituentModel.findOne({
            where: sequelize.literal(
                " Date = '"+date+"' AND"+
                " ["+indexColumn+"] = '"+indexAlternateCode+"' AND"+
                " Alpha = '"+constituentCode+"'"
            )
        })
        .then(function(constituentModel) {
            constituent = new IndexConstituent(constituentModel["Date"],constituentModel["Alpha"]);
        }).catch(function (err) {
            results["message"] = err
            return results
        });

        await IndexConstituent.getConstituentData(indexCode, constituent)

        results["success"] = 1
        results["message"] = "Success"
        results["data"] = constituent
        return results
    }
}

export default Index;