import CleaningStaff from '../models/cleaningStaff.js';
import Room from '../models/room.js';
import RoomTime from '../models/roomTime.js';
import MaintenanceInventory from '../models/maintenanceInventory.js';
import OperationalRole from '../models/operationalRole.js';

export default class ServicePocki {
    constructor() {}

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

            let responseData = {};
            let currentTime = new Date();

            // Buscar la habitación
            const room = await Room.findOne({ where: { number: roomNumber } });
            if (!room) {
                throw new Error(`No se encontró habitación con número ${roomNumber}`);
            }

            let newCategory;

            switch (message.toLowerCase()) {
                case "check in":
                    newCategory = 'o';
                    break;
                case "check out":
                    newCategory = 'v/d';
                    break;
                case "clean/in":
                    newCategory = 'clean/in';
                    break;
                case "clean/out":
                    newCategory = 'p/s';
                    break;
                case "ROOM OK":
                    newCategory = 'v/c';
                    break;
                case "ooo":
                    newCategory = 'ooo';
                    break;
                case "rm":
                    newCategory = 'o';
                    break;
                case "s/o":
                    newCategory = 'v/d';
                    break;
                case "e/ch":
                    newCategory = 'v/d';
                    break;
                case "mt/in":
                    newCategory = 'mt/in';
                    break;
                case "mt/out":
                    newCategory = 'mt/out';
                    break;
                case "dep":
                    newCategory = 'dep';
                    break;
                case "call":
                    newCategory = 'call';
                    break;
                case "remo project":
                    newCategory = 'remo project';
                    break;
                default:
                    throw new Error('Mensaje inválido');
            }

            // Verificar si el rol actual puede enviar este mensaje
            if (!(await this.canSendWhatsAppMessage(staff.role, message))) {
                throw new Error(`El perfil "${staff.role}" no tiene permiso para enviar el mensaje "${message}"`);
            }

            // Obtener la categoría actual de la habitación
            const currentCategory = room.name_category_room;

            // Buscar el último registro de RoomTime para esta habitación y categoría
            let lastRoomTimeEntry = await RoomTime.findOne({
                where: {
                    roomNumber: room.number,
                    category: currentCategory,
                    profile: staff.fullName,
                    duration: null  // Duración no calculada
                },
                order: [['timestamp', 'DESC']]
            });

            // Calcular la duración desde el último cambio de estado
            let duration = null;
            if (lastRoomTimeEntry) {
                duration = Math.floor((currentTime - lastRoomTimeEntry.timestamp) / 1000); // Duración en segundos
            }

            // Crear un nuevo registro si se cambia la categoría
            if (currentCategory !== newCategory) {
                // Crear un nuevo registro en RoomTime
                await RoomTime.create({
                    hotelName: room.hotelName,
                    roomNumber: room.number,
                    category: newCategory,
                    profile: staff.fullName,
                    timestamp: currentTime,
                    duration: null  // Nuevo registro, duración aún no calculada
                });

                // Actualizar la categoría de la habitación
                await room.update({ name_category_room: newCategory });
                console.log(`Categoría de habitación actualizada a "${newCategory}"`);
            }

            responseData = {
                hotelName: room.hotelName,
                roomNumber: room.number,
                currentCategory: newCategory,
                profile: staff.role,
                time: duration ? `${Math.floor(duration / 60)} minutos` : null
            };

