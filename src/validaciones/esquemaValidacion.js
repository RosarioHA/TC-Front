import * as yup from 'yup';

const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
const nombreRegex = /^[A-Za-záéíóúüÜñÑ\s']+$/;

export const esquemaCreacionUsuario = yup.object().shape({
  rut: yup.string().matches(rutRegex, 'Formato de RUT inválido').required('El RUT es obligatorio'),
  nombre: yup
    .string()
    .matches(nombreRegex, 'Formato de nombre inválido')
    .required('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(30, 'El nombre no debe exceder los 30 caracteres'),
  email: yup.string().email('Formato de correo electrónico inválido').required('El correo electrónico es obligatorio'),
  perfil: yup.string().required('El perfil es obligatorio'),
  estado: yup.string().required('Debes seleccionar un estado para el usuario'),
});