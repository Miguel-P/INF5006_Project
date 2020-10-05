import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';

const Index = sequelize.define('Index', {
    IndexCode: {
        primaryKey: true,
        type: DataTypes.STRING
    },
    IndexType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    IndexName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'tbl_FTSEJSE_Index_Series',
    timestamps: false
});

export default Index;
