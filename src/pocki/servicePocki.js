import CleaningStaff from '../models/cleaningStaff.js';
import Room from '../models/room.js';
import MaintenanceInventory from '../models/maintenanceInventory.js';
import OperationalRole from '../models/operationalRole.js';
import Assignment from '../models/assignments.js';
import sequelize from '../database/sequelize.js';
import AssignmentHk from '../models/assignmentHK.js';

export default class ServicePocki {
    constructor() { }

    async handleWhatsApp(profileIdentification, roomNumber, message) {
        try {
            let staff = await this.findStaffByRole(profileIdentification);
            if (!staff) {
                throw new Error('Identificación de perfil no válida');
            }

            console.log('Identificación de perfil:', profileIdentification);
            console.log('Número de habitación:', roomNumber);
            console.log('Mensaje original de WhatsApp:', message);
            console.log('Personal encontrado:', staff);

            /* if (staff.role.toLowerCase() === 'room control' && message.toLowerCase() === 'reporte') {
                return await this.generateRoomReport();
            } */

            if (staff.role.toLowerCase() === 'room control') {
                if (message.toLowerCase() === 'reporte') {
                    return await this.generateRoomReport();
                } else {
                    return await this.modifyRoomCategory(profileIdentification, roomNumber, message);
                }
            }

            if (staff.role.toLowerCase() === 'hk supervisor' && message.toLowerCase() === 'asignar') {
                await this.autoAssignSupervisors();
                console.log('Supervisores asignados automáticamente');
                return;
            }

            if (!roomNumber) {
                throw new Error('Debe proporcionar un número de habitación.');
            }

            const room = await Room.findOne({ where: { number: roomNumber } });
            if (!room) {
                throw new Error(`No se encontró habitación con número ${roomNumber}`);
            }

            let newCategory;
            let status_k;
            let alertMessage;
            let supervisorNumber;

            switch (staff.role.toLowerCase()) {
                case 'housekeeper':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getHouseKeeperActions(message, room));
                    break;
                case 'houseman':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getHouseManActions(message, room));
                    break;
                case 'maintenance tech':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getMaintenanceTechActions(message, room));
                    break;
                case 'painter':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getPainterActions(message, room));
                    break;
                case 'remodeling official':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getRemodelingOfficialActions(message, room));
                    break;
                case 'hk supervisor':
                case 'hm supervisor':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getSupervisor(message, room));
                    break;
                case 'quality control':
                case 'building manager':
                case 'assistant manager':
                case 'operation manager':
                case 'general manager':
                case 'resort manager':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getOperationalCore(message, room));
                    break;
                default:
                    throw new Error(`Rol no reconocido: ${staff.role}`);
            }

            if (!newCategory) {
                throw new Error(`Mensaje inválido para el rol ${staff.role}`);
            }

            await this.updateRoomCategoryAndStatus(room, newCategory, profileIdentification, status_k);

            if (alertMessage && supervisorNumber) {
                await this.sendAlertToSupervisor(supervisorNumber, alertMessage);
            }

            console.log('Actualización de categoría de habitación realizada con éxito');
            console.log('Nueva categoría:', newCategory);

            // Para obtener las asignaciones
            const assignments = await this.getAssignments();
            console.log(assignments);

        } catch (error) {
            console.error('Error manejando mensaje de WhatsApp:', error);
            throw error;
        }
    }

    

    async autoAssignHouseKeeper(roomNumber) {
        const room = await Room.findOne({ where: { number: roomNumber } });
        if (!room) {
            throw new Error(`No se encontró habitación con número ${roomNumber}`);
        }
    
        if (room.name_category_room.toLowerCase() === 'v/d') {
            const availableHouseKeeper = await CleaningStaff.findOne({ where: { role: 'housekeeper', state: true } });
            if (!availableHouseKeeper) {
                throw new Error('Todas las HouseKeepers están ocupadas');
            }
            // Create a new assignment record
            await AssignmentHk.create({
                id_room: room.id_room,
                id_cleaningStaff: availableHouseKeeper.id_cleaningStaff,
                startDate: new Date()
            });
    
            // Mark HouseKeeper as occupied
            availableHouseKeeper.state = false;
            await availableHouseKeeper.save();
    
            return `La housekeeper ${availableHouseKeeper.code_role} ha sido asignada a la habitación ${roomNumber}`;
        } else if (room.name_category_room.toLowerCase() === 'v/c') {
            const currentAssignment = await AssignmentHk.findOne({
                where: {
                    id_room: room.id_room,
                    endDate: null
                },
                order: [['startDate', 'DESC']]
            });
    
            if (currentAssignment) {
                currentAssignment.endDate = new Date();
                await currentAssignment.save();
    
                const assignedHouseKeeper = await CleaningStaff.findByPk(currentAssignment.id_cleaningStaff);
                if (assignedHouseKeeper) {
                    assignedHouseKeeper.state = true;
                    await assignedHouseKeeper.save();
    
                    return `La housekeeper ${assignedHouseKeeper.code_role} ahora está disponible después de limpiar la habitación ${roomNumber}`;
                } else {
                    return `No se encontró housekeeper para la asignación actual en la habitación ${roomNumber}`;
                }
            } else {
                return `No se encontró asignación actual para la habitación ${roomNumber}`;
            }
        } else {
            return `La categoría de la habitación ${room.name_category_room} para la habitación ${roomNumber} no requiere asignación de housekeeper`;
        }
    }
    
    


    async getWorkerAssignments(workerCode) {
        const worker = await CleaningStaff.findOne({ where: { code_role: workerCode } });
        if (!worker) {
            throw new Error(`No se encontró trabajador con código ${workerCode}`);
        }

        const assignmentsHk = await AssignmentHk.findAll({
            where: { id_cleaningStaff: worker.id_cleaningStaff },
            include: [
                {
                    model: Room,
                    attributes: ['hotelName', 'number']
                }
            ]
        });

        const formattedAssignments = assignmentsHk.map(assignment => ({
            hotel: assignment.Room.hotelName,
            room: assignment.Room.number,
            startDate: assignment.startDate.toISOString().split('T')[0],
            endDate: assignment.endDate ? assignment.endDate.toISOString().split('T')[0] : 'En progreso'
        }));

        return {
            code_role: workerCode,
            assignments: formattedAssignments
        };
    }

    async generateRoomReport() {
        try {
            const rooms = await Room.findAll();
            let report = 'Reporte de habitaciones:\n';
            rooms.forEach(room => {
                report += `Habitación ${room.number}: ${room.name_category_room}, Estado: ${room.state}\n`;
            });
            return report;
        } catch (error) {
            console.error('Error generando reporte de habitaciones:', error);
            throw error;
        }
    }

    async modifyRoomCategory(profileIdentification, roomNumber, message) {
        try {
            const room = await Room.findOne({ where: { number: roomNumber } });
            if (!room) {
                throw new Error(`No se encontró habitación con número ${roomNumber}`);
            }

            let newCategory;
            switch (message.toLowerCase()) {
                case 's/o':
                    newCategory = 'v/c';
                    break;
                case 'r/m':
                    newCategory = 'o';
                    break;
                case 'v/d':
                    newCategory = 'v/d';
                    break;
                case 'v/c':
                    newCategory = 'v/c';
                    break;
                default:
                    throw new Error('Acción no válida para el perfil "room control"');
            }

            await this.updateRoomCategoryAndStatus(room, newCategory, profileIdentification, room.state);
            return `La categoría de la habitación ${roomNumber} ha sido actualizada a ${newCategory}`;
        } catch (error) {
            console.error('Error modificando la categoría de la habitación:', error);
            throw error;
        }
    }

    async findStaffByRole(profileIdentification) {
        try {
            let staff = await CleaningStaff.findOne({ where: { code_role: profileIdentification } });
            if (staff) {
                console.log('CleaningStaff encontrado:', staff);
                return staff;
            }

            staff = await MaintenanceInventory.findOne({ where: { code_role: profileIdentification } });
            if (staff) {
                console.log('MaintenanceInventory encontrado:', staff);
                return staff;
            }

            staff = await OperationalRole.findOne({ where: { code_role: profileIdentification } });
            if (staff) {
                console.log('OperationalRole encontrado:', staff);
                return staff;
            }

            console.log('No se encontró el personal en ninguna tabla para el perfil:', profileIdentification);
            return null;
        } catch (error) {
            console.error('Error buscando el personal por rol:', error);
            throw error;
        }
    }

    async updateRoomCategoryAndStatus(room, newCategory, profileIdentification, status_k) {
        const transaction = await sequelize.transaction();
        try {
            console.log('Iniciando transacción para actualizar categoría y estado de la habitación...');

            const [updatedCleaningStaff] = await CleaningStaff.update(
                { state: status_k },
                { where: { code_role: profileIdentification }, transaction }
            );
            console.log('CleaningStaff actualizado:', updatedCleaningStaff);

            const [updatedMaintenanceInventory] = await MaintenanceInventory.update(
                { state: status_k },
                { where: { code_role: profileIdentification }, transaction }
            );
            console.log('MaintenanceInventory actualizado:', updatedMaintenanceInventory);

            const [updatedOperationalRole] = await OperationalRole.update(
                { state: status_k },
                { where: { code_role: profileIdentification }, transaction }
            );
            console.log('OperationalRole actualizado:', updatedOperationalRole);

            if (updatedCleaningStaff === 0 && updatedMaintenanceInventory === 0 && updatedOperationalRole === 0) {
                throw new Error('No se pudo actualizar el usuario en ninguna tabla');
            }

            room.name_category_room = newCategory;
            room.state = status_k;
            await room.save({ transaction });

            await transaction.commit();
            console.log(`Categoría de habitación actualizada a "${newCategory}" y estado a ${status_k}`);
        } catch (error) {
            await transaction.rollback();
            console.error('Error durante la actualización de categoría y estado:', error);
            throw error;
        }
    }

    async sendAlertToSupervisor(supervisorNumber, message) {
        console.log(`Alerta enviada al número ${supervisorNumber}: ${message}`);
    }

    async autoAssignSupervisors() {
        const transaction = await sequelize.transaction();
        try {
            const hkSupervisors = await CleaningStaff.findAll({ where: { role: 'hk supervisor' }, transaction });
            const hmSupervisors = await CleaningStaff.findAll({ where: { role: 'hm supervisor' }, transaction });
            const mtSupervisors = await MaintenanceInventory.findAll({ where: { role: 'mt supervisor' }, transaction });

            // Asignar housekeepers a hk supervisors
            await this.assignWorkersToSupervisorsEqually(hkSupervisors, 'housekeeper', 'hk supervisor', transaction, 'CleaningStaff');

            // Asignar housemen a hm supervisors
            await this.assignWorkersToSupervisorsEqually(hmSupervisors, 'houseman', 'hm supervisor', transaction, 'CleaningStaff');

            // Asignar painters a mt supervisors
            await this.assignWorkersToSupervisorsEqually(mtSupervisors, 'painter', 'mt supervisor', transaction, 'MaintenanceInventory');

            // Asignar maintenance techs a mt supervisors
            await this.assignWorkersToSupervisorsEqually(mtSupervisors, 'maintenance tech', 'mt supervisor', transaction, 'MaintenanceInventory');

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.error('Error en autoAssignSupervisors:', error);
            throw error;
        }
    }

    async assignWorkersToSupervisorsEqually(supervisors, workerRole, supervisorRole, transaction, tableName) {
        const WorkerModel = tableName === 'CleaningStaff' ? CleaningStaff : MaintenanceInventory;
        const availableWorkers = await WorkerModel.findAll({ where: { role: workerRole, state: true }, transaction });

        if (supervisors.length === 0) {
            throw new Error(`No hay supervisores disponibles para asignar a ${workerRole}s`);
        }

        if (availableWorkers.length === 0) {
            console.log(`No hay ${workerRole}s disponibles para asignar.`);
            return;
        }

        let supervisorIndex = 0;
        for (const worker of availableWorkers) {
            const supervisor = supervisors[supervisorIndex];

            await Assignment.create({
                supervisor_id: supervisor.id_cleaningStaff,
                worker_id: worker.id_cleaningStaff,
                role: supervisorRole,
            }, { transaction });

            // worker.state = false; // Marcar al trabajador como asignado
            await worker.save({ transaction });

            supervisorIndex = (supervisorIndex + 1) % supervisors.length;
        }

        console.log(`Asignados ${workerRole}s a ${supervisorRole}s equitativamente`);
    }

    async getAssignments() {
        try {
            const assignments = await Assignment.findAll({
                include: [
                    { model: CleaningStaff, as: 'supervisor' },
                    { model: CleaningStaff, as: 'worker' },
                    { model: MaintenanceInventory, as: 'inventory' }
                ]
            });

            const assignmentsBySupervisor = {};

            assignments.forEach(assignment => {
                const supervisorId = assignment.supervisor_id;
                const supervisorRole = assignment.supervisor.role;

                if (!assignmentsBySupervisor[supervisorId]) {
                    assignmentsBySupervisor[supervisorId] = {
                        supervisor: {
                            id: supervisorId,
                            codeRole: assignment.supervisor.code_role,
                            phone: assignment.supervisor.phone,
                            role: supervisorRole
                        },
                        workers: [],
                        inventory: assignment.inventory ? {
                            id: assignment.inventory.id_maintenanceInventory,
                            name: assignment.inventory.fullName,
                            phone: assignment.inventory.phone,
                            email: assignment.inventory.email,
                            role: assignment.inventory.role,
                            code_role: assignment.inventory.code_role,
                            state: assignment.inventory.state
                        } : null
                    };
                }

                const workerDetails = {
                    id: assignment.worker_id,
                    codeRole: assignment.worker.code_role,
                    name: assignment.worker.fullName,
                    phone: assignment.worker.phone,
                    role: assignment.worker.role
                };

                assignmentsBySupervisor[supervisorId].workers.push(workerDetails);
            });

            const formattedAssignments = Object.values(assignmentsBySupervisor);

            return formattedAssignments;
        } catch (error) {
            console.error('Error al obtener las asignaciones:', error);
            throw error;
        }
    }


    getHouseKeeperActions(message, room) {
        switch (message.toLowerCase()) {
            case "clean/in":
                return { newCategory: 'clean/in', status_k: false };
            case "clean/out":
                return { newCategory: 'p/s', status_k: false, alertMessage: "La HK ha terminado la habitación, quedó en PS", supervisorNumber: room.hk_supervisor_number };
            case "ooo":
                return { newCategory: 'ooo', status_k: false, alertMessage: "La HK ha puesto la habitación en OOO", supervisorNumber: room.hk_supervisor_number };
            default:
                throw new Error('Mensaje no reconocido para HouseKeeper');
        }
    }

    getHouseManActions(message, room) {
        switch (message.toLowerCase()) {
            case "dep":
                return { newCategory: 'dep', status_k: false };
            case "confirmar":
                return { newCategory: 'v/c', status_k: true, alertMessage: "El HM ha finalizado la hbitacion queda  en v/c", supervisorNumber: room.hm_supervisor_number };
            case "ooo":
                return { newCategory: 'ooo', status_k: false, alertMessage: "ha pasado algo en la haboitacion , queda en OOO", supervisorNumber: room.hm_supervisor_number };
            default:
                throw new Error('Mensaje no reconocido para HouseMan');
        }
    }

    getMaintenanceTechActions(message, room) {
        switch (message.toLowerCase()) {
            case "mt/in":
                return { newCategory: 'mt/in', status_k: false };
            case "mt/out":
                return { newCategory: 'v/c', status_k: true, alertMessage: "El MT ha realizado una reparación", supervisorNumber: room.mt_supervisor_number };
            case "ooo":
                return { newCategory: 'ooo', status_k: false, alertMessage: "ha pasado algo en la haboitacion , queda en OOO", supervisorNumber: room.hm_supervisor_number };
            default:
                throw new Error('Mensaje no reconocido para Maintenance Tech');
        }
    }

    getPainterActions(message, room) {
        switch (message.toLowerCase()) {
            case "paint/in":
                return { newCategory: 'paint/in', status_k: false };
            case "paint/out":
                return { newCategory: 'v/c', status_k: true, alertMessage: "El pintor ha terminado el trabajo", supervisorNumber: room.mt_supervisor_number };
            default:
                throw new Error('Mensaje no reconocido para Painter');
        }
    }

    getRemodelingOfficialActions(message, room) {
        switch (message.toLowerCase()) {
            case "paint/in":
                return { newCategory: 'remo/in', status_k: false };
            case "remo/out":
                return { newCategory: 'v/c', status_k: true, alertMessage: "El oficial de remodelación ha terminado el trabajo", supervisorNumber: room.mt_supervisor_number };
            default:
                throw new Error('Mensaje no reconocido para Remodeling Official');
        }
    }

    getOperationalCore(message, room) {
        switch (message.toLowerCase()) {
            case "rm":
                return { newCategory: 'o', status_k: false };
            case "ooo":
                return { newCategory: 'ooo', status_k: false, alertMessage: "Inspección realizada y aprobada", supervisorNumber: room.operational_supervisor_number };
            case "v/c":
                return { newCategory: 'v/c', status_k: true, alertMessage: "Inspección realizada y aprobada", supervisorNumber: room.operational_supervisor_number };
            case "pm":
                return { newCategory: 'pm', status_k: false, alertMessage: "Inspección realizada y aprobada", supervisorNumber: room.operational_supervisor_number };
            default:
                throw new Error('Mensaje no reconocido para el núcleo operativo');
        }
    }

    getSupervisor(message, room) {
        switch (message.toLowerCase()) {
            case "v/c":
                return { newCategory: 'v/c', status_k: true };
            default:
                throw new Error('Mensaje no reconocido para el núcleo operativo');
        }
    }
}
