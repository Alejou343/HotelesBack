import ServicePocki from '../pocki/servicePocki.js';

export default class Pocki {
    constructor() {}

    async handleWhatsApp(request, response) {
        let pocki = new ServicePocki();
        try {
            const { profileIdentification, roomNumber, message } = request.body;

            if (!profileIdentification || !message) {
                response.status(400).json({
                    message: 'Debe proporcionar profileIdentification y message en el cuerpo de la solicitud.'
                });
                return;
            }

            const trimmedMessage = message.trim().toLowerCase();

            // Encuentra el staff por profileIdentification para verificar el rol
            const staff = await pocki.findStaffByRole(profileIdentification);
            
            if (!staff) {
                response.status(400).json({
                    message: 'No se encontró el personal con el profileIdentification proporcionado.'
                });
                return;
            }

            if (trimmedMessage === 'reporte' || (staff.role.toLowerCase() === 'hk supervisor' && trimmedMessage === 'asignar') || (staff.role.toLowerCase() === 'hm supervisor' && trimmedMessage === 'asignar') || (staff.role.toLowerCase() === 'mt supervisor' && trimmedMessage === 'asignar')) {
                if (trimmedMessage === 'reporte') {
                    const report = await pocki.generateRoomReport();
                    response.status(200).json({
                        message: 'Reporte generado',
                        data: report
                    });
                    return;
                }
            }

            // Si el rol es hk supervisor y el mensaje es asignar, no requiere roomNumber
            if (staff.role.toLowerCase() === 'hk supervisor' && trimmedMessage === 'asignar') {
                await pocki.autoAssignSupervisors();
                response.status(200).json({
                    message: 'Supervisores HK asignados automáticamente'
                });
                return;
            }

            if (staff.role.toLowerCase() === 'hm supervisor' && trimmedMessage === 'asignar') {
                await pocki.autoAssignSupervisors();
                response.status(200).json({
                    message: 'Supervisores HM asignados automáticamente'
                });
                return;
            }

            if (staff.role.toLowerCase() === 'mt supervisor' && trimmedMessage === 'asignar') {
                await pocki.autoAssignSupervisors();
                response.status(200).json({
                    message: 'Supervisores MT asignados automáticamente'
                });
                return;
            }

            // Para otros roles y mensajes, roomNumber es obligatorio
            if (!roomNumber) {
                response.status(400).json({
                    message: 'Debe proporcionar profileIdentification, roomNumber y message en el cuerpo de la solicitud.'
                });
                return;
            }

            if (trimmedMessage === 'mostrar asignaciones') {
                const assignments = await pocki.showAssignments();
                response.status(200).json({
                    message: 'Asignaciones actuales',
                    data: assignments
                });
                return;
            }

            const result = await pocki.handleWhatsApp(profileIdentification, roomNumber, trimmedMessage);
            response.status(200).json({
                message: 'Éxito',
                data: result
            });
        } catch (error) {
            console.error(`Error en handleWhatsApp: ${error.message}`);
            response.status(400).json({
                message: `Error en handleWhatsApp: ${error.message}`,
                data: null
            });
        }
    }

    async getAll(request, response) {
        let pocki = new ServicePocki();
        try {
            const data = await pocki.getAll();

            response.status(200).json({
                message: 'Éxito',
                data: data
            });
        } catch (error) {
            console.error(`Error en getAll: ${error.message}`);
            response.status(400).json({
                message: `Error en getAll: ${error.message}`,
                data: null
            });
        }
    }

    async showAssignments(request, response) {
        let pocki = new ServicePocki();
        try {
            const assignments = await pocki.getAssignments();
            response.status(200).json({
                message: 'Asignaciones actuales',
                data: assignments
            });
        } catch (error) {
            console.error(`Error en showAssignments: ${error.message}`);
            response.status(400).json({
                message: `Error en showAssignments: ${error.message}`,
                data: null
            });
        }
    }

    async getWorkerAssignments(request, response) {
        let pocki = new ServicePocki();
        try {
            const { workerCode } = request.query;
    
            if (!workerCode) {
                response.status(400).json({
                    message: 'Debe proporcionar el código del trabajador.'
                });
                return;
            }
    
            const assignments = await pocki.getWorkerAssignments(workerCode);
            response.status(200).json({
                message: 'Asignaciones del trabajador obtenidas con éxito.',
                data: assignments
            });
        } catch (error) {
            console.error(`Error en getWorkerAssignments: ${error.message}`);
            response.status(400).json({
                message: `Error en getWorkerAssignments: ${error.message}`,
                data: null
            });
        }
    }
    

    async autoAssignHouseKeeper(request, response) {
        try {
            const { roomNumber } = request.body;
            let pocki = new ServicePocki();
            const answer = await pocki.autoAssignHouseKeeper(roomNumber);
            response.status(200).json({
                message: answer
            });
        } catch (error) {
            console.error(`Error en autoAssignHouseKeeper: ${error.message}`);
            response.status(400).json({
                message: `Error en autoAssignHouseKeeper: ${error.message}`
            });
        }
    }
    
}
