import roomtimeService from "../services/roomTimeService.js";

export default class roomTime {
    constructor() { }

    static rtService = new roomtimeService()

    async create(request, response) {
        try {
            let data = request.body
            await roomTime.rtService.add(data)
            response.status(200).json({
                message: 'successes entering the roomtime',
                data: null
            })
        } catch (error) {
            response.status(400).json({
                message: `Error creating roomtime ${error}`,
                data: null
            })
        }
    }

    async getTimesByRoomId(request, response) {
        try {
            let room = request.params.roomId;
            response.status(200).json({
                message: 'successes find the report',
                data: await roomTime.rtService.getTimesByRoomId(room)
            })
        } catch (error) {
            response.status(400).json({
                message: `Error searching for room  ${error}`,
                data: null
            })
        }
    }

    async getByRoomId(request, response) {
        try {
            let room = request.params.roomId;
            response.status(200).json({
                message: 'successes find the room',
                data: await roomTime.rtService.getByRoomId(room)
            })
        } catch (error) {
            response.status(400).json({
                message: `Error searching for room  ${error}`,
                data: null
            })
        }
    }
}