            console.log('Mensaje de WhatsApp manejado exitosamente');
            return responseData;

        } catch (error) {
            throw error;
        }
    }

    async findStaffByRole(profileIdentification) {
        // Intentar buscar en cada tabla según corresponda
        let staff = await CleaningStaff.findOne({ where: { code_role: profileIdentification } });
        if (staff) return staff;

        staff = await MaintenanceInventory.findOne({ where: { code_role: profileIdentification } });
        if (staff) return staff;

        staff = await OperationalRole.findOne({ where: { code_role: profileIdentification } });
        return staff;
    }

    async canSendWhatsAppMessage(role, message) {
        // Obtener la lista de roles permitidos para cada tipo de mensaje
        let allowedRoles = [];

        // Verificar en las tablas correspondientes según el tipo de mensaje
        switch (message.toLowerCase()) {
            case "clean/in":
            case "clean/out":
            case "ooo":
            case "p/s":
            case "v/c":
            case "o":
            case "v/d":
            case "rm":
            case "s/o":
            case "e/ch":
            case "mt/in":
            case "mt/out":
            case "dep":
            case "call":
            case "remo project":
                allowedRoles = await this.getAllowedRolesForMessage(message);
                break;
            default:
                return false; // Si el mensaje no está definido, no permitir enviarlo
        }

        // Verificar si el rol actual del personal está en la lista de roles permitidos
        return allowedRoles.some(r => r.role === role);
    }

    async getAllowedRolesForMessage(message) {
        // Obtener los roles permitidos para cada tipo de mensaje
        let allowedRoles = [];

        switch (message.toLowerCase()) {
            case "clean/in":
            case "clean/out":
                allowedRoles = await CleaningStaff.findAll({ where: { allowed_messages: message } });
                break;
            case "ooo":
                allowedRoles = await OperationalRole.findAll({ where: { allowed_messages: message } });
                break;
            case "p/s":
                allowedRoles = await OperationalRole.findAll({ where: { allowed_messages: message } });
                break;
            case "v/c":
                allowedRoles = await OperationalRole.findAll({ where: { allowed_messages: message } });
                break;
            case "o":
                allowedRoles = await OperationalRole.findAll({ where: { allowed_messages: message } });
                break;
            case "v/d":
                allowedRoles = await OperationalRole.findAll({ where: { allowed_messages: message } });
                break;
            case "rm":
                allowedRoles = await OperationalRole.findAll({ where: { allowed_messages: message } });
                break;
            case "s/o":
                allowedRoles = await OperationalRole.findAll({ where: { allowed_messages: message } });
                break;
            case "e/ch":
                allowedRoles = await OperationalRole.findAll({ where: { allowed_messages: message } });
                break;
            case "mt/in":
                allowedRoles = await MaintenanceInventory.findAll({ where: { allowed_messages: message } });
                break;
            case "mt/out":
                allowedRoles = await MaintenanceInventory.findAll({ where: { allowed_messages: message } });
                break;
            case "dep":
                allowedRoles = await OperationalRole.findAll({ where: { allowed_messages: message } });
                break;
            case "call":
                allowedRoles = await MaintenanceInventory.findAll({ where: { allowed_messages: message } });
                break;
            case "remo project":
                allowedRoles = await OperationalRole.findAll({ where: { allowed_messages: message } });
                break;
            default:
                break;
        }

        return allowedRoles;
    }

    async getAll() {
        try {
            let roomTimes = await RoomTime.findAll({
                include: [
                    { model: Room, attributes: ['name_category_room'] },
                    { model: CleaningStaff, attributes: ['fullName'] }
                ]
            });

            let responseData = roomTimes.map(rt => {
                const durationInSeconds = Math.floor((new Date() - rt.timestamp) / 1000);
                const durationInMinutes = Math.floor(durationInSeconds / 60);
                const time = durationInMinutes > 0 ? `${durationInMinutes} minutos` : `${durationInSeconds} segundos`;
                return {
                    hotelName: rt.hotelName,
                    roomNumber: rt.roomNumber,
                    currentCategory: rt.Room.name_category_room,
                    profile: rt.profile,
                    time: time,
                    hkName: rt.CleaningStaff.fullName
                };
            });

            return {
                message: "Éxito",
                data: responseData
            };

        } catch (error) {
            throw new Error(`Error al obtener los tiempos de las habitaciones: ${error.message}`);
        }
    }
}
