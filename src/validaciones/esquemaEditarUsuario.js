import * as yup from 'yup';

// Expresiones regulares
const nombreRegex = /^[A-Za-záéíóúüÜñÑ\s']+$/;

export const esquemaEdicionUsuarioNUEVO = yup.object().shape({
    nombre_completo: yup
      .string()
      .matches(nombreRegex, 'Formato de nombre inválido')
      .required('El nombre es obligatorio')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(30, 'El nombre no debe exceder los 30 caracteres'),
    email: yup.string().email('Formato de correo electrónico inválido').required('El correo electrónico es obligatorio'),
  });