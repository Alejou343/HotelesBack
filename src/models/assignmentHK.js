import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";
import Room from "./room.js";
import CleaningStaff from "./cleaningStaff.js";

const AssignmentHk = sequelize.define('AssignmentHk', {
    id_assignment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_room: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Room,
            key: 'id_room'
        }
    },
    id_cleaningStaff: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CleaningStaff,
            key: 'id_cleaningStaff'
        }
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

// Asociaciones
AssignmentHk.belongsTo(Room, { foreignKey: 'id_room' });
AssignmentHk.belongsTo(CleaningStaff, { foreignKey: 'id_cleaningStaff' });

export default AssignmentHk;
