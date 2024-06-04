import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";
import {generateCustomId} from "../utils/handleIdGenerator.js"

const OperationalRole = sequelize.define('OperationalRole', {

    id_operationalRole: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['resort manager', 'general manager', 'remo supervisor', 'room control', 'front desk', 'assistan manager', 'remodeling official']],
        },
        set(value) {
            this.setDataValue('role', value ? value.toLowerCase() : value);
        },
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
                    case 'resort manager':
                        prefix = 'RM';
                        break;
                    case 'general manager':
                        prefix = 'GM';
                        break;
                    case 'remo supervisor':
                        prefix = 'RS';
                        break;
                    case 'room control':
                        prefix = 'RC';
                        break;
                    case 'front desk':
                        prefix = 'FD';
                        break;
                    case 'assistan manager':
                        prefix = 'AM';
                        break;
                    case 'remodeling official':
                        prefix = 'RO';
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

export default OperationalRole;
