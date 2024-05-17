import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Avance } from "../../components/tables/Avance";
import { useResumenFinal } from "../../hooks/revisionFinalSubdere/useResumenFinal";
// import { SubirArchivo } from "../../components/commons/subirArchivo";
// import CustomTextarea from "../../components/forms/custom_textarea";

const ResumenFinal = () =>
{
  const navigate = useNavigate();
  const [ pasos, setPasos ] = useState([]);
  const { id } = useParams();
  const { resumen, loading, error, actualizarFormularioEnviado, 
    // subirArchivo
  } = useResumenFinal(id);

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

  const handleEnviarClick = async () =>
  {
    try
    {
      await actualizarFormularioEnviado();
      navigate(`/home/success_revision_final/${id}`);
    } catch (error)
    {
      console.error("Error al enviar el formulario:", error);
    }
  };

  if (loading) return <div className="d-flex align-items-center flex-column ">
    <div className="text-center text-sans-h5-medium-blue ">Cargando Resumen</div>
    <span className="placeholder col-4 bg-primary"></span>
  </div>;
  if (error) return <div>Error: {error}</div>;

  // const handleFileSelect = async (file) =>
  // {
  //   try
  //   {
  //     await subirArchivo(file, "antecedente_adicional_revision_subdere");
  //   } catch (error)
  //   {
  //     console.error("Error al guardar el archivo:", error);
  //   }
  // };


  return (
    <div className="container-fluid">
      <div className="text-center">
        <span className="text-sans-h1">Resumen Formulario Final Subdere  </span>
      </div>
      <div className="mb-5 me-5">
        {pasos.map((paso) => (
          <div className="container" key={paso.numero_paso}>
            <div className="row align-items-center">
              <div className="col-4 ps-5">
                <span><strong>Paso {paso.numero_paso}:</strong> {paso.nombre_paso}</span>
              </div>
              <div className="col-5 d-flex align-items-center">
                <Avance avance={paso.avance} />
              </div>
              <div className="col d-flex justify-content-center">
                {paso.completado ?
                  <img src="/check.svg" alt="Check" /> :
                  <img src="/warning.svg" alt="Warning" />}
              </div>
              <div className="col-2">
                {paso.completado ? (
                  <div className="d-flex justify-content-center">
                    <span className="text-sans-p-blue text-center">Listo</span>
                  </div>
                ) : (
                  <button
                    className="btn-secundario-s my-2"
                    onClick={() => navigate(`/home/revision_subdere/${id}/paso_${paso.numero_paso}`)}
                  >
                    Completar paso
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {!resumen?.formulario_completo && (
        <div className="mb-5 mx-5 px-2">
          <span className="text-serif-h2">
            Aún no puedes enviar el formulario
          </span>
          <p className="text-sans-h6">
            Para enviar el formulario debes completar todos los campos obligatorios de cada paso.
          </p>
        </div>
      )}

      {/* <div className="mb-5 mx-5 px-2">
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
              archivoDescargaUrl={resumen?.antecedente_adicional_revision_subdere}
              tituloDocumento={resumen?.antecedente_adicional_revision_subdere}
              fieldName="antecedente_adicional_revision_subdere"
            />
          </div>
        </div>
        <div className="my-5 col-10">
          <CustomTextarea
            label="Descripción del archivo adjunto (Opcional)"
            placeholder="Describe el archivo adjunto"
          // name="descripcion_archivo_marco_juridico"
          // value={dataPaso?.descripcion_archivo_marco_juridico}
          // onChange={(e) => handleChange('descripcion_archivo_marco_juridico', e)}
          // onBlur={() => handleSave('descripcion_archivo_marco_juridico')}
          // loading={inputStatus.descripcion_archivo_marco_juridico.loading}
          // saved={inputStatus.descripcion_archivo_marco_juridico.saved}
          // maxLength={500}
          // readOnly={solo_lectura}
          />
          <p className="text-sans-h6 mt-2">
            Asegurate que los datos ingresados son correctos, ya que una vez que envíes el formulario, no podrás editarlo a menos que SUBDERE requiera información adicional.
          </p>
        </div>
      </div> */}

      {/* Botones de navegación */}
      <div className="px-5 mx-5 pt-3 pb-4 d-flex justify-content-between">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          Atrás
        </button>

        <button className="btn-primario-s"
          disabled={!resumen?.formulario_completo}
          onClick={handleEnviarClick}>
          <u>Cerrar Proceso</u>
          <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
        </button>
      </div>
    </div>
  );
}

export default ResumenFinal