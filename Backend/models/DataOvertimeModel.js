import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const DataOvertime = db.define('data_overtime', {
    id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    pegawai_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    nama_pegawai: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    date_overtime: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hours: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    freezeTableName: true
});

export default DataOvertime;
