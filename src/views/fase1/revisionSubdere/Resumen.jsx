import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Avance } from "../../../components/fase1/tables/Avance";
import { useResumenFinal } from "../../../hooks/fase1/revisionFinalSubdere/useResumenFinal";
import { SubirArchivo } from "../../../components/fase1/commons/subirArchivo";
import CustomTextarea from "../../../components/fase1/forms/custom_textarea";

const ResumenFinal = () =>
{
  const navigate = useNavigate();
  const [ pasos, setPasos ] = useState([]);
  const { id } = useParams();
  const { resumen, actualizarFormularioEnviado, subirArchivo, guardarDescripcion, eliminarArchivo } = useResumenFinal(id);
  const [ inputStatus, setInputStatus ] = useState({
    descripcion_antecedente: { loading: false, saved: false },
  });

  useEffect(() =>
  {
    if (resumen)
    {
      const pasosArray = Object.keys(resumen)
        .filter(key => key.startsWith('paso'))
        .map(key => resumen[ key ]);
      setPasos(pasosArray);
    }
  }, [ resumen ]);

  const handleBackButtonClick = () =>
  {
    navigate(-1);
  };

  const handleEnviarClick = async () => {
    try {
      await actualizarFormularioEnviado();
  
      // Condicional para navegar según el valor de iniciar_etapa_preimplementacion
      if (resumen?.iniciar_etapa_preimplementacion) {
        navigate(`/home/success_formulario_subdere/${id}`);
      } else {
        navigate(`/home/success_revision_final/${id}`);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  // if (loading) return <div className="d-flex align-items-center flex-column ">
  //   <div className="text-center text-sans-h5-medium-blue ">Cargando Resumen</div>
  //   <span className="placeholder col-4 bg-primary"></span>
  // </div>;
  // if (error) return <div>Error: {error}</div>;

  const handleFileSelect = async (file) =>
  {
    try
    {
      await subirArchivo(file, "antecedente_adicional_revision_subdere");
    } catch (error)
    {
      console.error("Error al guardar el archivo:", error);
    }
  };

  const handleDeleteFile = async () =>
    {
      try
      {
        await eliminarArchivo();
      } catch (error)
      {
        console.error("Error al eliminar el archivo:", error);
      }
    };

    const handleChange = (fieldName, event) =>
      {
        const { value } = event.target;
        setInputStatus(prev => ({
          ...prev,
          [ fieldName ]: { ...prev[ fieldName ], loading: false, saved: false }
        }));
        resumen[ fieldName ] = value;
      };
    
      const handleSave = async (fieldName) =>
      {
        setInputStatus(prev => ({
          ...prev,
          [ fieldName ]: { ...prev[ fieldName ], loading: true }
        }));
        try
        {
          await guardarDescripcion(fieldName, resumen[ fieldName ]);
          setInputStatus(prev => ({
            ...prev,
            [ fieldName ]: { ...prev[ fieldName ], loading: false, saved: true }
          }));
        } catch (error)
        {
          console.error(`Error al guardar ${fieldName}:`, error);
          setInputStatus(prev => ({
            ...prev,
            [ fieldName ]: { ...prev[ fieldName ], loading: false, saved: false }
          }));
        }
      };

      const formulario_completo = resumen?.formulario_completo;

      const formulario_cerrado = resumen?.formulario_recomendacion_cerrado;

  return (
    <div className="container-fluid">
      <div className="text-center">
        <span className="text-sans-h1">Resumen Formulario Final Subdere  </span>
      </div>
      <div className="mb-5 me-5">
        {pasos?.map((paso) => (
          <div className="container" key={paso?.numero_paso}>
            <div className="row align-items-center">
              <div className="col-4 ps-5">
                <span><strong>Paso {paso?.numero_paso}:</strong> {paso?.nombre_paso}</span>
              </div>
              <div className="col-5 d-flex align-items-center">
                <Avance avance={paso?.avance} />
              </div>
              <div className="col d-flex justify-content-center">
                {paso?.completado ?
                  <img src="/check.svg" alt="Check" /> :
                  <img src="/warning.svg" alt="Warning" />}
              </div>
              <div className="col-2">
                {paso?.completado ? (
                  <div className="d-flex justify-content-center">
                    <span className="text-sans-p-blue text-center">Listo</span>
                  </div>
                ) : (
                  <button
                    className="btn-secundario-s my-2"
                    onClick={() => navigate(`/home/revision_subdere/${id}/paso_${paso?.numero_paso}`)}
                  >
                    Completar paso
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {formulario_completo ? (
        <div className="mb-5 mx-5 px-2">
          {!formulario_cerrado ? (
            <>
              <span className="text-sans-h1">Está todo listo para que envíes el formulario</span><p className="text-sans-h6">
                Ya llenaste todos los campos obligatorios de este formulario.
              </p><p className="text-sans-h6">
                Si quisieras agregar algún antecedente adicional, sube un archivo en el siguiente recuadro:
              </p><div className="col-9">
                <h5 className="text-sans-h5 mt-4">Antecedentes Adicionales (Opcional)</h5>
                <h6 className="text-sans-h6 mb-3">
                  Máximo 1 archivo, peso máximo 20MB, formato PDF
                </h6>
              </div>
            </>) : (<h5 className="text-sans-h5 mt-4">Antecedentes Adicionales</h5>)}

          {formulario_completo && (
            <>
              {!formulario_cerrado || resumen?.antecedente_adicional_revision_subdere ? (
                <>
                  <div className="d-flex justify-content-between py-3 fw-bold">
                    <div className="col-10">
                      <div className="d-flex">
                        <div className="ms-4 col-3">#</div>
                        <div className="px-5 col-9">Documento</div>
                        <div className="me-5 col-4">Acción</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <SubirArchivo
                      index="1"
                      handleFileSelect={handleFileSelect}
                      handleDeleteFile={handleDeleteFile}
                      archivoDescargaUrl={resumen?.antecedente_adicional_revision_subdere}
                      tituloDocumento={resumen?.antecedente_adicional_revision_subdere}
                      fieldName="antecedente_adicional_revision_subdere"
                      readOnly={formulario_cerrado}
                    />
                  </div>
                  <div className="my-5 col-10">
                    <CustomTextarea
                      label="Descripción del archivo adjunto (Opcional)"
                      placeholder="Describe el archivo adjunto"
                      name="descripcion_antecedente"
                      value={resumen?.descripcion_antecedente}
                      onChange={(e) => handleChange('descripcion_antecedente', e)}
                      onBlur={() => handleSave('descripcion_antecedente')}
                      loading={inputStatus.descripcion_antecedente.loading}
                      saved={inputStatus.descripcion_antecedente.saved}
                      maxLength={500}
                      readOnly={formulario_cerrado}
                    />
                  </div>
                </>

              ) : (
                <>
                  {(formulario_cerrado && !resumen?.antecedente_adicional_revision_subdere) && (
                    <div className="my-5 px-3 neutral-line py-3">
                      El sector no subió antecedentes adicionales.
                    </div>
                  )}
                </>
              )}
            </>
          )}
          {!formulario_cerrado ? (
            <p className="text-sans-h6 mt-2 col-10">
              Asegúrate que los datos ingresados son correctos, ya que una vez que envíes el formulario, no podrás editarlo a menos que SUBDERE requiera información adicional.
            </p>) : ('')}
        </div>
      ) : (<div className="mb-5 mx-5 px-2">
        <span className="text-serif-h2">
          Aún no puedes enviar el formulario
        </span>
        <p className="text-sans-h6">
          Para enviar el formulario debes completar todos los campos obligatorios de cada paso.
        </p>
      </div>)}

      {/* Botones de navegación */}
      <div className="px-5 mx-5 pt-3 pb-4 d-flex justify-content-between">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          Atrás
        </button>

        {formulario_completo && !formulario_cerrado ? (
          <button className="btn-primario-s" disabled={!formulario_completo} onClick={handleEnviarClick}>
            <u>Cerrar proceso</u>
          </button>)
          : ("")}
      </div>
    </div>
  );
}

export default ResumenFinal