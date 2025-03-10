import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Room = sequelize.define('Room', {
    id_room: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hotelName: {
        type: DataTypes.STRING,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name_category_room: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['v/c', 'o', 'v/d', 'ooo', 'clean/in', 'clean/out', 'p/s', 'REMO/IN','PAINT/IN','DEP','RM', 'S/O', 'E/CH', 'MT/IN', 'MT/OUT', 'M/P', 'REMO PROJECT','Confirmar']]
        }
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

export default Room;

