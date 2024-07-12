import CleaningStaff from '../models/cleaningStaff.js';
import Room from '../models/room.js';
import MaintenanceInventory from '../models/maintenanceInventory.js';
import OperationalRole from '../models/operationalRole.js';
import sequelize from '../database/sequelize.js';

export default class ServicePocki {
    constructor() { }

    async handleWhatsApp(profileIdentification, roomNumber, message) {
        try {
            // Buscar el personal basado en el código de identificación
            let staff = await this.findStaffByRole(profileIdentification);
            if (!staff) {
                throw new Error('Identificación de perfil no válida');
            }
    
            console.log('Identificación de perfil:', profileIdentification);
            console.log('Número de habitación:', roomNumber);
            console.log('Mensaje original de WhatsApp:', message);
            console.log('Personal encontrado:', staff);
    
            // Buscar la habitación
            const room = await Room.findOne({ where: { number: roomNumber } });
            if (!room) {
                throw new Error(`No se encontró habitación con número ${roomNumber}`);
            }
    
            let newCategory;
            let status_k;
            let alertMessage;
            let supervisorNumber;
    
            // Definir mensajes permitidos y acciones asociadas para cada perfil
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
                case 'quality control':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getOperationalCore(message, room));
                    break;
                case 'building manager':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getOperationalCore(message, room));
                    break;
                case 'assistant manager':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getOperationalCore(message, room));
                    break;

                case 'operation manager':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getOperationalCore(message, room));
                    break;
                case 'general manager':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getOperationalCore(message, room));
                    break;
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
    
        } catch (error) {
            console.error('Error manejando mensaje de WhatsApp:', error);
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
    
            // Actualizar el estado del personal
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
    
            // Actualizar la categoría y el estado de la habitación
            room.name_category_room = newCategory;
            room.state = status_k; // Asegurarse de actualizar el estado
            await room.save({ transaction });
    
            await transaction.commit();
            console.log(`Categoría de habitación actualizada a "${newCategory}" y estado a ${status_k}`);
        } catch (error) {
            await transaction.rollback();
            console.error('Error durante la actualización de categoría y estado:', error);
            throw error; // Asegúrate de propagar el error para manejarlo correctamente en el lugar donde se llama este método
        }
    }
    
    async sendAlertToSupervisor(supervisorNumber, message) {
        // Lógica para enviar alerta al número del supervisor
        console.log(`Alerta enviada al número ${supervisorNumber}: ${message}`);
    }

    getHouseKeeperActions(message, room) {
        switch (message.toLowerCase()) {
            case "clean/in":
                return { newCategory: 'clean/in', status_k: false };
            case "clean/out":
                return { newCategory: 'p/s', status_k: false, alertMessage: "La HK ha terminado la habitación, quedó en PS", supervisorNumber: room.hk_supervisor_number };
            case "ooo":
                return { newCategory: 'ooo', status_k: false, alertMessage: "La HK ha encontrado algo en la habitación, queda en OOO", supervisorNumber: room.hk_supervisor_number };
            default:
                return {};
        }
    }
    
    getHouseManActions(message, room) {
        switch (message.toLowerCase()) {
            case "dep":
                return { newCategory: 'DEP', status_k: false };
            case "confirmar":
                return { newCategory: 'v/c', status_k: true, alertMessage: "El HM ha terminado la habitación, quedó en V/C", supervisorNumber: room.hm_supervisor_number };
            case "ooo":
                return { newCategory: 'ooo', status_k: false, alertMessage: "El HM ha pasado algo en la habitación, queda en OOO", supervisorNumber: room.hm_supervisor_number };
            default:
                return {};
        }
    }
    
    getMaintenanceTechActions(message, room) {
        switch (message.toLowerCase()) {
            case "mt/in":
                return { newCategory: 'MT/IN', status_k: false };
            case "mt/out":
                return { newCategory: 'v/c', status_k: true };
            case "ooo":
                return { newCategory: 'ooo', status_k: false, alertMessage: "El MT ha pasado algo en la habitación, queda en OOO", supervisorNumber: room.mt_supervisor_number };
            default:
                return {};
        }
    }
    
    getPainterActions(message, room) {
        switch (message.toLowerCase()) {
            case "paint/in":
                return { newCategory: 'PAINT/IN', status_k: false };
            case "paint/out":
                return { newCategory: 'v/c', status_k: true, alertMessage: "La habitación ya quedó", supervisorNumber: room.paint_supervisor_number };
            default:
                return {};
        }
    }
    
    getRemodelingOfficialActions(message, room) {
        switch (message.toLowerCase()) {
            case "remo/in":
                return { newCategory: 'REMO/IN', status_k: false };
            case "remo/out":
                return { newCategory: 'v/c', status_k: true, alertMessage: "La habitación ya quedó", supervisorNumber: room.remo_supervisor_number };
            default:
                return {};
        }
    }
    
    getOperationalCore(message, room) {
        switch (message.toLowerCase()) {
            case "rm":
                return { newCategory: 'o', status_k: false };
            case "ooo":
                return { newCategory: 'ooo', status_k: false, alertMessage: "La habitación ya quedó", supervisorNumber: room.remo_supervisor_number };
            case "v/c":
                return { newCategory: 'v/c', status_k: true, alertMessage: "La habitación ya quedó", supervisorNumber: room.remo_supervisor_number };
            case "pm":
                return { newCategory: 'PM', status_k: false, alertMessage: "La habitación ya quedó", supervisorNumber: room.remo_supervisor_number };
            default:
                return {};
        }
    }
    
    getSupervisorNumber(role) {
        // Lógica para obtener el número del supervisor basado en el rol
        // Puedes ajustar esto según tu estructura de datos
        switch (role) {
            case 'houseman':
                return 'HM Supervisor Number';
            case 'maintenance tech':
                return 'MT Supervisor Number';
            case 'painter':
                return 'MT Supervisor Number';
            case 'remodeling official':
                return 'Remo Supervisor Number';
            default:
                return 'General Supervisor Number';
        }
    }
}

