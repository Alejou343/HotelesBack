import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Room from './room.js';
import CleaningStaff from './cleaningStaff.js';

const RoomTime = sequelize.define('RoomTime', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hotelName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roomNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

// Relaciones
Room.hasMany(RoomTime, { foreignKey: 'roomNumber', sourceKey: 'number' });
RoomTime.belongsTo(Room, { foreignKey: 'roomNumber', targetKey: 'number' });

CleaningStaff.hasMany(RoomTime, { foreignKey: 'profile', sourceKey: 'fullName' });
RoomTime.belongsTo(CleaningStaff, { foreignKey: 'profile', targetKey: 'fullName' });

export default RoomTime;


