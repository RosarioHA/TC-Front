import * as yup from 'yup';

// Expresiones regulares
const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
const nombreRegex = /^[A-Za-záéíóúüÜñÑ\s']+$/;
const nombreCompetenciaRegex = /^[a-zA-Z0-9\s]+$/;


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

export const esquemaCreacionCompetencia = yup.object().shape({
    nombre: yup
    .string()
    .required('El nombre de la competencia es obligatorio')
    .matches(nombreCompetenciaRegex, 'Formato de nombre inválido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(30, 'El nombre no debe exceder los 30 caracteres'),
    regiones: yup.array().min(1, 'Debes seleccionar al menos una región'),
    sectores: yup.array().min(1, 'Debes seleccionar al menos un sector'),
    origen: yup.string().required('El origen de la competencia es obligatorio'),
    ambito_competencia: yup.number().integer().required('El ámbito de la competencia es obligatorio'),
    plazo_formulario_sectorial: yup
    .number()
    .required('El plazo para el formulario sectorial es obligatorio')
    .integer('El plazo debe ser un número entero')
    .typeError('El plazo debe ser un número válido')
    .positive('El plazo debe ser un número positivo')
    .min(15, 'El plazo mínimo es de 15 días.')
    .max(30, 'El plazo máximo es de 30 días.'),
    plazo_formulario_gore: yup
    .number()
    .required('El plazo para el formulario GORE es obligatorio')
    .integer('El plazo debe ser un número entero')
    .typeError('El plazo debe ser un número válido')
    .positive('El plazo debe ser un número positivo')
    .min(15, 'El plazo mínimo es de 15 días.')
    .max(30, 'El plazo máximo es de 30 días.'),
  });