import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Room = sequelize.define('Room', {
    id_room: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

export default Room;