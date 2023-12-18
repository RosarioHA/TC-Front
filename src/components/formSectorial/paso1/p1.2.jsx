import CustomTextarea from "../../forms/custom_textarea";
import SubirArchivo from "../../forms/subir_archivo";

export const Subpaso_dos = () => {
  return (
    <div className="pe-5 me-5">
    <h4 className="text-sans-h4">1.2 Organización Institucional</h4>
    <h6 className="text-sans-h6-primary mb-4">En esta sección se debe representar gráficamente la estructura orgánica 
    de la institución a nivel nacional y regional, incluyendo el numero de funcionarios en las unidades intervinientes 
    (departamento, division u otro) involucradas en el ejercicio de la competencia.</h6>

    <h5 className="text-sans-h5">Organigrama Nacional (Obligatorio)</h5>
    <h6 className="text-sans-h6">Máximo 1 archivo, peso máximo 20MB, formato PDF</h6>

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

    <div className="mt-4">
      <CustomTextarea 
        label="Descripción del archivo adjunto (Opcional)" 
        placeholder="Describe el archivo adjunto" 
        id="descOrganigramaNacional" 
        maxLength={500}/>
    </div>

    <h5 className="text-sans-h5 mt-4">Organigrama Regional (Opcional)</h5>
    <h6 className="text-sans-h6 mb-3">Máximo 1 archivo, peso máximo 20MB, formato PDF</h6>
    <p className="text-sans-p-semibold">Regiones asociadas a la competencia:</p>

    {/* por cada region asociada debe haber una fila para subir su organigrama, encabezada por el nombre de la region */}
    <div className="ps-3">
      <div className="d-flex justify-content-between py-3 fw-bold">
        <div className="d-flex mb-2">
          <div className="ms-4">#</div>
          <div className="ms-5">Región</div>
          <div className="ms-5 ps-5">Documento</div>
        </div>
        <div className="me-5">Acción</div>
      </div>
      <div className="row neutral-line align-items-center">
        <SubirArchivo
          index="1"
          fileType="No seleccionado"
          tituloDocumento="$NombreRegion"/>
      </div>
    </div>

    <div className="my-4">
      <CustomTextarea 
        label="Descripción del archivo(s) adjunto(s) (Opcional)" 
        placeholder="Describe el archivo adjunto" 
        id="descOrganigramaRegional" 
        maxLength={500}/>
    </div>

  </div>
  )
};