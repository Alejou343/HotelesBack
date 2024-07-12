import MaintenanceInventory  from "../models/maintenanceInventory.js";
import { generalValidations } from "../utils/generalValidations.js";

export default class ServiceMaintenanceInventory {
    constructor() { }

    async create(data) {
        try {
            console.log('Data received:', data); // Añade este registro
            //Objeto donde contengo los campos
            const fieldsToCheck = {
                fullName: data.fullName,
                phone: data.phone,
                email: data.email,
                role: data.role
            };
            // Llamo a funcion donde se hace sus respectivas validaciones
            await generalValidations(fieldsToCheck, MaintenanceInventory);
            //Se crea un nuevo registro
            let registerMaintenanceInventory = new MaintenanceInventory(data);
            return await registerMaintenanceInventory.save();
        } catch (error) {
            throw new Error(`CAN NOT CREATE ${error}`);
        }
    }
    

    async getAll() {
        try {
            let maintenanceInventory= await MaintenanceInventory.findAll({ attributes: ['id_maintenanceInventory', 'fullName', 'phone', 'email', 'role', 'code_role', 'state'] })
            return maintenanceInventory
        } catch (error) {
            throw new Error(`CAN NOT FIND`)
        }
    }

    async getById(id) {
        try {
            let maintenanceInventoryByid = await MaintenanceInventory.findByPk(id)
            if(!maintenanceInventoryByid){throw new Error('User not found')}
            return maintenanceInventoryByid
        } catch (error) {
            throw new Error('User not found')
        }
    }

    async update(id, data) {
        try {
            const result = await MaintenanceInventory.update(data, {
                where: { id_maintenanceInventory: id }
            })
            if (result[0] === 0) {
                throw new Error('User not found')
            }
            return result
        } catch (error) {
            throw new Error(`Unable to Update User ${error}`)
        }
    }

    async delete(id) {
        try {
            const result = await MaintenanceInventory.destroy({
                where: { id_maintenanceInventory:id }
            })
            if (result[0] === 0) {
                throw new Error('User not found')
            }
            return result
        } catch (error) {
            throw new Error(`Unable to Update User ${error}`)
        }
    }
}