import * as yup from 'yup';

export const construirValidacionPaso5_1a = (costosDirectos) => {
  let schemaFields = {};

  costosDirectos.forEach(costoDirecto => {
    const id = costoDirecto.id;

    // Validación para subtítulo
    schemaFields[`subtitulo_${id}`] = yup
      .array()
      .of(yup.string())
      .min(1, 'Al menos un ítem es requerido')
      .nullable();
    
    // Validación para ítems
    schemaFields[`item_subtitulo_${id}`] = yup
      .array()
      .of(yup.string())
      .min(1, 'Al menos un ítem es requerido')
      .nullable();
      
    // Validación para etapa (no requerido)
    schemaFields[`etapa_${id}`] = yup
      .array()
      .of(yup.string())
      .nullable();

    // Validación para Total Anual
    schemaFields[`total_anual_${id}`] = yup
      .number()
      .typeError('El Total Anual debe ser un número')
      .positive('El Total Anual debe ser un número positivo')
      .required('El Total Anual es obligatorio');

    // Validación para opcíon Transversal:
    schemaFields[`es_transversal_${id}`] = yup
      .boolean()
      .required('Debe indicar una opción');

    // Validación para descripcion
    schemaFields[`descripcion_${id}`] = yup
      .string()
      .required('La descripción es obligatoria')
      .min(3, 'La descripción debe tener al menos 3 caracteres')
      .max(500, 'La descripción no debe exceder los 500 caracteres');
  });

  return yup.object().shape(schemaFields);
};
