import ServiceRoom from "../services/serviceRoom.js";

export default class Room {
    constructor() { }

    static roomService = new ServiceRoom()

    async create(request, response) {
        try {
            let data = request.body
            await Room.roomService.create(data)
            response.status(200).json({
                message: 'successes entering the Room',
                data: null
            })
        } catch (error) {
            response.status(400).json({
                message: `Error creating Room ${error}`,
                data: null
            })
        }
    }
    async getAll(request, response) {
        try {
            response.status(200).json({
                message: 'successes find the Rooms',
                data: await Room.roomService.getAll()
            })
        } catch (error) {
            response.status(400).json({
                message: `Error searching for Room ${error}`,
                data: null
            })
        }
    }

    async getAllById(request, response) {
        try {
            let id = request.params.id
            response.status(200).json({
                message: 'successes find the room',
                data: await Room.roomService.getById(id)
            })
        } catch (error) {
            response.status(400).json({
                message: `Error searching for room  ${error}`,
                data: null
            })
        }
    }
    async update(request, response) {
        try {
            let id = request.params.id
            let data = request.body
            await Room.roomService.update(id, data)
            response.status(200).json({
                message: 'Success Upgrading the room',
                data: null
            })
        } catch (error) {
            response.status(400).json({
                message: `Error Upgrading the room ${error}`,
                data: null
            })
        }
    }

    async delete(request, response) {
        try {
            let id = request.params.id
            const result = await Room.roomService.delete(id)
            response.status(200).json({
                message: 'Room deleted successfully',
                data: result
            })
        } catch (error) {
            response.status(400).json({
                message: `Error deleted the Room ${error}`,
                data: null
            })
        }
    }
}