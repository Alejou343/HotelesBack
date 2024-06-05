
export async function generalValidations(fieldList={}, ObjectInstance) {
    async function fieldExists(model, fieldName, value) {
        const condition = {};
        condition[fieldName] = value;
        const existingField = await model.findOne({ where: condition });
        return !!existingField;
    }

    const errors = [];

    // Verificar y validar todos los campos en fieldList
    for (const [field, value] of Object.entries(fieldList)) {
        if (value === null || value === undefined || value === '') {
            errors.push(`Field ${field} is required`);
        } else if (field !=='role' && await fieldExists(ObjectInstance, field, value)) {
            errors.push(`${field} already exists`);
        }
    }
    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
}


