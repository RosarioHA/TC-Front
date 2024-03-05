import * as yup from 'yup'; 

export const DescripcionEtapas = yup.object().shape({
  nombre_etapa: yup.string().required('El nombre de la etapa es obligatorio'),
  descripcion_etapa: yup.string().required('La descripción de la etapa es obligatoria'),
})