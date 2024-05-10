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
        .nullable(true) // Esto permite que el valor sea null, útil si el costo puede estar vacío
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
        .required('El subtítulo es requerido');

      schemaFields[`renta_bruta_${persona.id}`] = yup
        .number()
        .typeError('La renta bruta debe ser un número')
        .min(0, 'El costo no debe ser un número negativo')
        .nullable(true)
        .required('La renta bruta es requerida');

        schemaFields[`grado_${persona.id}`] = yup
          .number()
          .transform((value, originalValue) => {
            // Asegurarse de que originalValue sea una cadena antes de llamar a trim.
            if (typeof originalValue === 'string') {
              return originalValue.trim() === '' ? null : value;
            }
            return value;
          })
          .min(0, 'El grado no debe ser un número negativo')
          .nullable(true)
          .typeError('El grado debe ser un número');
      
      
      
    });

    schemaFields['descripcion_funciones_personal_directo'] = yup
      .string()
      .required('La descripción de funciones es requerida');
  });

  return yup.object().shape(schemaFields);
};



