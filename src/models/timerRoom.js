import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize";
import Room from "./room.js";
import CategoryRoom from "./categoryRoom.js";
import CleaningStaff from "./cleaningStaff.js";

const TimerRoom=sequelize.define('TimerRoom',{
    id_timerRoom:{
        type:DataTypes.INTEGER,
        primarykey: true,
        autoIncrement:true,
    },
    state:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

/************ Establecer relaciones ************/
Room.hasMany(TimerRoom, {
    foreignKey: 'id_room',
    sourceKey: 'id_room'
});

CategoryRoom.hasMany(TimerRoom, {
    foreignKey: 'id_categoryRoom',
    sourceKey: 'id_categoryRoom'
});

CleaningStaff.hasMany(TimerRoom,{
    foreignKey: 'id_cleaningStaff',
    sourceKey: 'id_cleaningStaff'
});

TimerRoom.belongsTo(Room, {
    foreignKey: 'id_room',
    targetKey: 'id_room'
});

TimerRoom.belongsTo(CategoryRoom, {
    foreignKey: 'id_categoryRoom',
    targetKey: 'id_categoryRoom'
});

TimerRoom.belongsTo(CleaningStaff, {
    foreignKey: 'id_cleaningStaff',
    targetKey: 'id_cleaningStaff'
});

export default TimerRoom;