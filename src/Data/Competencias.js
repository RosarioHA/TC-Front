
export const estado = [
{id:1, estado:'Finalizado'},
{id:2, estado:'En Estudio'},
{id:3, estado:'Pendiente'},
]

  // Lista de tus etapas
export  const stages = [
    {id:1,  etapa:"Inicio de transferencia de competencia"},
    {id:2,  etapa:"Levantamiento de antecedentes sectoriales"},
    {id:3, etapa:" Complemento y validación de DIPRES"},
    {id:4, etapa:"Levantamiento de antecedentes GORE"}, 
    {id:5, etapa:" Complemento y validación de DIPRES"},
  ];


  export const competencias = [
    {
      id: 1,
      nombre: 'Competencia 1',
      detalles: 'Detalles de la competencia 1',
      etapas: [
        { id: 1, etapa: 'Inicio de transferencia de competencia', estado: 'Finalizado'  , 
        subetapas: [
          { nombre: "Crear competencia", estado: "Finalizado" },
          { nombre: "Usuario sectorial vinculado a la competencia creada", estado: "Finalizado" },
        ], },
        { id: 2, etapa: 'Levantamiento de antecedentes sectoriales', estado:'Finalizado' ,
        subetapas: [
          { nombre: "Completar formulario sectorial", estado: "Finalizado", },
          { nombre: "Revisión SUBDERE", estado: "Finalizado" },
        ],},
        { id: 3, etapa: 'Complemento y validación de DIPRES', estado: 'Finalizado' ,  
        subetapas: [
          { nombre: "Notificar a", estado: "Finalizado", usuarioDesignado:"Casian Andor" },
          { nombre: "Subir minuta", estado: "Finalizado" },
          { nombre: "Revisión SUBDERE", estado: "Finalizado" },
        ],},
        { id: 4, etapa: 'Levantamiento de antecedentes GORE', estado: 'Finalizado',
        subetapas: [
          { nombre: "Notificar a", estado: "Finalizado", usuarioDesignado:"Jyn Erso" },
          { nombre: "Completar formulario GORE", estado: "Finalizado" },
        ], },
        { id: 5, etapa: 'Complemento y validación de DIPRES', estado: 'En Estudio' ,   
        subetapas: [
          { nombre: "Notificar a", estado: "Finalizado" ,usuarioDesignado:"Galen Erso"},
          { nombre: "Subir minuta", estado: "Finalizado" },
          { nombre: "Revisión SUBDERE", estado: "Finalizado" },
        ],},
      ],
    },
    {
      id: 2,
      nombre: 'Competencia 2',
      detalles: 'Detalles de la competencia 2',
      etapas: [
        { id: 1, etapa: 'Inicio de transferencia de competencia', estado: 'Finalizado'  , 
        subetapas: [
          { nombre: "Crear competencia", estado: "Finalizado" },
          { nombre: "Usuario sectorial vinculado a la competencia creada", estado: "Finalizado" },
        ], },
        { id: 2, etapa: 'Levantamiento de antecedentes sectoriales', estado:'Finalizado' ,
        subetapas: [
          { nombre: "Completar formulario sectorial", estado: "Revision", },
          { nombre: "Revisión SUBDERE", estado: "finalizado" },
        ],},
        { id: 3, etapa: 'Complemento y validación de DIPRES', estado: 'En Estudio' ,  
        subetapas: [
          { nombre: "Notificar a usuario", estado: "revision" },
          { nombre: "Subir minuta", estado: "Pendiente" },
          { nombre: "Revisión SUBDERE", estado: "Pendiente" },
        ],},
        { id: 4, etapa: 'Levantamiento de antecedentes GORE', estado: 'Pendiente',
        subetapas: [
          { nombre: "Notificar a usuario", estado: "Pendiente" },
          { nombre: "Completar formulario GORE", estado: "Pendiente" },
        ], },
        { id: 5, etapa: 'Complemento y validación de DIPRES', estado: 'Pendiente' ,   
        subetapas: [
          { nombre: "Notificar a usuario", estado: "Pendiente" },
          { nombre: "Subir minuta", estado: "Pendiente" },
          { nombre: "Revisión SUBDERE", estado: "Pendiente" },
        ],},
      ],
    },
    {
      id: 3,
      nombre: 'Competencia 3',
      detalles: 'Detalles de la competencia 3',
      etapas: [
        { id: 1, etapa: 'Inicio de transferencia de competencia', estado: 'Finalizado'  , 
        subetapas: [
          { nombre: "Crear competencia", estado: "Finalizado" },
          { nombre: "Usuario sectorial vinculado a la competencia creada", estado: "Finalizado" },
        ], },
        { id: 2, etapa: 'Levantamiento de antecedentes sectoriales', estado:'Finalizado' ,
        subetapas: [
          { nombre: "Completar formulario sectorial", estado: "Finalizado", },
          { nombre: "Revisión SUBDERE", estado: "Finalizado" },
        ],},
        { id: 3, etapa: 'Complemento y validación de DIPRES', estado: 'En Estudio' ,  
        subetapas: [
          { nombre: "Notificar a usuario", estado: "revision" },
          { nombre: "Subir minuta", estado: "Pendiente" },
          { nombre: "Revisión SUBDERE", estado: "Pendiente" },
        ],},
        { id: 4, etapa: 'Levantamiento de antecedentes GORE', estado: 'Pendiente',
        subetapas: [
          { nombre: "Notificar a usuario", estado: "Pendiente" },
          { nombre: "Completar formulario GORE", estado: "Pendiente" },
        ], },
        { id: 5, etapa: 'Complemento y validación de DIPRES', estado: 'Pendiente' ,   
        subetapas: [
          { nombre: "Notificar a usuario", estado: "Pendiente" },
          { nombre: "Subir minuta", estado: "Pendiente" },
          { nombre: "Revisión SUBDERE", estado: "Pendiente" },
        ],},
      ],
    },
  ];


