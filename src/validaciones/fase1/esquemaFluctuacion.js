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
        .integer('El costo debe ser un número entero sin decimales')
        .required('El costo es obligatorio');
    });

    // Agrega validación para la descripción asociada a cada subtítulo
    const campoDescripcionId = `descripcion_${modelo.id}`;
    schemaFields[campoDescripcionId] = yup
      .string()
      .required('La descripción es obligatoria')
      .min(3, 'La descripción debe tener al menos 3 caracteres');
  });

  return yup.object().shape(schemaFields);
};
