import * as yup from 'yup';

const unidadIntervinienteSchema = yup.object().shape({
  label: yup.string().required('La etiqueta de la unidad es obligatoria'),
  value: yup.string().required('El valor de la unidad es obligatorio')
});

const procedimientoSchema = yup.lazy(() => yup.object().shape({
  id: yup.number().required('El ID del procedimiento es obligatorio'),
  etapa: yup.number().required('El ID de la etapa es obligatorio'),
  descripcion_procedimiento: yup.string().required('La descripción del procedimiento es obligatoria'),
  unidades_intervinientes: yup.array(yup.number()).required('Las unidades intervinientes son obligatorias'),
  unidades_intervinientes_label_value: yup.array(unidadIntervinienteSchema).required('Las etiquetas y valores de las unidades intervinientes son obligatorios')
}));

const etapaSchema = yup.object().shape({
  id: yup.number().required('El ID de la etapa es obligatorio'),
  nombre_etapa: yup.string().required('El nombre de la etapa es obligatorio'),
  descripcion_etapa: yup.string().required('La descripción de la etapa es obligatoria'),
  procedimientos: yup.array(procedimientoSchema).optional().when('procedimientos', {
    is: procedimientos => procedimientos && procedimientos.length > 0,
    then: yup.array(procedimientoSchema).required('Los procedimientos son obligatorios cuando están presentes')
  })
});

export const descripcionEtapas = yup.object().shape({
  etapas: yup.array(etapaSchema).required('Las etapas son obligatorias')
});
