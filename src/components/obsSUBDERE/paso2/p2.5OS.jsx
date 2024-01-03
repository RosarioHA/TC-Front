import DescargarArchivo from "../../forms/descargar_archivo";
import CustomTextarea from "../../forms/custom_textarea";

export const Subpaso_dosPuntoCincoOS = () => {
  return(
    <div>
      <h4 className="text-sans-h4">2.5 Flujograma de ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-grey">Mínimo 1 archivo, máximo 5 archivos, peso máximo 5MB por archivo, formato PDF</h6>

      <div className="container-fluid pb-3">
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="d-flex mb-2">
              <div className="ms-4">#</div>
              <div className="ms-5">Documento</div>
            </div>
            <div className="me-5">Acción</div>
          </div>
          <div className="neutral-line">
            <DescargarArchivo 
            index="1"
            tituloDocumento="GAB.PRES. N° 1675, 14.09.2023 Transferencia de Competencias Ley 19.175 (2).pdf"/>
          </div> 
        </div>

      <div className="my-4">COMPONENTE VISOR PDF</div>

      <div className="mt-4">
        <CustomTextarea 
          label="Descripción cualitativa del ejercicio de la competencia en la región" 
          placeholder="Describe el ejercicio de la competencia " 
          id="descEjercicioCompetencia" 
          readOnly={true}/>
      </div>
    </div>
  )
};