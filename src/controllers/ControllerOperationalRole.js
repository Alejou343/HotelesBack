import ServiceOperationalRole from "../services/serviceOperationalRole.js";

export default class OperationalRole{
    constructor (){}
    async createOperationalRole(request, response){
        let operationalRole=new ServiceOperationalRole()
        try {
            let dataOperationalRoles=request.body
            await operationalRole.create(dataOperationalRoles)
            response.status(200).json({
                message:'successes entering the operationalRole',
                data:null
            })
        } catch (error) {
            response.status(400).json({
                message:`Error ${error}`,
                data:null
            })
        }
    }

    async getAll(request,response){
        let operationalRole=new ServiceOperationalRole()
        try {
            response.status(200).json({
                message:'successes find the operational roles',
                data: await operationalRole.getAll()
            })
        } catch (error) {
            response.status(400).json({
                message:`Error ${error}`,
                data:null
            })
        }
    }
}