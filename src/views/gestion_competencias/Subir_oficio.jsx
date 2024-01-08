import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";



const SubirOficio = () =>
{
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);
  const navigate = useNavigate();
  const [ competencia, setCompetencia ] = useState(null);
  const [ selectedFile, setSelectedFile ] = useState(null);
  const [ buttonText, setButtonText ] = useState('Subir archivo');
  const [ selectedDate, setSelectedDate ] = useState('');


  console.log('id', id);

  useEffect(() =>
  {
    if (competenciaDetails)
    {
      setCompetencia(competenciaDetails);
    }
  }, [ competenciaDetails ]);

  const handleBackButtonClick = () =>
  {
    navigate(-1);
  };

  const handleFileChange = (event) =>
  {
    const file = event.target.files[ 0 ];
    if (file)
    {
      setSelectedFile(file);
      setButtonText('Modificar');
    }
  };

  const handleDateChange = (event) =>
  {
    setSelectedDate(event.target.value);
  };


  const handleUploadClick = () =>
  {
    document.getElementById('fileUploadInput').click();
  };
  if (!competencia)
  {
    // Puedes mostrar un mensaje de carga o retornar null si prefieres no renderizar nada
    return <div>Cargando datos de la competencia...</div>;
  }

  return (
    <>
      <div className="my-3 mx-5">
        <div className="py-3 d-flex">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0 text-decoration-underline">Volver</p>
          </button>
          <nav className="container mx-5" aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb-style d-flex my-2">
              <li className="breadcrumb-item align-self-center"><Link to="/home">Inicio</Link></li>
              <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Estado de la Competencia: {competencia.nombre}</li>
            </ol>
          </nav>
        </div>
        <span className="text-sans-Title">Oficio para DIPRES</span>
        <div className="my-3 col-9">
          <div className="text-sans-h1 mb-4">{competencia.nombre}</div>
        </div>
        <div>
          <div className="mt-3">
            <span className="text-sans-24">Subir oficio (Obligatorio)</span>
            <p className="text-sans-h6-grey">Máximo 1 archivo, peso máximo 20MB, formato PDF</p>
          </div>
          <div className="col-9 mt-3">
            <table className="table table-striped table align-middle" >
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col" htmlFor="fileUploadInput" className="form-label" >Documento</th>
                  <th scope="col">Acción</th>

                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>  {selectedFile ? selectedFile.name : "No seleccionado"}</td>
                  <td>
                    <div className="d-flex">
                      <input
                        id="fileUploadInput"
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept=".pdf"
                      />

                      <button className="btn-secundario-s d-flex" onClick={handleUploadClick}>
                        <i className="material-symbols-outlined">upgrade</i>
                        <u className="align-self-center text-sans-b-white">{buttonText}</u>
                      </button>
                      <button onClick="" className="btn-terciario-ghost px-2 d-flex align-items-center mx-1">
                        <span className="text-sans-b-red">Borrar</span>
                        <i className="material-symbols-rounded">delete</i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table >
          </div>
          <div className="mt-4 col-9">
            <span className="text-sans-h5">Elige la fecha del oficio (Obligatorio)</span>
            <div className="my-3 col-3">
              <input
                id="dateInput"
                type="date"
                className="form-control"
                onChange={handleDateChange}
                value={selectedDate}
              />
            </div>
            <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6 className="mt-1">La fecha del oficio debe coincidir con la fecha en que
                DIPRES recibió la información, así los plazos previamente establecidos
                para el<br /> llenado de la minuta comienzan a correr.</h6>
            </div>
            <div className="d-flex justify-content-end">
              <button className="btn-primario-s ps-3" onClick="">
                <u>Subir oficio</u>
                <i className="material-symbols-rounded mx-1">arrow_forward_ios</i>
              </button>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default SubirOficio; 
