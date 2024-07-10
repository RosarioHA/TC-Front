import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { useEtapa3 } from "../../hooks/minutaDIPRES/useEtapa3";
import { useEtapa } from "../../hooks/etapa/useEtapa";
import { EncabezadoFormularios } from "../../components/layout/EncabezadoFormularios";
import { SubirArchivo } from "../../components/commons/subirArchivo";
import CustomTextarea from "../../components/forms/custom_textarea";

const ObservacionesSubdere = () =>
{
  const [ etapaOmitida, setEtapaOmitida ] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id, 2);
  const { patchCompetenciaOmitida } = useEtapa3();
  const { updateEtapa} = useEtapa(id, 2);
  const observacionesEnviadas = competenciaDetails?.etapa2?.observaciones_completas;
  const etapaFinalizada = competenciaDetails?.etapa2?.estado === 'Finalizada';

  const formularios = competenciaDetails?.etapa2?.formulario_sectorial?.detalle_formularios_sectoriales
  const formulario = competenciaDetails?.etapa2?.formulario_sectorial[ 0 ]


  useEffect(() =>
  {
    // Obtener etapaOmitida desde competenciaDetails y establecerla en el estado
    if (competenciaDetails && competenciaDetails.etapa3 && competenciaDetails.etapa3.omitida !== undefined)
    {
      setEtapaOmitida(competenciaDetails.etapa3.omitida);
    }
  }, [ competenciaDetails ]); // Este efecto se ejecuta cada vez que competenciaDetails cambia

  const handleBackButtonClick = () =>
  {
    navigate(-1);
  };

  const handleRadioButtonChange = (value) =>
  {
    setEtapaOmitida(value === 'B');
  };

  const handleVerFormulario = (formularioId) =>
  {
    navigate(`/home/formulario_sectorial/${formularioId}/paso_1`);
  };


  const handleCerrarEtapa = async () =>
  {
    try
    {
      // Realizar la actualización del paso 2 aquí
      await updateEtapa(2, { estado: "Finalizada" });
      await patchCompetenciaOmitida(competenciaDetails?.etapa3?.id, etapaOmitida);
      navigate(`/home/success_cierre_observaciones/${competenciaDetails?.id}`);
    } catch (error)
    {
      console.error("Error al cerrar la etapa:", error);
    }
  };


  return (
    <div className="container col-10 col-xxl-11">
      <div className="py-3 d-flex">
        <div className="align-self-center">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0 text-decoration-underline">Volver</p>
          </button>
        </div>
        <nav className="container mx-5" aria-label="breadcrumb">
          <ol className="breadcrumb breadcrumb-style d-flex my-2">
            <li className="breadcrumb-item align-self-center"><Link to="/home">Inicio</Link></li>
            <li className="breadcrumb-item align-self-center"><Link to={`/home/estado_competencia/${competenciaDetails.id}`}>Estado de la Competencia: {competenciaDetails.nombre} </Link></li>
            <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Observaciones SUBDERE</li>
          </ol>
        </nav>
      </div>

      <div>
        <h1 className="text-sans-Title">Observaciones SUBDERE</h1>
        <h2 className="text-sans-h1">Formularios Sectoriales</h2>
        <EncabezadoFormularios id={id} />
      </div>
      <hr />

      <div className="my-4">
        {competenciaDetails?.etapa2?.observaciones_sectorial ? (
          Array.isArray(competenciaDetails.etapa2.observaciones_sectorial) ? (
            competenciaDetails.etapa2.observaciones_sectorial.map((observaciones, index) => (
              <tr
                className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}
                key={observaciones.id}
              >
                <td>{observaciones.nombre}</td>
                <td className="">
                  <button
                    className='btn-secundario-s text-decoration-underline'
                    onClick={() => handleVerFormulario(observaciones.id)}
                  >
                    <p className="mb-0">{observaciones.accion}</p>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            competenciaDetails?.etapa2.observaciones_sectorial?.detalle_observaciones_sectoriales
              .sort((a, b) => b.id - a.id)
              .map((observaciones, index) => (
                <tr
                  className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}
                  key={observaciones.id}
                >
                  <td>{observaciones.nombre}</td>
                  <td className="">
                    <button
                      className='btn-secundario-s text-decoration-underline'
                      onClick={() => handleVerFormulario(observaciones.id)}
                    >
                      <p className="mb-0">{observaciones.accion}</p>
                    </button>
                  </td>
                </tr>
              ))
          )
        ) : (
          <p>No hay formularios disponibles.</p>
        )}
      </div>
      <hr />

      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <p className="text-sans-p">Plazo para completar formulario:</p><p className="text-sans-p-bold ms-2">{competenciaDetails.plazo_formulario_sectorial} días corridos</p>
        </div>
        <div className="d-flex pe-4">
          <p className="text-sans-p">Tiempo utilizado:</p><p className="text-sans-p-bold ms-2">{competenciaDetails?.etapa2?.calcular_tiempo_transcurrido.dias} días {competenciaDetails?.etapa2?.calcular_tiempo_transcurrido.horas} horas {competenciaDetails?.etapa2?.calcular_tiempo_transcurrido.horas} minutos</p>
        </div>
      </div>
      <div className="d-flex mb-4">
        <p className="text-sans-p">Fecha última modificación:</p><p className="text-sans-p-bold ms-2">{competenciaDetails?.etapa2?.fecha_ultima_modificacion}</p>
      </div>

      {/* DOCUMENTOS ANTECEDENTES ADICIONALES SECTOR:
        aqui el usuario SUBDERE envia sus AA sobre cada Sector de la competencia
        pendiente conecciones PATCH con el backend*/}
      <div className="my-4">
        <p className="text-sans-h4 mt-5">Antecedentes Adicionales de sector</p>
        {formularios?.map((sector, index) => (
          <div className="col-10" key={index}>
            <p className="text-sans-h5 my-2 "><strong>{sector.nombre.replace('Completar formulario Sectorial - ', '')}</strong></p>
            {sector.antecedente_adicional_sectorial !== 'No aplica' ? (
              <>
                <div>
                  <div className="d-flex justify-content-between py-2 fw-bold">
                    <div className="d-flex my-1">
                      <div className="ms-4">#</div>
                      <div className="ms-5">Documento</div>
                    </div>
                    <div className="me-5">Acción</div>
                  </div>
                </div>
                <SubirArchivo
                  readOnly={true}
                  tituloDocumento={sector.antecedente_adicional_sectorial}
                  archivoDescargaUrl={sector.antecedente_adicional_sectorial}
                />
                <div className="my-4">
                  <CustomTextarea
                    label="Descripción del archivo adjunto (Opcional)"
                    placeholder="Describe el archivo adjunto"
                    value={sector.descripcion_antecedente}
                    readOnly={true}
                  />
                </div>
              </>
            ) : (<div className="my-5 px-3 neutral-line py-3">
              El sector no subió antecedentes adicionales.
            </div>)}
          </div>
        ))}

        {formulario &&
          <div className="col-10">
            <p className="text-sans-h5 my-2 "><strong>{formulario.nombre.replace('Completar formulario Sectorial - ', '')}</strong></p>
            {formulario.antecedente_adicional_sectorial !== 'No aplica' ? (
              <>
                <div>
                  <div className="d-flex justify-content-between py-2 fw-bold">
                    <div className="d-flex my-1">
                      <div className="ms-4">#</div>
                      <div className="ms-5">Documento</div>
                    </div>
                    <div className="me-5">Acción</div>
                  </div>
                </div>
                <SubirArchivo
                  readOnly={true}
                  tituloDocumento={formulario.antecedente_adicional_sectorial}
                  archivoDescargaUrl={formulario.antecedente_adicional_sectorial}
                />
                <div className="my-4">
                  <CustomTextarea
                    label="Descripción del archivo adjunto (Opcional)"
                    placeholder="Describe el archivo adjunto"
                    value={formulario.descripcion_antecedente}
                    readOnly={true}
                  />
                </div>
              </>
            ) : (
              <div className="my-5 px-3 neutral-line py-3">
                El sector no subió antecedentes adicionales.
              </div>)}
          </div>
        }
      </div>


      {observacionesEnviadas && (
        <div>
          {!etapaFinalizada && (
            <>
              <h3 className="text-sans-h2">Esta todo listo para que termines la etapa</h3>
              <p className="text-sans-p mt-3 mb-5">Ya revisaste todos los formularios. </p>
              <p className="text-sans-p mb-2">Debes definir cual es el próximo paso en el procedo de análisis de la competencia:</p>
            </>
          )}
          <div>
            <div className="form-check">
              <input
                type="radio"
                id="opcionA"
                name="proximaEtapa"
                className="form-check-input"
                value="A"
                onChange={() => handleRadioButtonChange('A')}
                checked={etapaOmitida === false}
                disabled={etapaFinalizada}
              />
              <label htmlFor="opcionA" className="text-sans-p">
                DIPRES debe pronunciarse respecto de la información del sector o sectores asociados a la competencia.
              </label>
            </div>

            <div className="form-check">
              <input
                type="radio"
                id="opcionB"
                name="proximaEtapa"
                className="form-check-input"
                value="B"
                onChange={() => handleRadioButtonChange('B')}
                disabled={etapaFinalizada}
                checked={etapaOmitida === true}
              />
              <label htmlFor="opcionB" className="text-sans-p">
                GORE debe entregar sus antecedentes para que luego DIPRES se pronuncie respecto a la información.
              </label>
            </div>
          </div>
        </div>
      )}

      {!observacionesEnviadas && (
        <>
          <div className="my-5">
            <h3 className="text-sans-h2">Debes revisar todos los formularios antes de terminar la etapa</h3>
            <p className="text-sans-p mt-3">Para poder terminar la etapa debes revisar todos los formularios y dejar observaciones donde consideres necesario.</p>
          </div>
        </>
      )}

      <div className="d-flex justify-content-end my-5 me-3">
        {!etapaFinalizada && (
          <button
            className="btn-primario-s"
            disabled={etapaOmitida === null}
            onClick={handleCerrarEtapa}
          >
            Cerrar etapa
            <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
          </button>
        )}
      </div>
    </div>
  )
}

export default ObservacionesSubdere;