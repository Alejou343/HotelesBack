import express from 'express'
import OperationalRole from '../controllers/ControllerOperationalRole.js'

let operationalRole=new OperationalRole()

let routes=express.Router()
routes.post('/api/operationalRole',operationalRole.createOperationalRole)
routes.get('/api/operationalRoles',operationalRole.getAll)



export default routes