import SubirArchivo from "../../forms/subir_archivo";
import CustomTextarea from "../../forms/custom_textarea";

export const Subpaso_dosPuntoCinco = () => {
  return(
    <div>
      <h4 className="text-sans-h4">2.5 Flujograma de ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-grey">Mínimo 1 archivo, máximo 5 archivos, peso máximo 5MB por archivo, formato PDF</h6>

      <div className="ps-3">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="d-flex mb-2">
            <div className="ms-4">#</div>
            <div className="ms-5">Documento</div>
          </div>
          <div className="me-5">Acción</div>
        </div>
        <div className="row neutral-line align-items-center">
          <SubirArchivo
            index="1"
            fileType="No seleccionado"/>
        </div>
      </div>

      <div className="my-4">COMPONENTE VISOR PDF</div>

      <div className="mt-4">
        <CustomTextarea 
          rows={15}
          label="Descripción cualitativa del ejercicio de la competencia en la región" 
          placeholder="Describe el ejercicio de la competencia " 
          id="descEjercicioCompetencia" 
          maxLength={2200}/>
      </div>
    </div>
  )
};