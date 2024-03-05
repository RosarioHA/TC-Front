// import { useState } from "react";
import { SubirOrganigrama } from "../../commons/subirOrganigrama";
import CustomTextarea from "../../forms/custom_textarea";

export const SubUno_Tres = ({dataPaso}) =>
{
  // const [ formData, setFormData ] = useState({
  //   paso1: dataPaso.paso1 || {
  //     descripcion_organigrama_gore: dataPaso.descripcion_archivo_organigrama_nacional,
  //     organigrama_nacional: dataPaso.organigrama_nacional,
  //   }
  // });
  // const [ inputStatus, setInputStatus ] = useState({  
  //   descripcion_archivo_organigrama_nacional: { loading: false, saved: false },
  //   organigrama_gore: { loading: false, saved: false }
  // }); 

  const ver= false; 
  console.log(dataPaso); 
  
  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <h4 className="text-sans-h4">1.3 Organigrama del Gobierno Regional que identifique dónde se alojará la competencia</h4>
        <div className="text-sans-h6-primary mb-4 col-11">
          <h6>
          Se debe incorporar un organigrama del Gobierno Regional que establezca claramente la División, Departamento y/o Unidad donde se alojará la competencia.
          </h6>
        </div>
        <h6 className="text-sans-h6">(Máximo 1 archivo, peso máximo 20 MB, formato PDF)</h6>

        <div className="col-11">
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="d-flex mb-2">
              <div className="ms-4">#</div>
              <div className="ms-5">Documento</div>
            </div>
            <div className="me-5">Acción</div>
          </div>
          <div>
            <SubirOrganigrama
              index="1"
              fieldName="organigrama_gore"
              handleFileSelect=''
              // loading={inputStatus.organigrama_gore.loading}
              tituloDocumento={dataPaso?.organigrama_nacional}
              ver={ver}
            />
          </div>
        </div>

        <div className="my-4 col-12">
          <CustomTextarea
            label="Descripción del archivo adjunto (Opcional)"
            placeholder="Describe el archivo adjunto"
            id="descripcion_archivo_organigrama_nacional"
            name="descripcion_archivo_organigrama_nacional"
            value={dataPaso?.descripcion_archivo_organigrama_nacional}
            onChange=''
            onBlur=''
            // loading={inputStatus.descripcion_archivo_organigrama_nacional.loading}
            // saved={inputStatus.descripcion_archivo_organigrama_nacional.saved}
            maxLength={500}
            // readOnly={solo_lectura}
          />
        </div>

      </div>


    </>
  )
}
