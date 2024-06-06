import ServiceMaintenanceInventory from "../services/serviceMaintenanceInventory.js";

export default class MaintenanceInventory {
    constructor() { }

    static maintenanceInventory = new ServiceMaintenanceInventory();

    async create(request, response) {
        try {
            let data = request.body
            await MaintenanceInventory.maintenanceInventory.create(data)
            response.status(200).json({
                message: 'successes entering the operationalRole',
                data: null
            })
        } catch (error) {
            response.status(400).json({
                message: `Error creating user ${error}`,
                data: null
            })
        }
    }
    async getAll(request, response) {
        try {
            response.status(200).json({
                message: 'successes find the operational roles',
                data: await MaintenanceInventory.maintenanceInventory.getAll()
            })
        } catch (error) {
            response.status(400).json({
                message: `Error searching for users ${error}`,
                data: null
            })
        }
    }

    async getAllById(request, response) {
        try {
            let id = request.params.id
            response.status(200).json({
                message: 'successes find the user',
                data: await MaintenanceInventory.maintenanceInventory.getById(id)
            })
        } catch (error) {
            response.status(400).json({
                message: `Error searching for user  ${error}`,
                data: null
            })
        }
    }

    async update(request, response) {
        try {
            let id = request.params.id
            let data = request.body
            await MaintenanceInventory.maintenanceInventory.update(id, data)
            response.status(200).json({
                message: 'Success Upgrading the user',
                data: null
            })
        } catch (error) {
            response.status(400).json({
                message: `Error Upgrading the user ${error}`,
                data: null
            })
        }
    }

    async delete(request, response) {
        try {
            let id = request.params.id
            const result = await MaintenanceInventory.maintenanceInventory.delete(id)
            response.status(200).json({
                message: 'User deleted successfully',
                data: result
            })
        } catch (error) {
            response.status(400).json({
                message: `Error deleted the user ${error}`,
                data: null
            })
        }
    }
}