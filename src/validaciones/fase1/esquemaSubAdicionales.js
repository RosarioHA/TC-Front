import * as yup from 'yup';

export const esquemaSubAdicionales = (modeloCostos = []) => {
  let schemaFields = {};

  modeloCostos.forEach(({ id }) => { // Asegurando que destructuramos el objeto correctamente

    // Validación para subtítulo como valor único requerido
    schemaFields[`subtitulo_${id}`] = yup
      .string()
      .required('El subtítulo es requerido');

    // Validación para ítems como valor único requerido
    schemaFields[`item_subtitulo_${id}`] = yup
      .string()
      .required('Un ítem es requerido');
    // Validación para Total Anual, ajustada para permitir nulls
    schemaFields[`total_anual_gore_${id}`] = yup
      .number()
      .nullable(true) // Permite explícitamente valores null
      .typeError('El Total Anual debe ser un número')
      .positive('El Total Anual debe ser un número positivo')
      .required('El Total Anual es obligatorio');

    // Validación para opcíon Transversal, ajustada para campos booleanos que pueden ser null
    schemaFields[`es_transitorio_${id}`] = yup
      .boolean()
      .nullable(true) // Aunque es poco común para booleanos, permite explícitamente valores null si es necesario
      .required('Debe indicar una opción');

    // Validación para descripción
    schemaFields[`descripcion_${id}`] = yup
      .string()
      .required('La descripción es obligatoria')
      .min(3, 'La descripción debe tener al menos 3 caracteres')
      .max(500, 'La descripción no debe exceder los 500 caracteres');
  });

  return yup.object().shape(schemaFields);
};
