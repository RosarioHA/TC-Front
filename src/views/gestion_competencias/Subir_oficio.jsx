import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { useUpdateEtapa } from "../../hooks/competencias/useOficio";
import {SuccessSOficio } from "../../components/success/oficio";

const SubirOficio = () => {
  const updateEtapa = useUpdateEtapa();
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);
  const navigate = useNavigate();
  const [ competencia, setCompetencia ] = useState(null);
  const [ selectedFile, setSelectedFile ] = useState(null);
  const [ buttonText, setButtonText ] = useState('Subir archivo');
  const [ fechaInicio, setFechaInicio ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ isSubmitSuccessful, setIsSubmitSuccessful ] = useState(false);
  const [ fechaMaxima, setFechaMaxima ] = useState('');
  const location = useLocation();
  const extraData = location.state?.extraData;
  const [ errorMessageDate, setErrorMessageDate ] = useState("");
  const etapaNum = 2;
  const etapaId = competenciaDetails?.etapa2?.id


  useEffect(() => {
    if (competenciaDetails) {
      setCompetencia(competenciaDetails);
    }
  }, [ competenciaDetails ]);

  useEffect(() => {
    // Establece la fecha máxima permitida como la fecha actual
    const hoy = new Date();
    const fechaActual = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getDate().toString().padStart(2, '0')}`;
    setFechaMaxima(fechaActual);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[ 0 ];
    if (file) {
      if (file.size > 20971520)
      { // 20 MB en bytes
        setErrorMessage("Archivo no cumple con el peso permitido");
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setButtonText('Modificar');
        setErrorMessage(""); // Limpiar el mensaje de error si el archivo es válido
      }
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setButtonText('Subir archivo');
  };

  const handleUploadClick = () => {
    document.getElementById('fileUploadInput').click();
  };

  const dateInputRef = useRef(null);

  const handleFechaInicioChange = (event) => {
    const selectedDate = event.target.value;
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    if (selectedDate > formattedToday) {
      setErrorMessageDate("La fecha no puede ser posterior a la fecha actual.");
      event.target.value = formattedToday;
      setFechaInicio(formattedToday);
    } else {
      setErrorMessageDate("");
      setFechaInicio(selectedDate);
    }
  };

  const prepareDataForSubmission = () => {
    const formData = new FormData();
    // Agregar el archivo cargado solo si existe
    if (selectedFile) {
      formData.append('oficio_origen', selectedFile, selectedFile.name);
    }
    // Agregar la fecha de inicio
    formData.append('fecha_inicio', fechaInicio);
    return formData;
  };

  const handleSubmission = async () => {
    // Verificar si el archivo y la fecha han sido seleccionados
    if (!selectedFile || fechaInicio === '') {
      setErrorMessage("Por favor, selecciona un archivo y una fecha.");
      return; // No continuar si falta alguno de los dos
    }

    const formData = prepareDataForSubmission();

    if (!etapaNum || !etapaId) {
      console.error("etapaNum o competenciaId están indefinidos o son nulos");
      return; // No continuar si los parámetros son inválidos
    }
    try {
      await updateEtapa(etapaNum, etapaId, formData);
      setIsSubmitSuccessful(true);
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      // Manejar errores...
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  if (!competencia) {
    return <div className="d-flex align-items-center flex-column ">
      <div className="text-center text-sans-h5-medium-blue ">Cargando datos de la competencia...</div>
      <span className="placeholder col-4 bg-primary"></span>
    </div>;
  }

  return (
    <>
      <div className="container col-10 col-xxl-11">
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
        <span className="text-sans-Title">Oficio sectorial</span>
        <div className="my-3">
          <div className="text-sans-h1 mb-4">{competencia.nombre}</div>
        </div>
        {!isSubmitSuccessful ? (
          <div>
            <div className="mt-3">
              <span className="text-sans-24">Subir oficio (Obligatorio)</span>
              <p className="text-sans-h6-grey">Máximo 1 archivo, peso máximo 20MB, formato PDF</p>
            </div>
            <div className="mt-5">
              <table className="table table-striped table align-middle">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col" htmlFor="fileUploadInput" className="form-label">Documento</th>
                    <th scope="col"></th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>{selectedFile ? selectedFile.name : "No seleccionado"}</td>
                    <td className="w-20 px-0 mx-0">{errorMessage && <div className="text-sans-h6-darkred">{errorMessage}</div>}</td>
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
                        {selectedFile && (
                          <button onClick={handleDelete} className="btn-terciario-ghost px-2 d-flex align-items-center mx-1">
                            <span className="text-sans-b-red">Borrar</span>
                            <i className="material-symbols-rounded">delete</i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-5">
              <span className="text-sans-h5">Elige la fecha del oficio (Obligatorio)</span>
              <div className="my-3 col-3">
                <input
                  ref={dateInputRef}
                  onClick={() => dateInputRef.current?.click()}
                  id="dateInput"
                  type="date"
                  className="form-control py-3 my-2 border rounded border-dark-subtle"
                  onChange={handleFechaInicioChange}
                  value={fechaInicio}
                  max={fechaMaxima}
                />
              </div>
              {errorMessageDate && (
                <p className="text-sans-h6-darkred mt-1 mb-0">{errorMessageDate}</p>
              )}
              <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
                <i className="material-symbols-rounded me-2">info</i>
                <h6 className="mt-1">La fecha del oficio debe coincidir con la fecha en que el sector recibió la información, así los plazos previamente establecidos para el llenado del formulario sectorial. </h6>
              </div>
              <div className="d-flex justify-content-end">
                {errorMessage && <div className="text-sans-h6-darkred me-4">{errorMessage}</div>}
                <button className="btn-primario-s ps-3" onClick={handleSubmission}>
                  <u>Subir oficio</u>
                  <i className="material-symbols-rounded mx-1">arrow_forward_ios</i>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <SuccessSOficio idCompetencia={id} sector={extraData} siguientePaso="información al formulario sectorial" />
        )}
      </div >
    </>
  )
}

export default SubirOficio; 
