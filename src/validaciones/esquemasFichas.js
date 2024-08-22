import * as yup from 'yup';

export const validacionFichaInformaticos = yup.object({
  fichas: yup.array().of(
    yup.object().shape({
      nombre_plataforma: yup.string()
        .required('El nombre de la plataforma es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(500, 'El nombre no debe exceder los 30 caracteres'),
      descripcion_tecnica: yup.string()
        .required('La descripción técnica es requerida')
        .min(20, 'La descripción  debe tener al menos 20 caracteres')
        .max(500, 'La descripción  no debe exceder los 30 caracteres'),
      costo: yup.number()
        .typeError('El costo debe ser un número')
        .min(1, 'El costo no puede ser 0')
        .nullable(true)
        .required('El costo es obligatorio'),
      funcion: yup.string()
        .required('La función es requerida')
        .min(20, 'La descripción  debe tener al menos 20 caracteres')
        .max(500, 'La descripción  no debe exceder los 30 caracteres'),
    })
  )
});

export const validacionInfraestructura = yup.object({
  fichas: yup.array().of(
    yup.object().shape({
      cantidad: yup.number()
        .typeError('Los datos ingresados deben ser un número')
        .required('La cantidad es requerida')
        .min(1, 'La cantidad  no puede ser 0')
        .positive('La cantidad debe ser un número positivo')
        .integer('La cantidad debe ser un número entero'),
      costo_total: yup.number()
        .typeError('Los datos ingresados deben ser un número')
        .required('El costo total es requerido')
        .min(1, 'El costo total no puede ser 0')
        .positive('El costo total debe ser un número positivo')
        .integer('El costo total debe ser un número entero'),
      fundamentacion: yup.string()
        .required('La fundamentación es requerida')
        .min(20, 'La Fundamentacion debe tener al menos 20 caracteres')
        .max(300, 'La Fundamentacion no debe exceder los 300 caracteres'),
    })
  )
});