import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
import moment from 'moment';

const IndexConstituent = sequelize.define('IndexConstituent', {
    Date: {
        primaryKey: true,
        type: DataTypes.DATE,
        get: function(fieldName) {
            return moment.utc(this.getDataValue(fieldName)).format('YYYY-MM-DD')
        }
    },
    Alpha: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false
    },
    Instrument: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Gross_Market_Capitalisation: {
        field: 'Gross Market Capitalisation',
        type: DataTypes.FLOAT
    },
    Cumulative_Market_Capitalisation: {
        field: 'Cumulative Market Capitalisation',
        type: DataTypes.FLOAT
    }
}, {
    tableName: 'tbl_Index_Constituents',
    timestamps: false
});

export default IndexConstituent;
