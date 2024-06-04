import OperationalRole from "../models/operationalRole.js";

export default class ServiceOperationalRole{
    constructor() {}

    async create(dataOperational){
        try {
            let registerOperationalRole=new OperationalRole(dataOperational)
            return await registerOperationalRole.save()
        } catch (error) {
            throw new Error(`CAN NOT CREATE ${error}`)
        }
    }
    async getAll(){
        try {
            let operationalRoles=await OperationalRole.findAll()
            return operationalRoles
        } catch (error) {
            throw new Error(`CAN NOT SEARCH`)
        }
    }
}