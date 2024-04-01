import * as yup from 'yup';

export const validacionesCalidadJuridica = (calidadJuridica) => {
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
  