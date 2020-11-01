import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
import moment from 'moment';

const PortfolioMetrics = sequelize.define('PortfolioMetrics', {
    Date: {
        primaryKey: true,
        type: DataTypes.DATE,
        get: function(fieldName) {
            return moment.utc(this.getDataValue(fieldName)).format('YYYY-MM-DD')
        }
    },
    IndexCode: {
        primaryKey: true,
        field: 'index_code',
        type: DataTypes.STRING,
        allowNull: false
    },
    MarketIndexCode: {
        primaryKey: true,
        field: 'mkt_index_code',
        type: DataTypes.STRING,
        allowNull: false
    },
    MarketVolatility: {
        field: 'mkt_vol',
        type: DataTypes.FLOAT,
        allowNull: false
    },
    PortfolioBeta: {
        type: DataTypes.FLOAT,
        field: 'port_beta',
        allowNull: false
    },
    PortfolioSystemicVolatility: {
        type: DataTypes.FLOAT,
        field: 'port_spec_vol',
        allowNull: false
    },
    PortfolioVolatility: {
        type: DataTypes.FLOAT,
        field: 'port_vol',
        allowNull: false
    }
    // SystemicCovMatrix: {
    //     type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.FLOAT)),
    //     field: 'sys_cov_mat',
    //     allowNull: false
    // },
    // SpecificCovMatrix: {
    //     type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.FLOAT)),
    //     field: 'spec_cov_mat',
    //     allowNull: false
    // },
    // TotalCovMatrix: {
    //     type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.FLOAT)),
    //     field: 'total_cov_mat',
    //     allowNull: false
    // },
    // CorrelationMatrix: {
    //     type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.FLOAT)),
    //     field: 'corr_mat',
    //     allowNull: false
    // },
    // MatrixID: {
    //     type: DataTypes.ARRAY,
    //     field: 'mat_id',
    //     allowNull: false
    // },
    // SharesExcluded: {
    //     type: DataTypes.ARRAY(DataTypes.STRING),
    //     field: 'shares_excl',
    //     allowNull: false
    // }
}, {
    tableName: 'portfolio_metrics',
    timestamps: false
});

export default PortfolioMetrics;
