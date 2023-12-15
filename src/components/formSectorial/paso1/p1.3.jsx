import CustomTextarea from "../../forms/custom_textarea"; 
import DropdownSelect from "../../dropdown/select";

export const Subpaso_tres = ({ pasoData, }) =>
{

  console.log('1.3', pasoData);

  return (
    <>
      <div className="pe-5 me-5 mt-4">
        <span className="my-4 text-sans-h4">1.3 Marco Regulatorio y funcional de la competencia</span>
        <h6 className=" text-sans-h6-primary">En esta sección se debe identificar la competencia en estudio y sus normas legales de origen.</h6>
        <div className="my-4">
          <CustomTextarea
            label="Identificación de la competencia (Obligatorio)"
            placeholder="Describe la competencia a analizar."
            id={pasoData.identificacion_competencia}
            maxLength={500}
          />
          <div className="d-flex mb-3 pt-0 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Descripción general de la competencia a analizar.</h6>
          </div>
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Fuentes Normativas (Obligatorio)"
            placeholder="Identificar todas las normas e instrumentos que regulan el ejercicio de la competencia"
            id={pasoData.fuentes_normativas}
            maxLength={500}
          />
          <div className="d-flex mb-3 pt-0 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Identificar todas las normas e instrumentos que regulan el ejercicio de la competencia y su jerarquía: Ley, Decreto Ley, Decreto con Fuerza de Ley, Decreto o Resoluciones u otros instrumentos.</h6>
          </div>
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Territorio sobre el cual se ejerce la competencia (Obligatorio)"
            placeholder="Describe la delimitación territorial del ejercicio de la competencia."
            id={pasoData.territorio_competencia}
            maxLength={500}
          />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Delimitación territorial del ejercicio de la competencia ya sea a nivel: nacional, regional, comunal u otra zona territorial, de corresponder.</h6>
          </div>
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Existencia de enfoque territorial sobre la competencia (Obligatorio)"
            placeholder="Describe el enfoque territorial sobre la competencia"
            id={pasoData.enfoque_territorial_competencia}
            maxLength={500}
          />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Describir si la competencia genera un bien o servicio público estándar, o si tiene especifidades dependiendo del nivel territorial, identificando otros organismos públicos con los que se relaciona.</h6>
          </div>
        </div>
        <div className="my-4">
          < DropdownSelect
            label="Elige el ámbito de la competencia (Obligatorio)"
            placeholder="Elige el ámbito de la competencia"
            name={pasoData.ambito}
            options=""
          />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">El ámbito de la competencia se define al final del análisis de la competencia, este campo define la postura del sector.</h6>
          </div>
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Posibilidad de ejercicio de la competencia por parte del Gobierno Regional (Obligatorio) "
            placeholder="Indicar posibilidad de ejercicio de la comeptencia por parte del Gobierno Regional"
            id={pasoData.posibilidad_ejercicio_por_gobierno_regional}
            maxLength={500} />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Indicar si se trata de un traspaso de competencias al “Gobierno Regional”, constituido tanto por el Gobernador como por el Consejo Regional, o se trata de un traspaso al “Gobernador Regional”, órgano ejecutivo del Gobierno Regional.</h6>
          </div>
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Órgano que ejerce actualmente la competencia (Obligatorio)"
            placeholder="Indicar órgano que ejerce actualmente la competencia"
            id={pasoData.organo_actual_competencia}
            maxLength={500} />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Analizar si la competencia es actualmente ejercida por los ministerios y de los servicios públicos a que se refiere el artículo 28 de la ley N° 18.575, orgánica constitucional de Bases Generales de la Administración del Estado.</h6>
          </div>
        </div>
      </div>
    </>
  )
}
