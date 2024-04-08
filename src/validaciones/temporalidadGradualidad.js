import * as yup from 'yup';

export const validacionTemporalidadGradualidad = yup.object({
  grupos: yup.array().of(
    yup.object().shape({
      region: yup.array().min(1, 'Debes seleccionar al menos una región'),
      temporalidad: yup.array().min(1, 'Debes seleccionar al menos una opción '),
      descripcion_tecnica: yup.string()
        .required('La descripción técnica es requerida')
        .min(20, 'La descripción  debe tener al menos 20 caracteres')
        .max(500, 'La descripción  no debe exceder los 30 caracteres'),

      gradualidad_meses: yup.number()
        .typeError('El mes debe ser un número')
        .min(0, 'El mes  no debe ser un número negativo')
        .nullable(true)
        .required('El mes es obligatorio'),
      justificacion_temporalidad: yup.string()
        .required('La justificación es requerida')
        .min(20, 'La justificación debe tener al menos 20 caracteres')
        .max(500, 'La justificación no debe exceder los 30 caracteres'),


      justificacion_gradualidad: yup.string()
        .required('La justificación es requerida')
        .min(20, 'La justificación debe tener al menos 20 caracteres')
        .max(500, 'La justificación no debe exceder los 30 caracteres'),
    })
  )
});