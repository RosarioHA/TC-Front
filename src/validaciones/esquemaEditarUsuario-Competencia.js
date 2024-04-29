import * as yup from 'yup';

// Expresiones regulares
const nombreRegex = /^[A-Za-záéíóúüÜñÑ\s']+$/;

export const esquemaEdicionUsuarios = yup.object().shape({
    nombre_completo: yup
      .string()
      .matches(nombreRegex, 'Formato de nombre inválido')
      .required('El nombre es obligatorio')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(30, 'El nombre no debe exceder los 30 caracteres'),
    email: yup.string().email('Formato de correo electrónico inválido').required('El correo electrónico es obligatorio'),
    perfil: yup.string().required('El perfil es obligatorio'),
  });

  export const esquemaEdicionCompetencias = yup.object().shape({
    nombre: yup.string().required('El nombre de la competencia es obligatorio'),
    regiones: yup.array().min(1, 'Debe seleccionar al menos una región'),
    sectores: yup.array().min(1, 'Debe seleccionar al menos un sector'),
    plazo_formulario_sectorial: yup.string().required('El plazo para el formulario sectorial es obligatorio'),
    plazo_formulario_gore: yup.string().required('El plazo para el formulario GORE es obligatorio'),
  });