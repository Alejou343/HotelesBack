import OperationalRole from "../models/operationalRole.js";
import { generalValidations } from "../utils/generalValidations.js";

export default class ServiceOperationalRole {
    constructor() { }

    async create(dataOperational) {
        try {
            //Objeto donde contengo los campos
            const fieldsToCheck = {
                fullName: dataOperational.fullName,
                phone: dataOperational.phone,
                email: dataOperational.email,
                role: dataOperational.role
            };
            // Llamo a funcion donde se hace sus respectivas validaciones
            await generalValidations(fieldsToCheck, OperationalRole);
            //Se crea un nuevo registro
            let registerOperationalRole = new OperationalRole(dataOperational)
            return await registerOperationalRole.save()
        } catch (error) {
            throw new Error(`CAN NOT CREATE ${error}`)
        }
    }

    async getAll() {
        try {
            let operationalRoles = await OperationalRole.findAll({ attributes: ['fullName', 'phone', 'email', 'role', 'code_role', 'state'] })
            return operationalRoles
        } catch (error) {
            throw new Error(`CAN NOT FIND`)
        }
    }

    async getById(idOperationalRole) {
        try {
            let operationalRoleById = await OperationalRole.findByPk(idOperationalRole)
            if(!operationalRoleById){throw new Error('User not found')}
            return operationalRoleById
        } catch (error) {
            throw new Error('User not found')
        }
    }

    async update(id, data) {
        try {
            const result = await OperationalRole.update(data, {
                where: { id_operationalRole: id }
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
            const result = await OperationalRole.destroy({
                where: { id_operationalRole: id }
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