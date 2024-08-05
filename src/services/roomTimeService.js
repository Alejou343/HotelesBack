import RoomTime from '../models/roomTime.js'
import CleaningStaff from '../models/cleaningStaff.js'

export default class roomTimeService {
    constructor() { }

    async add(data){
        try {

            let newRoomTime = new RoomTime(data)
            newRoomTime.initialDate = new Date()
            let current = await this.getCurrentState(newRoomTime.roomId);
            if(current != null){
                if(current.category != newRoomTime.category){
                    await this.updateEndDate(current.id);
                    return await newRoomTime.save()
                }
                else{
                    throw new Error('same category')
                }                
            }
            else
            {
                return await newRoomTime.save()
            }
           
        } catch (error) {
            throw new Error(`CAN NOT CREATE ${error}`)
        }
    }

    async updateEndDate(id) {
        try {
            const result = await RoomTime.update({ endDate : new Date()}, {
                where: { id: id }
            })
            if (result[0] === 0) {
                throw new Error('roomtime not found')
            }
            return result
        } catch (error) {
            throw new Error(`Unable to Update roomtime ${error}`)
        }
    }

    async getCurrentState(room) {
        try {
            let result = await RoomTime.findOne({ where: { roomId : room, endDate: null} })
            return result
        } catch (error) {
            throw new Error('CAN NOT FIND')
        }
    }

    async getByRoomId(room) {
        try {
            let result = await RoomTime.findAll({ where: { roomId : room} })
            return result
        } catch (error) {
            throw new Error('CAN NOT FIND')
        }
    }

    async getTimesByRoomId(room) {
        try {
            const result = await RoomTime.findAll({ 
                where: { roomId : room} ,
                include: [{
                model: CleaningStaff,
                attributes: ['fullName'] // Campos que deseas incluir
              }]})

              console.log(result)

            const report = result.map(state => {

                const startTime = new Date(state.initialDate);
                const endTime = state.endDate ? new Date(state.endDate) : new Date();
                const duration = endTime - startTime; // Duración en milisegundos
               
                return {
                  idRoom: state.roomId,
                  category: state.category,
                  cleaningStaff : state.CleaningStaff.fullName,
                  startDate: state.initialDate,
                  endDate: state.endDate,
                  duration: duration / 1000 // Duración en segundos
                };
              });

            return report
        } catch (error) {
            console.log(error);
            throw new Error('CAN NOT FIND')
        }
    }
}