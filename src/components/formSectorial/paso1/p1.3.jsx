import { useContext, useState, useEffect } from 'react';
import { FormularioContext } from "./../../../context/FormSectorial";
import CustomTextarea from "../../forms/custom_textarea";
import DropdownSelect from "../../dropdown/select";
import { useAmbitos } from '../../../hooks/useAmbitos';


export const Subpaso_tres = ({ pasoData, id, stepNumber }) =>
{
  const { handleUpdatePaso } = useContext(FormularioContext);
  const { ambitos } = useAmbitos()
  const [ ambitoSeleccionado, setAmbitoSeleccionado ] = useState(null);

  const [ formData, setFormData ] = useState({
    paso1: pasoData.paso1 || {
      identificacion_competencia: pasoData.identificacion_competencia,
      fuentes_normativas: pasoData.fuentes_normativas,
      territorio_competencia: pasoData.territorio_competencia,
      enfoque_territorial_competencia: pasoData.enfoque_territorial_competencia,
      posibilidad_ejercicio_por_gobierno_regional: pasoData.posibilidad_ejercicio_por_gobierno_regional,
      organo_actual_competencia: pasoData.organo_actual_competencia,
    }
  });

  const [ inputStatus, setInputStatus ] = useState({
    identificacion_competencia: { loading: false, saved: false },
    fuentes_normativas: { loading: false, saved: false },
    territorio_competencia: { loading: false, saved: false },
    enfoque_territorial_competencia: { loading: false, saved: false },
    posibilidad_ejercicio_por_gobierno_regional: { loading: false, saved: false },
    organo_actual_competencia: { loading: false, saved: false },
  });

  useEffect(() =>
  {
    if (pasoData && pasoData.paso1)
    {
      setFormData({ paso1: pasoData.paso1 });
    }
  }, [ pasoData ]);

  useEffect(() =>
  {
    const savedData = localStorage.getItem('formData');
    if (savedData)
    {
      setFormData(JSON.parse(savedData));
    }
  }, []);
  useEffect(() =>
  {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [ formData ]);

  const handleChange = (inputName, e) =>
  {
    const { value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      paso1: {
        ...prevFormData.paso1,
        [ inputName ]: value,
      }
    }));
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ inputName ]: { loading: false, saved: false }
    }));
  };


  const handleSave = async (inputName) =>
  {
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ inputName ]: { loading: true, saved: false }
    }));

    const updatedFormData = {
      ...formData,
      paso1: {
        ...formData.paso1,
        ambito_paso1: ambitoSeleccionado ? ambitoSeleccionado.value : formData.paso1.ambito_paso1
      }
    };

    const success = await handleUpdatePaso(id, stepNumber, updatedFormData);
    if (success)
    {
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ inputName ]: { loading: false, saved: true }
      }));
    } else
    {
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ inputName ]: { loading: false, saved: false }
      }));
    }
  };

  const opcionesAmbito = ambitos.map(ambito => ({
    label: ambito.nombre,
    value: ambito.id,
  }));

  const handleAmbitoChange = async (selectedOption) =>
  {
    setAmbitoSeleccionado(selectedOption);
    localStorage.setItem('ambitoSeleccionado', JSON.stringify(selectedOption)); 
    const updatedFormData = {
      ...formData,
      paso1: {
        ...formData.paso1,
        ambito_paso1: selectedOption.value,
      },
    };
    await handleSave('ambito_paso1', updatedFormData);
  };

  useEffect(() =>
  {
    const savedSelection = localStorage.getItem('ambitoSeleccionado');
    if (savedSelection)
    {
      setAmbitoSeleccionado(JSON.parse(savedSelection));
    }
  }, []);

  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">1.3 Marco Regulatorio y funcional de la competencia</span>
        <div className=" text-sans-h6-primary">
          <h6>
            En esta sección se debe identificar la competencia en estudio y
            sus normas legales de origen.
          </h6>
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Identificación de la competencia (Obligatorio)"
            placeholder="Describe la competencia a analizar."
            id="identificacion_competencial"
            name="identificacion_competencia"
            value={pasoData?.identificacion_competencia}
            onChange={(e) => handleChange('identificacion_competencia', e)}
            onBlur={() => handleSave('identificacion_competencia')}
            loading={inputStatus.identificacion_competencia.loading}
            saved={inputStatus.identificacion_competencia.saved}
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
            id="fuentes_normativas"
            name="fuentes_normativas"
            value={pasoData?.fuentes_normativas}
            onChange={(e) => handleChange('fuentes_normativas', e)}
            onBlur={() => handleSave('fuentes_normativas')}
            loading={inputStatus.fuentes_normativas.loading}
            saved={inputStatus.fuentes_normativas.saved}
            maxLength={500}
          />
          <div className="d-flex mb-3 pt-0 text-sans-h6-primary col-11">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Identificar todas las normas e instrumentos que regulan el ejercicio de la competencia y su jerarquía: Ley, Decreto Ley, Decreto con Fuerza de Ley, Decreto o Resoluciones u otros instrumentos.</h6>
          </div>
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Territorio sobre el cual se ejerce la competencia (Obligatorio)"
            placeholder="Describe la delimitación territorial del ejercicio de la competencia."
            id="territorio_competencia"
            name="territorio_competencia"
            value={pasoData?.territorio_competencia}
            onChange={(e) => handleChange('territorio_competencia', e)}
            onBlur={() => handleSave('territorio_competencia')}
            loading={inputStatus.territorio_competencia.loading}
            saved={inputStatus.territorio_competencia.saved}
            maxLength={500}
          />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Delimitación territorial del ejercicio de la competencia ya sea a nivel: nacional, regional, comunal u otra zona territorial, de corresponder.</h6>
          </div>
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Existencia de enfoque territorial sobre la competencia (Obligatorio)"
            placeholder="Describe el enfoque territorial sobre la competencia"
            id="enfoque_territorial_competencia"
            name="enfoque_territorial_competencia"
            value={pasoData?.enfoque_territorial_competencia}
            onChange={(e) => handleChange('enfoque_territorial_competencia', e)}
            onBlur={() => handleSave('enfoque_territorial_competencia')}
            loading={inputStatus.enfoque_territorial_competencia.loading}
            saved={inputStatus.enfoque_territorial_competencia.saved}
            maxLength={500}
          />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Describir si la competencia genera un bien o servicio público estándar, o si tiene especifidades dependiendo del nivel territorial, identificando otros organismos públicos con los que se relaciona.</h6>
          </div>
        </div>
        <div className="my-4 col-11">
          <DropdownSelect
            label="Elige el ámbito de la competencia (Obligatorio)"
            placeholder="Elige el ámbito de la competencia"
            options={opcionesAmbito}
            onSelectionChange={handleAmbitoChange}
            selected={ambitoSeleccionado}
          />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">El ámbito de la competencia se define al final del análisis de la competencia, este campo define la postura del sector.</h6>
          </div>
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Posibilidad de ejercicio de la competencia por parte del Gobierno Regional (Obligatorio) "
            placeholder="Indicar posibilidad de ejercicio de la comeptencia por parte del Gobierno Regional"
            id="posibilidad_ejercicio_por_gobierno_regional"
            name="posibilidad_ejercicio_por_gobierno_regional"
            value={pasoData?.posibilidad_ejercicio_por_gobierno_regional}
            onChange={(e) => handleChange('posibilidad_ejercicio_por_gobierno_regional', e)}
            onBlur={() => handleSave('posibilidad_ejercicio_por_gobierno_regional')}
            loading={inputStatus.posibilidad_ejercicio_por_gobierno_regional.loading}
            saved={inputStatus.posibilidad_ejercicio_por_gobierno_regional.saved}
            maxLength={500} />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Indicar si se trata de un traspaso de competencias al “Gobierno Regional”, constituido tanto por el Gobernador como por el Consejo Regional, o se trata de un traspaso al “Gobernador Regional”, órgano ejecutivo del Gobierno Regional.</h6>
          </div>
        </div>
        <div className="my-4 pb-3 border-bottom">
          <CustomTextarea
            label="Órgano que ejerce actualmente la competencia (Obligatorio)"
            placeholder="Indicar órgano que ejerce actualmente la competencia"
            id="organo_actual_competencia"
            name="organo_actual_competencia"
            value={pasoData?.organo_actual_competencia}
            onChange={(e) => handleChange('organo_actual_competencia', e)}
            onBlur={() => handleSave('organo_actual_competencia')}
            loading={inputStatus.organo_actual_competencia.loading}
            saved={inputStatus.organo_actual_competencia.saved}
            maxLength={500} />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Analizar si la competencia es actualmente ejercida por los ministerios y de los servicios públicos a que se refiere el artículo 28 de la ley N° 18.575, orgánica constitucional de Bases Generales de la Administración del Estado.</h6>
          </div>
        </div>
      </div>
    </>
  )
}