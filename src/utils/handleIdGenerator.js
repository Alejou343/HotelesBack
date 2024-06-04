export async function generateCustomId(prefix, Model, idColumnName, roleColumnName, roleValue) {
    try {
        // Obtener el máximo ID solo para el rol específico
        let maxId = await Model.max(idColumnName, { where: { [roleColumnName]: roleValue } });
        let nextId = 1;
        if (maxId) {
            nextId = parseInt(maxId.split('-')[1]) + 1;
        }
        return prefix + '-' + String(nextId).padStart(3, '0');
    } catch (error) {
        console.error('Error al generar el ID personalizado:', error);
        throw error;
    }
}

