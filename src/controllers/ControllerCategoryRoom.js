import ServiceCategoryRoom from "../services/serviceCategoryRoom.js";

export default class CategoryRoom{
    constructor(){}

    static categoryRoomService=new ServiceCategoryRoom()

    async create(request, response) {
        try {
            let data = request.body
            await CategoryRoom.categoryRoomService.create(data)
            response.status(400).json({
                message: 'successes entering the  Category Room',
                data: null
            })
        } catch (error) {
            response.status(400).json({
                message: `Error creating Category Room ${error}`,
                data: null
            })
        }
    }
    async getAll(request, response) {
        try {
            response.status(200).json({
                message: 'successes find the  Category Rooms',
                data: await CategoryRoom.categoryRoomService.getAll()
            })
        } catch (error) {
            response.status(400).json({
                message: `Error searching for  CategoryRoom ${error}`,
                data: null
            })
        }
    }

    async getAllById(request, response) {
        try {
            let id = request.params.id
            response.status(200).json({
                message: 'successes find the  category room',
                data: await CategoryRoom.categoryRoomService.getById(id)
            })
        } catch (error) {
            response.status(400).json({
                message: `Error searching for  category room  ${error}`,
                data: null
            })
        }
    }
    async update(request, response) {
        try {
            let id = request.params.id
            let data = request.body
            await CategoryRoom.categoryRoomService.update(id, data)
            response.status(200).json({
                message: 'Success Upgrading the  category room',
                data: null
            })
        } catch (error) {
            response.status(400).json({
                message: `Error Upgrading the category room ${error}`,
                data: null
            })
        }
    }

    async delete(request, response) {
        try {
            let id = request.params.id
            const result = await CategoryRoom.categoryRoomService.delete(id)
            response.status(200).json({
                message: ' Category Room deleted successfully',
                data: result
            })
        } catch (error) {
            response.status(400).json({
                message: `Error  category deleted the Room ${error}`,
                data: null
            })
        }
    }
}