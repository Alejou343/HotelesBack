import CategoryRoom from "../models/categoryRoom.js";

export default class ServiceCategoryRoom {
    constructor() { }

    async create(data) {
        try {
            const existingName = await CategoryRoom.findOne({ where: { name: data.name } })
            if (existingName) throw new Error('Categry name already exists')

            switch (data.name) {
                case 'Vacant and Clean':
                    try {
                        data.abbreviation = 'V/C'
                        let categoryRoom = new CategoryRoom(data)
                        await categoryRoom.save()
                    } catch (error) {
                        throw new Error(`Vacant and Clean category cannot be created: ${error.message}`)
                    }
                    break;
                case 'Occupied':
                    try {
                        data.abbreviation = 'O'
                        let categoryRoom = new CategoryRoom(data)
                        await categoryRoom.save()
                    } catch (error) {
                        throw new Error(`Occupied cannot be created: ${error.message}`)
                    }
                    break;
                case 'Vacant and dirty':
                    try {
                        data.abbreviation = 'V/D'
                        let categoryRoom = new CategoryRoom(data)
                        await categoryRoom.save()
                    } catch (error) {
                        throw new Error(`Vacant and Dirty  category cannot be created: ${error.message}`)
                    }
                    break;
            }



        } catch (error) {
            throw new Error(`CAN NOT CREATE ${error}`)
        }
    }

    async getAll() {
        try {
            let room = await Room.findAll()
            return room
        } catch (error) {
            throw new Error('CAN NOT FIND')
        }
    }

    async getById(idRoom) {
        try {
            let roomById = await Room.findByPk(idRoom)
            if (!roomById) { throw new Error('Room not found') }
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