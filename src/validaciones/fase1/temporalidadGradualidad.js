import * as yup from 'yup';

export const validacionTemporalidadGradualidad = yup.object().shape({
  grupos: yup.array().of(
    yup.object().shape({
      region: yup
        .array()
        .min(1, 'Debe seleccionar al menos una región')
        .required('La región es obligatoria'),
      temporalidad: yup
        .string()
        .required('La temporalidad es obligatoria'),
      anios: yup.number()
        .typeError('Debe ser un número')
        .positive('Debe ser un número positivo')
        .integer('Debe ser un número entero')
        .min(1, 'No puede ser 0')
        .nullable(false)
        .when('temporalidad', {
          is: 'Temporal',
          then: schema => schema.required('Año es requerido'),
          otherwise: schema => schema
        }),
      justificacion_temporalidad: yup
        .string()
        .required('La justificación de la temporalidad es obligatoria'),
      gradualidad_meses: yup.number()
        .required('Gradualidad en meses es obligatorio')
        .typeError('Gradualidad en meses debe ser un número')
        .positive('Gradualidad en meses debe ser un número positivo'),
      justificacion_gradualidad: yup
        .string()
        .required('La justificación de la gradualidad es obligatoria'),
    })
  ),
});

