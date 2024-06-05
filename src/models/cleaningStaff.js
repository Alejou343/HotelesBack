import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";
import {generateCustomId} from "../utils/handleIdGenerator.js"

const CleaningStaff = sequelize.define('CleaningStaff', {

    id_cleaningStaff: {
        type: DataTypes.INTEGER,HkSupervisorryKey: true,
        autoIncrement: true 
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
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
                args: [['Hk Supervisor', 'HouseKeeper', 'HM Supervisor', 'HouseMan']],
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
        beforeCreate: async (operationalRole, options) => {
            try {
                let prefix;
                switch (operationalRole.role) {
                    case 'Hk Supervisor':
                        prefix = 'HKS';
                        break;
                    case 'HouseKeeper':
                        prefix = 'HK';
                        break;
                    case 'HM Supervisor':
                        prefix = 'HMS';
                        break;
                    case 'HouseMan':
                        prefix = 'HM';
                        break;   
                    default:
                        throw new Error('Invalid role');
                }
                operationalRole.code_role = await generateCustomId(prefix, operationalRole.constructor, 'code_role', 'role', operationalRole.role);
            
            } catch (error) {
                console.error('Error al generar el ID personalizado:', error);
                throw error;
            }
        }
    }
});

export default CleaningStaff;