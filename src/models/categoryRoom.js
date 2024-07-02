import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";


const CategoryRoom = sequelize.define('CategoryRoom', {
    id_categoryRoom: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['Vacant and Clean', 'Occupied', 'Vacant and dirty', 'Out of service ', 'Cleaning start', 'Cleaning out', 'Pending for supervision','Removed','Stay over','Early check out ','Maintenance in','Maintenance out','Maintenance Project','Linen Remove','Remodeling Project assigned']],
                msg: 'Only these Categories are allowed: Vacant and Clean, Occupied , Vacant and dirty, Out of service  , Cleaning start , Cleaning out , Pending for supervision , Removed , Stay over , Early check out  , Maintenance in, Maintenance out , Maintenance Project , Linen Remove, Remodeling Project assigned'
            }
        },
        set(value) {
            this.setDataValue('name', value ? value.toLowerCase() : value);
        }
    },
    abbreviation: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

export default CategoryRoom;