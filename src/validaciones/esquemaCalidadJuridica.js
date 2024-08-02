import * as yup from 'yup';

export const validacionesCalidadJuridica = 
yup.object({
  personal: yup.array().of(
    yup.object().shape({
      estamento: yup.string()
        .required('El estamento es requerido'),
      renta_bruta: yup.number()
        .typeError('La renta bruta debe ser un número')
        .min(0, 'El costo no debe ser un número negativo')
        .nullable(true)
        .required('La renta bruta es requerida'),
      grado: yup.number()
        .nullable(true)
        .typeError('El grado debe ser un número')
        .min(1, 'El grado debe ser igual o mayor a 1 ')
        .max(25, 'EL grado  no debe exceder al numero 25'),
      numero_personas_gore: yup.number()
      .nullable(true)
      .typeError('Debe ser un número')
      .min(1, 'Debe ser igual o mayor a 1 ')
    })
  )
});