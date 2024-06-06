import * as yup from 'yup';

export const construirEsquemaValidacion = (plataformasySoftwares, limite_caracteres ) => {
  let schemaFields = {};

  plataformasySoftwares.forEach(plataforma => {
    const id = plataforma.id; // Asumiendo que cada plataforma tiene un ID único

    // Validación para nombre_plataforma
    schemaFields[`nombre_plataforma_${id}`] = yup
      .string()
      .required('El nombre es obligatorio')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(500, 'El nombre no debe exceder los 500 caracteres');

    // Validación para descripción técnica
    schemaFields[`descripcion_tecnica_${id}`] = yup
      .string()
      .required('La descripción técnica es obligatoria')
      .min(3, 'La descripción técnica debe tener al menos 3 caracteres')
      .max(limite_caracteres, `La descripción técnica no debe exceder los ${limite_caracteres} caracteres`);

    // Validación para costo de adquisición
    schemaFields[`costo_adquisicion_${id}`] = yup
      .number()
      .typeError('El costo de adquisición debe ser un número')
      .positive('El costo de adquisición debe ser un número positivo')
      .required('El costo de adquisición es obligatorio');

    // Validación para costo de mantención anual
    schemaFields[`costo_mantencion_anual_${id}`] = yup
      .number()
      .typeError('El costo de mantención anual debe ser un número')
      .positive('El costo de mantención anual debe ser un número positivo')
      .required('El costo de mantención anual es obligatorio');

    // Validación para descripción de costos
    schemaFields[`descripcion_costos_${id}`] = yup
      .string()
      .required('La descripción de costos es obligatoria')
      .min(3, 'La descripción de costos debe tener al menos 3 caracteres')
      .max(limite_caracteres, `La descripción de costos no debe exceder los ${limite_caracteres} caracteres`);

    // Validación para función de la plataforma o software
    schemaFields[`funcion_plataforma_${id}`] = yup
      .string()
      .required('La descripción de la función de la plataforma o software es obligatoria')
      .min(3, 'La descripción de la función de la plataforma o software debe tener al menos 3 caracteres')
      .max(limite_caracteres, `La descripción de la función de la plataforma o software no debe exceder los ${limite_caracteres} caracteres`);
    
    
    // Por ejemplo, un campo booleano para capacitación requerida:
    schemaFields[`capacitacion_plataforma_${id}`] = yup
      .boolean()
      .required('Debe indicar una opción');

    // Validación para etapas (no requerido)
    schemaFields[`etapas_uso_${id}`] = yup
      .array()
      .of(yup.string())
      .nullable();


    // Y así sucesivamente para cada tipo de campo y validación que necesites.
  });


  return yup.object().shape(schemaFields);
};
