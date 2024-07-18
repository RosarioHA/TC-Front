import { useEffect, useContext, useState } from 'react';
import { FormGOREContext } from '../../../context/FormGore';
import DropdownSelect from '../../dropdown/select';
import CustomTextarea from '../../forms/custom_textarea';
import { PersonalInformado } from './PersonalInformado';


export const PersonalGore = ({
 personalSector,
 personalGore,
 title,
 seccion,
 estamentos,
 dataPersonal,
 dataPaso,
 seccionGore3,
 solo_lectura,
}) => {
    // Inicializamos el estado de la descripción aquí, asumiendo que puede ser actualizado por un prop externo
    const [descripcion, setDescripcion] = useState('');

    const [estadoGuardado, setEstadoGuardado] = useState({ loading: false, saved: false });
  
    const { updatePasoGore } = useContext(FormGOREContext);
  
    // Suponiendo que dataPaso contiene los valores actuales incluyendo descripciones, 
    // y que seccionGore3 es el nivel de anidación donde se encuentra la descripción
    useEffect(() => {
      if (dataPaso && dataPaso[seccionGore3] && dataPaso[seccionGore3][`descripcion_perfiles_tecnicos_${title}`]) {
        setDescripcion(dataPaso[seccionGore3][`descripcion_perfiles_tecnicos_${title}`]);
      }
    }, [dataPaso, seccionGore3, title]); // Aseguramos que se actualice si alguno de estos props cambia
  
    const id = dataPaso ? dataPaso.id : null;
  
    const handleBlur = async () => {
      setEstadoGuardado({ loading: true, saved: false });
      const payload = {
        id,
        [seccionGore3]: {
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
  
    const handleDescripcionChange = (e) => {
      setDescripcion(e.target.value);
      setEstadoGuardado({ loading: false, saved: false });
    };

  return (
    <div>
      <PersonalInformado
        personalSector={personalSector}
        personalGore={personalGore}
        title={title}
        seccion={seccion}
        estamentos={estamentos}
        dataPersonal={dataPersonal}
        solo_lectura={solo_lectura}
      />
      <> 
        <p>Primero elige la calidad jurídica que quieres agregar:</p>
        <div className="row">
          <div className="col-1">
            <p className="text-sans-p-bold mt-3">Calidad Jurídica</p>
          </div>
          <div className="col-2">
            <DropdownSelect
              placeholder="Calidad Jurídica"
              options=""
              onSelectionChange=""
              readOnly={solo_lectura}
            />
          </div>
        </div>
      </>
      {!solo_lectura && (
      <button className="btn-secundario-s m-2">
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">
          Agregar Calidad Juridica
        </p>
      </button>
      )}

      <div className="mt-5">
      <CustomTextarea
          id={`descripcion_perfiles_tecnicos_${title}`}
          label={`Descripción de perfiles técnicos ${title}`}
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
