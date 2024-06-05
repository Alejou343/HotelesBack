import express from 'express'
import OperationalRole from '../controllers/ControllerOperationalRole.js'

let operationalRole=new OperationalRole()

let routes=express.Router()

//OPERATIONAL ROLE
routes.post('/api/operationalRole',operationalRole.createOperationalRole);
routes.get('/api/operationalRoles',operationalRole.getAll);
routes.get('/api/operationalRole/:id/',operationalRole.getAllById)
routes.put('/api/operationalRole/:id/',operationalRole.update)
routes.delete('/api/operationalRole/:id/',operationalRole.delete)


export default routes