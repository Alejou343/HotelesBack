import Room from "../models/room.js";

export default class ServiceRoom {
    constructor() { }

    async create(data) {
        try {
            const existingNumberRoom = await Room.findOne({ where: { number: data.number } })
            if (existingNumberRoom) throw new Error('Number room already exists')
            if (!data.number) throw new Error('Ther number is required')

            let registerNumber = new Room(data)
            return await registerNumber.save()
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

    async getById(idOperationalRole) {
        try {
            let operationalRoleById = await OperationalRole.findByPk(idOperationalRole)
            if(!operationalRoleById){throw new Error('User not found')}
            return operationalRoleById
        } catch (error) {
            throw new Error('User not found')
        }
    }   
}