import * as yup from 'yup';

export const esquemaOrganismoIntervinientes = (organismosIntervinientes) => {
  let schemaFields = {};

  organismosIntervinientes.forEach(organismo => {
    const id = organismo.id; 

    schemaFields[`nombre_ministerio_servicio_${id}`] = yup
      .string()
      .required('El nombre es obligatorio')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(300, 'El nombre no debe exceder los 300 caracteres');

    schemaFields[`descripcion_${id}`] = yup
      .string()
      .required('La descripción técnica es obligatoria')
      .min(3, 'La descripción técnica debe tener al menos 3 caracteres')
      .max(300, 'La descripción técnica no debe exceder los 300 caracteres');
  });

  return yup.object().shape(schemaFields);
};