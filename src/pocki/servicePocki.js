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
            switch (staff.role) {
                case 'housekeeper':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getHouseKeeperActions(message, room));
                    break;
                case 'houseman':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getHouseManActions(message, room));
                    break;
                case 'maintenace tech':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getMaintenanceTechActions(message, room));
                    break;
                case 'painter':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getPainterActions(message, room));
                    break;
                case 'remodeling official':
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getRemodelingOfficialActions(message, room));
                    break;
                default:
                    ({ newCategory, status_k, alertMessage, supervisorNumber } = this.getManagerActions(message, room, staff.role));
                    break;
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
            if (staff) return staff;

            staff = await MaintenanceInventory.findOne({ where: { code_role: profileIdentification } });
            if (staff) return staff;

            staff = await OperationalRole.findOne({ where: { code_role: profileIdentification } });
            return staff;
        } catch (error) {
            console.error('Error buscando el personal por rol:', error);
            throw error;
        }
    }

    async updateRoomCategoryAndStatus(room, newCategory, profileIdentification, status_k) {
        const transaction = await sequelize.transaction();
        try {
            // Actualizar el estado del personal
            const [updatedCleaningStaff] = await CleaningStaff.update(
                { state: status_k },
                { where: { code_role: profileIdentification }, transaction }
            );
    
            const [updatedMaintenanceInventory] = await MaintenanceInventory.update(
                { state: status_k },
                { where: { code_role: profileIdentification }, transaction }
            );
    
            const [updatedOperationalRole] = await OperationalRole.update(
                { state: status_k },
                { where: { code_role: profileIdentification }, transaction }
            );
    
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
            throw error;
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
                return { newCategory: 'v/c', status_k: true, alertMessage: "La habitación ya quedó", supervisorNumber: room.mt_supervisor_number };
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

    getManagerActions(message, room, role) {
        let alertMessage;
        let supervisorNumber;

        switch (message.toLowerCase()) {
            case "rm":
                return { newCategory: 'RM' };
            case "ooo":
                alertMessage = "Se ha detectado un incidente en la habitación, queda en OOO";
                supervisorNumber = this.getSupervisorNumber(role);
                return { newCategory: 'ooo', alertMessage, supervisorNumber };
            case "o":
                return { newCategory: 'o' };
            case "v/c":
                return { newCategory: 'V/C' };
            case "pm":
                alertMessage = "La habitación ha sido marcada como PM";
                supervisorNumber = this.getSupervisorNumber(role);
                return { newCategory: 'PM', alertMessage, supervisorNumber };
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
            case 'maintenace tech':
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

