import * as yup from 'yup';


export const esquemaEditarPaso2_4 = yup.object().shape({
    costo_adquisicion: yup
    .number()
    .typeError('El costo de adquisición debe ser un número entero')
    .integer('El costo de adquisición debe ser un número entero')
    .required('El costo de adquisición es obligatorio'),
  costo_mantencion_anual: yup
    .number()
    .typeError('El costo de mantención anual debe ser un número entero')
    .integer('El costo de mantención anual debe ser un número entero')
    .required('El costo de mantención anual es obligatorio'),
  });