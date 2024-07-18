import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";
import CleaningStaff from "./cleaningStaff.js";
import MaintenanceInventory from "./maintenanceInventory.js"; // Importa el modelo

const Assignment = sequelize.define('Assignment', {
    id_assignment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    supervisor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    worker_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['hk supervisor', 'hm supervisor', 'houseman', 'housekeeper']]
        }
    },
    assignment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    inventory_id: { // Nueva columna para la asociación con MaintenanceInventory
        type: DataTypes.INTEGER,
        allowNull: true // o false según tus necesidades
    }
});

// Establecer asociaciones
CleaningStaff.hasMany(Assignment, { foreignKey: 'supervisor_id', as: 'supervisorAssignments' });
CleaningStaff.hasMany(Assignment, { foreignKey: 'worker_id', as: 'workerAssignments' });
Assignment.belongsTo(CleaningStaff, { foreignKey: 'supervisor_id', as: 'supervisor' });
Assignment.belongsTo(CleaningStaff, { foreignKey: 'worker_id', as: 'worker' });

MaintenanceInventory.hasMany(Assignment, { foreignKey: 'inventory_id', as: 'assignments' }); // Asociación adicional
Assignment.belongsTo(MaintenanceInventory, { foreignKey: 'inventory_id', as: 'inventory' }); // Asociación adicional

export default Assignment;
