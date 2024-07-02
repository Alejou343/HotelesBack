import CategoryRoom from "../models/categoryRoom.js";

export default class ServiceCategoryRoom {
    constructor() { }

    async create(data) {
        try {
            const existingName = await CategoryRoom.findOne({ where: { name: data.name } });
            if (existingName) throw new Error('Category name already exists');

            // Función para asignar automáticamente la abreviatura
            const assignAbbreviation = (name) => {
                switch (name) {
                    case 'Vacant and Clean':
                        return 'V/C';
                    case 'Occupied':
                        return 'O';
                    case 'Vacant and Dirty':
                        return 'V/D';
                    case 'Out of Service':
                        return 'OOO';
                    case 'Cleaning Start':
                        return 'CLEAN/IN';
                    case 'Cleaning Out':
                        return 'CLEAN/OUT';
                    case 'Pending for supervision':
                        return 'P/S';
                    case 'Removed':
                        return 'RM';
                    case 'Stay Over':
                        return 'S/O';
                    case 'Early check out ':
                        return 'E/CH';
                    case 'Maintenance in':
                        return 'MT/IN';
                    case 'Maintenance out':
                        return 'MT/OUT';
                    case 'Maintenance Project':
                        return 'M/P';
                    case 'Linen Remove':
                        return 'DEP';
                    case 'Remodeling Project assigned':
                        return 'REMO PROJECT';

                    default:
                        return null;
                }
            };
            // Asignar abreviatura automáticamente o verificar si ya está proporcionada
            data.abbreviation = assignAbbreviation(data.name) || data.abbreviation;

            if (!data.abbreviation) {
                throw new Error('Abbreviation is required for custom categories');
            }

            // Guardar la nueva categoría
            let categoryRoom = new CategoryRoom(data);
            await categoryRoom.save();

        } catch (error) {
            throw new Error(`CAN NOT CREATE: ${error.message}`);
        }
    }


    async getAll() {
        try {
            let categoryRoom = await CategoryRoom.findAll()
            return categoryRoom
        } catch (error) {
            throw new Error('CAN NOT FIND')
        }
    }

    async getById(idCategoryRoom) {
        try {
            let categoryRoomById = await CategoryRoom.findByPk(idCategoryRoom)
            if (!categoryRoomById) { throw new Error('Category Room by ID not found') }
            return categoryRoomById
        } catch (error) {
            throw new Error(' Category Room not found')
        }
    }

    async update(id, data) {
        try {
            const result = await CategoryRoom.update(data, {
                where: { id_categoryRoom: id }
            })
            if (result[0] === 0) {
                throw new Error(' Category Room not found')
            }
            return result
        } catch (error) {
            throw new Error(`Unable to Update  category Room ${error}`)
        }
    }

    async delete(id) {
        try {
            const result = await CategoryRoom.destroy({
                where: { id_categoryRoom: id }
            })
            if (result[0] === 0) {
                throw new Error('Category Room not found')
            }
            return result
        } catch (error) {
            throw new Error(`Unable to Update Category Room ${error}`)
        }
    }
}