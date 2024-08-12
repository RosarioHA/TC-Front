import { useEffect, useContext, useState } from 'react';
import { FormGOREContext } from '../../../../context/FormGore';
import DropdownSelect from '../../dropdown/select';
import CustomTextarea from '../../forms/custom_textarea';
import { PersonalInformado } from './PersonalInformado';


export const PersonalGore = ({
  personalGore,
  estamentos,
  listado_calidades_disponibles,
  title,
  seccion,
  dataPersonal,
  seccionGore3,
  solo_lectura,
  prefix,
}) => {
  // Inicializamos el estado de la descripción aquí, asumiendo que puede ser actualizado por un prop externo
  const [descripcion, setDescripcion] = useState('');
  const [estadoGuardado, setEstadoGuardado] = useState({ loading: false, saved: false });
  const [calidades, setCalidades] = useState(listado_calidades_disponibles || []);
  const [selectedCalidadJuridica, setSelectedCalidadJuridica] = useState('');
  const { updatePasoGore } = useContext(FormGOREContext);

  useEffect(() => {
    if (seccionGore3 && title) {
      const key = `descripcion_perfiles_tecnicos_${title}`;
      if (seccionGore3[key] !== undefined) {
        setDescripcion(seccionGore3[key]);
      }
    }
  }, [seccionGore3, title]);


  // Carga y actualiza las calidades disponibles
  useEffect(() => {
    if (Array.isArray(listado_calidades_disponibles)) { // Verifica que sea un arreglo
      const nuevasCalidades = listado_calidades_disponibles.map(dato => ({
        label: dato.calidad_juridica,
        value: dato.id.toString()
      }));
      setCalidades(nuevasCalidades);
    } else {
      // Maneja el caso en que listado_calidades_disponibles no sea un arreglo
      console.error('listado_calidades_disponibles debe ser un arreglo');
      setCalidades([]); // Puedes establecerlo como un arreglo vacío o manejar el error como prefieras
    }
  }, [listado_calidades_disponibles]);


  const handleBlur = async () => {
    setEstadoGuardado({ loading: true, saved: false });
    const payload = {
      ["paso3_gore"]: {
        [`descripcion_perfiles_tecnicos_${title}`]: descripcion,
      },
    };

    try {
      await updatePasoGore(payload);
      setEstadoGuardado({ loading: false, saved: true });
    } catch (error) {
      console.error('Error updating data', error);
      setEstadoGuardado({ loading: false, saved: false });
    }
  };

  const handleCalidadChange = (selectedOption) => {
    setSelectedCalidadJuridica(selectedOption.value);
  };
  

  // Botón para agregar calidad jurídica
  const agregarCalidadJuridica = async () => {
    if (!selectedCalidadJuridica) {
      console.error('No se ha seleccionado ninguna calidad jurídica');
      return;
    }
  
    const nuevaCalidadPayload = {
      calidad_juridica: selectedCalidadJuridica,
    };
  
    try {
      await updatePasoGore({
        [seccion]: [nuevaCalidadPayload],
      });
      
    } catch (error) {
      console.error('Error al agregar personal nuevo', error);
    }
  };
  

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
    setEstadoGuardado({ loading: false, saved: false });
  };


  return (
    <div>
      <PersonalInformado
        personalGore={personalGore}
        title={title}
        seccion={seccion}
        estamentos={estamentos}
        dataPersonal={dataPersonal}
        solo_lectura={solo_lectura}
        prefix={prefix}
      />

      {listado_calidades_disponibles && listado_calidades_disponibles.length > 0 && (
        <>
          <p>Primero elige la calidad jurídica que quieres agregar:</p>
          <div className="row">
            <div className="col-1">
              <p className="text-sans-p-bold mt-3">Calidad Jurídica</p>
            </div>
            <div className="col-2">
              <DropdownSelect
                placeholder="Calidad Jurídica"
                options={calidades}
                onSelectionChange={handleCalidadChange}
                readOnly={solo_lectura}
              />
            </div>
          </div>
          {!solo_lectura && (
            <button className="btn-secundario-s m-2" onClick={agregarCalidadJuridica} type='button'>
              <i className="material-symbols-rounded me-2">add</i>
              <p className="mb-0 text-decoration-underline">
                Agregar Calidad Juridica
              </p>
            </button>
          )}
        </>
      )}

      <div className="mt-5">
        <CustomTextarea
          id={`descripcion_perfiles_tecnicos_${title}`}
          label={`Descripción de perfiles técnicos ${title}s`}
          placeholder={`Describe los perfiles técnicos ${title} necesarios`}
          maxLength={300}
          value={descripcion} // Controla el valor con el estado
          onChange={handleDescripcionChange}
          onBlur={handleBlur}
          loading={estadoGuardado.loading}
          saved={estadoGuardado.saved}
          readOnly={solo_lectura}
        />
        <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
          <i className="material-symbols-rounded me-2">info</i>
          <h6 className="mt-0">
            Una vez definido el nimero de personas por estamento y calidad
            juridica para el ejercicio de la competencia, señale en el siguiente
            recuadro los perfiles técnicos requeridos.
          </h6>
        </div>
      </div>
    </div>
  );
};
