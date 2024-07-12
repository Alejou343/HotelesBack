import ServicePocki from '../pocki/servicePocki.js';

export default class Pocki {
    constructor() {}

    async handleWhatsApp(request, response) {
        let pocki = new ServicePocki();
        try {
            const { profileIdentification, roomNumber, message } = request.body;

            if (!roomNumber || !profileIdentification || !message) {
                response.status(400).json({
                    message: 'Debe proporcionar profileIdentification, roomNumber y message en el cuerpo de la solicitud.'
                });
                return;
            }

            const trimmedMessage = message.trim().toLowerCase();

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
}

