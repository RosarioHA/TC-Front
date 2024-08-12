import * as yup from 'yup';

export const validacionCostosGore = (costosDirectos) => {
  const schemaFields = {};

  costosDirectos.forEach((costo) => {
    const id = costo.id;
    // Validación para Total Anual GORE
    schemaFields[`total_anual_gore-${id}`] = yup.number()
      .typeError('El Total Anual debe ser un número')
      .positive('El Total Anual debe ser un número positivo')
      .integer('El Total Anual debe ser un número entero')
      .required('El Total Anual es obligatorio');

    // Validación para Es Transitorio
    schemaFields[`es_transitorio-${id}`] = yup.boolean()
      .required('Debe indicar si es transitorio o no');

    // Validación para Descripción
    schemaFields[`descripcion-${id}`] = yup.string()
      .required('La descripción es obligatoria')
      .min(3, 'La descripción debe tener al menos 3 caracteres')
      .max(500, 'La descripción no debe exceder los 500 caracteres');
  });

  return yup.object().shape(schemaFields);
};
