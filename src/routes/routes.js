import express from 'express'
import OperationalRole from '../controllers/ControllerOperationalRole.js'
import MaintenanceInventory from '../controllers/ControllerMaintenanceInventory.js'
import CleaningStaff from '../controllers/ControllerCleaningStaff.js'
import Room from '../controllers/ControllerRoom.js'
import CategoryRoom from '../controllers/ControllerCategoryRoom.js'
import Pocki from '../pocki/controllerPocki.js'

let operationalRole=new OperationalRole()
let  maintenanceInventory= new MaintenanceInventory()
let cleaningStaff=new CleaningStaff()
let room=new Room()
let categoryRoom= new CategoryRoom()
let pocki=new Pocki()

let routes=express.Router()

//POCKI
routes.post('/api/pocki',pocki.handleWhatsApp)
routes.get('/api/pocki',pocki.getAll)

//ASIGNACIONES DE HOUSEKEEPERS
routes.post('/api/pocki/autoAssignHouseKeeper', pocki.autoAssignHouseKeeper);
routes.get('/api/pocki/getWorkerAssignments', pocki.getWorkerAssignments);


// Nuevas rutas para asignaciones
//routes.post('/api/pocki/assignRoles', pocki.assignRoles)
routes.get('/api/pocki/showAssignments', pocki.showAssignments)

//OPERATIONAL ROLE
routes.post('/api/operationalRoles',operationalRole.createOperationalRole);
routes.get('/api/operationalRoles',operationalRole.getAll);
routes.get('/api/operationalRoles/:id/',operationalRole.getAllById)
routes.put('/api/operationalRoles/:id/',operationalRole.update)
routes.delete('/api/operationalRoles/:id/',operationalRole.delete)

//MAINTENANCE INVENTORY
routes.post('/api/maintenanceInventories',maintenanceInventory.create);
routes.get('/api/maintenanceInventories',maintenanceInventory.getAll);
routes.get('/api/maintenanceInventories/:id/',maintenanceInventory.getAllById)
routes.put('/api/maintenanceInventories/:id/',maintenanceInventory.update)
routes.delete('/api/maintenanceInventories/:id/',maintenanceInventory.delete)


//CLEANING STAFF
routes.post('/api/cleaningStaffs',cleaningStaff.create);
routes.get('/api/cleaningStaffs',cleaningStaff.getAll);
routes.get('/api/cleaningStaffs/:id/',cleaningStaff.getAllById)
routes.put('/api/cleaningStaffs/:id/',cleaningStaff.update)
routes.delete('/api/cleaningStaffs/:id/',cleaningStaff.delete)


//ROOM
routes.post('/api/rooms',room.create);
routes.get('/api/rooms',room.getAll);
routes.get('/api/rooms/:id/',room.getAllById)
routes.put('/api/rooms/:id/',room.update)
routes.delete('/api/rooms/:id/',room.delete)

//CATEGORY ROOM
routes.post('/api/CategoryRoom',categoryRoom.create);
routes.get('/api/CategoryRooms',categoryRoom.getAll);
routes.get('/api/CategoryRoom/:id/',categoryRoom.getAllById)
routes.put('/api/CategoryRoom/:id/',categoryRoom.update)
routes.delete('/api/CategoryRooms/:id/',categoryRoom.delete)


export default routes