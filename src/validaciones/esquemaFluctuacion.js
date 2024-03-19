import * as yup from 'yup';


export const validacionFluctuacion = (modeloCostos) => {
  let schemaFields = {};

  modeloCostos.forEach(modelo => {
    modelo.costo_anio_gore.forEach(costoAnio => {
      // Construye un identificador único para cada campo de costo
      const campoCostoId = `costo_${costoAnio.id}`;

      // Agrega validación para el campo de costo específico
      schemaFields[campoCostoId] = yup
        .number()
        .typeError('El costo debe ser un número')
        .min(0, 'El costo no debe ser un número negativo')
        .nullable(true) // Esto permite que el valor sea null, útil si el costo puede estar vacío
        .required('El costo es obligatorio');
    });
  });

  return yup.object().shape(schemaFields);
};