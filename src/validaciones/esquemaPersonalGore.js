import * as yup from 'yup';


export const validacionesCalidadJuridica = yup.object({
  personal: yup.array().of(
    yup.object().shape({
      estamento: yup.string().required('El estamento es requerido'),
      renta_bruta: yup.number()
        .required('La renta bruta es requerida')
        .typeError('La renta bruta debe ser un número')
        .positive('La renta bruta debe ser un número positivo')
        .min(1, 'La renta bruta no puede ser 0')
        .nullable(true),
      grado: yup.number()
        .typeError('El grado debe ser un número')
        .positive('El grado debe ser un número positivo')
        .integer('El grado debe ser un número entero')
        .nullable(true)
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value)),
      numero_personas_gore: yup.number()
        .typeError('El N° de personas debe ser un número')
        .positive('El N° de personas debe ser un número positivo')
        .integer('El N° de personas debe ser un número entero')
        .min(1, 'El N° de personas no puede ser 0')
        .nullable(false)
        .when('title', {
          is: 'indirecto',
          then: schema => schema.required('El N° de personas es requerido'),
          otherwise: schema => schema
        })
    })
  )
});


export const validacionesPersonalInformado = yup.object({
  persona: yup.array().of(
    yup.object().shape({
      numero_personas_gore: yup.number()
        .typeError('El N° de personas debe ser un número')
        .positive('El N° de personas debe ser un número positivo')
        .integer('El N° de personas debe ser un número entero')
        .required('El N° de personas es obligatorio')
        .min(1, 'Debe ser igual o mayor a 1 '),
    })
  )
});


export const perfilesTecnicos = yup.object({
  descripcion_perfiles_tecnicos: yup
    .string()
    .required('La descripción es obligatoria')
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(300, 'La descripción no debe exceder los 300 caracteres'),
});