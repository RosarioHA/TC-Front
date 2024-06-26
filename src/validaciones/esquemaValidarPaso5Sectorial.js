import * as yup from 'yup';

export const construirValidacionPaso5_1ab = (modeloCostos) => {
  let schemaFields = {};

  modeloCostos.forEach(modeloCostos => {
    const id = modeloCostos.id;

    // Validación para subtítulo como valor único requerido
    schemaFields[`subtitulo_${id}`] = yup
      .string()
      .required('El subtítulo es requerido');

    // Validación para ítems como valor único requerido
    schemaFields[`item_subtitulo_${id}`] = yup
      .string()
      .required('Un ítem es requerido');

    // Validación para Total Anual
    schemaFields[`total_anual_${id}`] = yup
      .number()
      .typeError('El Total Anual debe ser un número')
      .positive('El Total Anual debe ser un número positivo')
      .integer('El Total Anual debe ser un número entero')
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

export const construirValidacionPaso5_2evolucion = (modeloCostos) => {
  let schemaFields = {};

  modeloCostos.forEach(modelo => {
    modelo.costo_anio.forEach(costoAnio => {
      // Construye un identificador único para cada campo de costo
      const campoCostoId = `costo_${costoAnio.id}`;

      // Agrega validación para el campo de costo específico
      schemaFields[campoCostoId] = yup
        .number()
        .typeError('El costo debe ser un número')
        .integer('El costo debe ser un número entero sin decimales')
        .required('El costo es obligatorio');
    });
  });

  return yup.object().shape(schemaFields);
};

export const construirValidacionPaso5_Personal = (calidadJuridica) => {
  let schemaFields = {};

  calidadJuridica.forEach(modelo => {
    modelo.personas.forEach(persona => {

      // Agrega validación para el campo de costo específico
      schemaFields[`estamento_${persona.id}`] = yup
        .string()
        .required('El Estamento es requerido');

      schemaFields[`renta_bruta_${persona.id}`] = yup
        .number()
        .typeError('La Renta bruta debe ser un número')
        .positive('La Renta bruta debe ser un número positivo')
        .integer('La Renta bruta debe ser un número entero')
        .required('La Renta bruta es obligatoria');

      schemaFields[`numero_personas_${persona.id}`] = yup
        .number()
        .typeError('El N° de personas debe ser un número')
        .positive('El N° de personas debe ser un número positivo')
        .integer('El N° de personas debe ser un número entero')
        .required('El N° de personas es obligatorio');

      schemaFields[`grado_${persona.id}`] = yup
        .number()
        .typeError('El Grado debe ser un número')
        .positive('El Grado debe ser un número positivo')
        .integer('El Grado debe ser un número entero')
        .nullable(true)
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value));
    });
  });

  return yup.object().shape(schemaFields);
};



