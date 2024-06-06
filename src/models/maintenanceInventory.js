import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";
import { generateCustomId } from "../utils/handleIdGenerator.js";

const MaintenanceInventory = sequelize.define('MaintenanceInventory', {
    id_maintenanceInventory: {
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
                args: [['building manager', 'quality control', 'lost y found', 'inventory', 'mt supervisor', 'maintenace tech', 'painter']],
                msg: 'Only these roles are allowed: building manager, quality control, lost y found, inventory, mt supervisor, maintenace tech, painter'
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
        beforeCreate: async (maintenanceInventory, options) => {
            try {
                let prefix;
                switch (maintenanceInventory.role) {
                    case 'building manager':
                        prefix = 'BM';
                        break;
                    case 'quality control':
                        prefix = 'QC';
                        break;
                    case 'lost y found':
                        prefix = 'LF';
                        break;
                    case 'inventory':
                        prefix = 'IV';
                        break;
                    case 'mt supervisor':
                        prefix = 'MTS';
                        break;
                    case 'maintenace tech':
                        prefix = 'MT';
                        break;
                    case 'painter':
                        prefix = 'P';
                        break;
                    default:
                        throw new Error('Invalid role');
                }
                maintenanceInventory.code_role = await generateCustomId(prefix, maintenanceInventory.constructor, 'code_role', 'role', maintenanceInventory.role);

            } catch (error) {
                console.error('Error al generar el ID personalizado:', error);
                throw error;
            }
        }
    }
});

export default MaintenanceInventory;
