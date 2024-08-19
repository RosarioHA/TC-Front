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
          is: 'indirecto', // If title is 'indirecto'
          then: schema => schema.required('El N° de personas es requerido'), // Required
          otherwise: schema => schema // Optional if not 'indirecto'
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
      utilizar_recurso: yup.boolean().required('Debe indicar una opción'),
    })
  )
});