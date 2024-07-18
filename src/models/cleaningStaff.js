import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";
import { generateCustomId } from "../utils/handleIdGenerator.js";

const CleaningStaff = sequelize.define('CleaningStaff', {
    id_cleaningStaff: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Agregar unique para crear un índice único
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: {
                msg: 'Phone number must contain only numbers'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Invalid email format'
            }
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['hk supervisor', 'housekeeper', 'hm supervisor', 'houseman']],
                msg: 'Only these roles are allowed: Hk Supervisor, HouseKeeper, HM Supervisor, HouseMan'
            }
        },
        set(value) {
            this.setDataValue('role', value ? value.toLowerCase() : value);
        }
    },
    code_role: {
        type: DataTypes.STRING,
        //allowNull: false
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    hooks: {
        beforeCreate: async (cleaningStaff, options) => {
            try {
                let prefix;
                switch (cleaningStaff.role) {
                    case 'hk supervisor':
                        prefix = 'HKS';
                        break;
                    case 'housekeeper':
                        prefix = 'HK';
                        break;
                    case 'hm supervisor':
                        prefix = 'HMS';
                        break;
                    case 'houseman':
                        prefix = 'HM';
                        break;
                    default:
                        throw new Error('Invalid role');
                }
                cleaningStaff.code_role = await generateCustomId(prefix, cleaningStaff.constructor, 'code_role', 'role', cleaningStaff.role);
            } catch (error) {
                console.error('Error al generar el ID personalizado:', error);
                throw error;
            }
        }
    }
});


export default CleaningStaff;

