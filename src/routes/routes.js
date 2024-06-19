import express from 'express'
import OperationalRole from '../controllers/ControllerOperationalRole.js'
import MaintenanceInventory from '../controllers/ControllerMaintenanceInventory.js'
import CleaningStaff from '../controllers/ControllerCleaningStaff.js'
import Room from '../controllers/ControllerRoom.js'

let operationalRole=new OperationalRole()
let  maintenanceInventory= new MaintenanceInventory()
let cleaningStaff=new CleaningStaff()
let room=new Room()

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


//CLEANING STAFF
routes.post('/api/cleaningStaff',cleaningStaff.create);
routes.get('/api/cleaningStaffs',cleaningStaff.getAll);
routes.get('/api/cleaningStaff:id/',cleaningStaff.getAllById)
routes.put('/api/cleaningStaff:id/',cleaningStaff.update)
routes.delete('/api/cleaningStaff:id/',cleaningStaff.delete)


//ROOM
routes.post('/api/room',room.create);
routes.get('/api/rooms',room.getAll);
routes.get('/api/room:id/',room.getAllById)
routes.put('/api/room:id/',room.update)
routes.delete('/api/room:id/',room.delete)

export default routes