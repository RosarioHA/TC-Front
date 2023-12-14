import CustomInput from "../../forms/custom_input"
import {DocumentsAditionals} from '../../commons/documents';
export const Subpaso_uno = ({ pasoData }) =>
{

  console.log('1.1', pasoData)
  return (
    <>
      <div className="pe-5 me-5">
        <span className="my-4">1.1 Ficha de descripción organizacional</span>
        <div className="my-4">
          <CustomInput
            label="Denominación del organismo"
            placeholder="Escriba la denominación del organismo"
            id={pasoData.denominacion_organismo} />
        </div>
        <div className="my-4">
          <CustomInput
            label="Forma jurídica del organismo (Obligatorio)"
            placeholder="Debes llenar este campo para poder enviar el formulario."
            id={pasoData.forma_juridica_organismo} />
        <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
          <i className="material-symbols-rounded me-2">info</i>
          <h6 className="mt-1">Corresponde a su naturaleza jurídica: centralizado o descentralizado, concentrado o desconcentrado.</h6>
        </div>
        </div>
        <div className="container-fluid"> 
          <DocumentsAditionals />
        </div>
        <div className="my-4">
          <CustomInput 
          label="Descripción archivo(s) de marco jurídico (Opcional)"
          placeholder="Descripción del marco jurídico"
          id={pasoData.descripcion_archivo_marco_juridico} />

        </div>
        <div className="my-4">
          <CustomInput
          label="Misión Institucional (Obligatorio)"
          placeholder="Misión que defina el propósito de ser del organismo"
          id={pasoData.mision_institucional} />
        </div>
        <div className="my-4">
          <CustomInput 
          label="Información adicional (Opcional)"
          placeholder="Escribe información adicional de ser necesario"
          id={pasoData.informacion_adicional_marco_juridico}/>
        <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
          <i className="material-symbols-rounded me-2">info</i>
          <h6 className="mt-1">Llenar en caso de existir información que no sea posible clasificar en alguna de las categorías anteriores y que responda a particularidades propias del organismos.</h6>
        </div>
        </div>
      </div>
    </>
  )
}
