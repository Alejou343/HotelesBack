import CleaningStaff  from "../models/cleaningStaff";
import { generalValidations } from "../utils/generalValidations.js";

export default class ServiceCleaningStaff {
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
            await generalValidations(fieldsToCheck, CleaningStaff);
            //Se crea un nuevo registro
            let registerCleaningStaff = new CleaningStaff(data);
            return await registerCleaningStaff.save();
        } catch (error) {
            throw new Error(`CAN NOT CREATE ${error}`);
        }
    }
    

    async getAll() {
        try {
            let cleaningStaff= await CleaningStaff.findAll()
            return cleaningStaff
        } catch (error) {
            throw new Error(`CAN NOT FIND`)
        }
    }

    async getById(id) {
        try {
            let cleaningStaffByid = await CleaningStaff.findByPk(id)
            if(!cleaningStaffByid){throw new Error('User not found')}
            return cleaningStaffByid
        } catch (error) {
            throw new Error('User not found')
        }
    }

    async update(id, data) {
        try {
            const result = await CleaningStaff.update(data, {
                where: { id_cleaningStaff: id }
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
            const result = await CleaningStaff.destroy({
                where: { id_cleaningStaff:id }
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