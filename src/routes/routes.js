import express from 'express'
import OperationalRole from '../controllers/ControllerOperationalRole.js'
import MaintenanceInventory from '../controllers/ControllerMaintenanceInventory.js'

let operationalRole=new OperationalRole()
let  maintenanceInventory= new MaintenanceInventory()

let routes=express.Router()

//OPERATIONAL ROLE
routes.post('/api/operationalRole',operationalRole.createOperationalRole);
routes.get('/api/operationalRoles',operationalRole.getAll);
routes.get('/api/operationalRole/:id/',operationalRole.getAllById)
routes.put('/api/operationalRole/:id/',operationalRole.update)
routes.delete('/api/operationalRole/:id/',operationalRole.delete)

//MAINTENANCE INVENTORY
routes.post('/api/maintenanceInventory',maintenanceInventory.create);
routes.get('/api/maintenanceInventories',maintenanceInventory.getAll);
routes.get('/api/maintenanceInventory/:id/',maintenanceInventory.getAllById)
routes.put('/api/maintenanceInventory/:id/',maintenanceInventory.update)
routes.delete('/api/maintenanceInventory/:id/',maintenanceInventory.delete)


export default routes