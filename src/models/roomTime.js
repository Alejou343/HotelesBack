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
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['v/c', 'o', 'v/d', 'ooo', 'clean/in', 'clean/out', 'p/s', 'RM', 'S/O', 'E/CH', 'MT/IN', 'MT/OUT', 'M/P', 'REMO PROJECT']]
        }
    },
    profile: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    initialDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    timestamps: false
});

// Relaciones
Room.hasMany(RoomTime, { foreignKey: 'roomId', sourceKey: 'id_room', onDelete: 'CASCADE' });
RoomTime.belongsTo(Room, { foreignKey: 'roomId', targetKey: 'id_room' });

CleaningStaff.hasMany(RoomTime, { foreignKey: 'profile', sourceKey: 'id_cleaningStaff' });
RoomTime.belongsTo(CleaningStaff, { foreignKey: 'profile', targetKey: 'id_cleaningStaff' });

export default RoomTime;


