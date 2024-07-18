import Room from "../models/room.js";

export default class ServiceRoom {
    constructor() { }

    async create(data) {
        try {
            if (!data.number) throw new Error('Ther number is required')

            let registerNumber = new Room(data)
            return await registerNumber.save()
        } catch (error) {
            throw new Error(`CAN NOT CREATE ${error}`)
        }
    }

    async getAll() {
        try {
            let room = await Room.findAll({ attributes: ['id_room', 'number','name_category_room', 'state'] })
            return room
        } catch (error) {
            throw new Error('CAN NOT FIND')
        }
    }

    async getById(idRoom) {
        try {
            let roomById = await Room.findByPk(idRoom)
            if(!roomById){throw new Error('Room not found')}
            return roomById
        } catch (error) {
            throw new Error('Room not found')
        }
    }
    
    async update(id, data) {
        try {
            const result = await Room.update(data, {
                where: { id_room: id }
            })
            if (result[0] === 0) {
                throw new Error('Room not found')
            }
            return result
        } catch (error) {
            throw new Error(`Unable to Update Room ${error}`)
        }
    }

    async delete(id) {
        try {
            const result = await Room.destroy({
                where: { id_room: id }
            })
            if (result[0] === 0) {
                throw new Error('Room not found')
            }
            return result
        } catch (error) {
            throw new Error(`Unable to Update Room ${error}`)
        }
    }
}