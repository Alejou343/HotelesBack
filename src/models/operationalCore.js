import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";
import CleaningStaff from "./cleaningStaff.js";
import OperationalRole from "./operationalRole.js"
import MaintenanceInventory from "./maintenanceInventory.js"

const OperationalCore=sequelize.define('OperationalCore',{
    id_operationalCore:{
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    state:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

OperationalRole.hasMany(OperationalCore, {
    foreignKey: 'id_operationalRole',
    sourceKey: 'id_operationalRole'
});

MaintenanceInventory.hasMany(OperationalCore, {
    foreignKey: 'id_maintenanceInventory',
    sourceKey: 'id_maintenanceInventory'
});

CleaningStaff.hasMany(OperationalCore,{
    foreignKey: 'id_cleaningStaff',
    sourceKey: 'id_cleaningStaff'
});

OperationalCore.belongsTo(OperationalRole, {
    foreignKey: 'id_operationalRole',
    targetKey: 'id_operationalRole'
});

OperationalCore.belongsTo(MaintenanceInventory, {
    foreignKey: 'id_maintenanceInventory',
    targetKey: 'id_maintenanceInventory'
});

OperationalCore.belongsTo(CleaningStaff, {
    foreignKey: 'id_cleaningStaff',
    targetKey: 'id_cleaningStaff'
});

export default OperationalCore;