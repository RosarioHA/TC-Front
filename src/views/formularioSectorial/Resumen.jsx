import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avance } from "../../components/tables/Avance";
import { useResumenFormulario } from '../../hooks/formulario/useResumenFormulario';
import { SubirArchivo } from '../../components/commons/subirArchivo';
import CustomTextarea from '../../components/forms/custom_textarea';

const ResumenSectorial = () =>
{
  const navigate = useNavigate();
  const [ pasos, setPasos ] = useState([]);
  const { id } = useParams();
  const { resumen, actualizarFormularioEnviado, subirArchivo, guardarDescripcion, eliminarArchivo } = useResumenFormulario(id);
  const [ inputStatus, setInputStatus ] = useState({
    descripcion_antecedente: { loading: false, saved: false },
  });

  useEffect(() =>
  {
    if (resumen)
    {
      const pasosArray = Object
        .keys(resumen)
        .filter(key => key.startsWith('paso'))
        .map(key => resumen[ key ]);
      setPasos(pasosArray);
    }
  }, [ resumen ]);

  const handleBackButtonClick = () =>
  {
    navigate(-1);
  }

  const handleEnviarClick = async () =>
  {
    try
    {
      await actualizarFormularioEnviado(true);
      navigate(`/home/success_formulario_sectorial/${id}`);
    } catch (error)
    {
      console.error("Error al enviar observaciones:", error);
    }
  };

  const handleFileSelect = async (file) =>
  {
    try
    {
      await subirArchivo(file, "antecedente_adicional_sectorial");
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

  return (
    <>
      <div className="container container-xxl-fluid">
        <div className="text-center">
          <span className="text-sans-h1">Resumen formulario</span>
        </div>
        <div className="mb-5 me-5">

          {pasos.map(paso => (
            <div className="container" key={paso.numero_paso} >
              <div className="d-flex justify-content-between align-items-center">
                <div className="ps-5 col-4">
                  <span className=""><strong>Paso {paso.numero_paso}:</strong> {paso.nombre_paso} </span>
                </div>
                <div className="d-flex align-items-center">
                  <Avance avance={paso.avance} />
                </div>
                <div className="d-flex justify-content-center mx-3">
                  {paso.completado ?
                    <img src="/check.svg" alt="Check" /> :
                    <img src="/warning.svg" alt="Warning" />
                  }
                </div>
                <div className="col-2 d-flex justify-content-end">
                  {paso.completado ? (
                    <div className="d-flex justify-content-center">
                      <span className="text-sans-p-blue text-center">Listo</span>
                    </div>
                  ) : (
                    <button
                      className="btn-secundario-s my-2"
                      onClick={() => navigate(`/home/formulario_sectorial/${id}/paso_${paso.numero_paso}`)}
                    >
                      Completar paso
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {resumen?.formulario_completo ? (
          <div className="mb-5 mx-5 px-2">
            <span className="text-sans-h1">Está todo listo para que envíes el formulario</span>
            <p className="text-sans-h6">
              Ya llenaste todos los campos obligatorios de este formulario.
            </p>
            <p className="text-sans-h6">
              Si quisieras agregar algún antecedente adicional, sube un archivo en el siguiente recuadro:
            </p>
            <div className="col-9">
              <h5 className="text-sans-h5 mt-4">Antecedentes Adicionales (Opcional)</h5>
              <h6 className="text-sans-h6 mb-3">
                Máximo 1 archivo, peso máximo 20MB, formato PDF)
              </h6>
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
                  archivoDescargaUrl={resumen?.antecedente_adicional_sectorial}
                  tituloDocumento={resumen?.antecedente_adicional_sectorial}
                  fieldName="antecedente_adicional_sectorial"
                />

              </div>
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
              // readOnly={solo_lectura}
              />
              <p className="text-sans-h6 mt-2">
               Asegúrate que los datos ingresados son correctos, ya que una vez que envíes el formulario, no podrás editarlo a menos que SUBDERE requiera información adicional.
              </p>
            </div>
          </div>
        ) : (<div className="mb-5 mx-5 px-2">
          <span className="text-serif-h2">
            Aún no puedes enviar el formulario
          </span>
          <p className="text-sans-h6">
            Para enviar el formulario debes completar todos los campos obligatorios de cada paso.
          </p>
        </div>)}

        {/*Botones navegacion  */}
        <div className="px-5 mx-5 pt-3 pb-4 d-flex justify-content-between">

          <button className="btn-secundario-s" onClick={handleBackButtonClick} >
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            Atrás
          </button>

          <button className="btn-primario-s" disabled={!resumen?.formulario_completo} onClick={handleEnviarClick}>
            <u>Enviar el formulario</u>
          </button>
        </div>
      </div>
    </>
  )
}
export default ResumenSectorial; 