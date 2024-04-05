import { useEffect, useContext, useState } from 'react';
import { FormGOREContext } from '../../../context/FormGore';
import DropdownSelect from '../../dropdown/select';
import CustomTextarea from '../../forms/custom_textarea';
import { PersonalInformado } from './PersonalInformado';

export const Personal = ({
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
  const [descripcion, setDescripcion] = useState('');
  const [descripcionInicial, setDescripcionInicial] = useState('');
  // Agregar estados para loading y saved
  const [estadoGuardado, setEstadoGuardado] = useState({ loading: false, saved: false });

  const { updatePasoGore } = useContext(FormGOREContext);

  const id = dataPaso ? dataPaso.id : null;

  useEffect(() => {
    const campoDescripcion = title.includes("Directo") ? 'descripcion_perfiles_tecnicos_directo' : 'descripcion_perfiles_tecnicos_indirecto';
    const valorInicial = dataPaso && dataPaso[campoDescripcion] ? dataPaso[campoDescripcion] : '';
    setDescripcion(valorInicial);
    setDescripcionInicial(valorInicial); // Establecer el valor inicial
  }, [dataPaso, title]);

  const handleBlur = async () => {
    if (descripcion !== descripcionInicial) {
      setEstadoGuardado({ loading: true, saved: false });
      const campoDescripcion = title.includes("Directo") ? 'descripcion_perfiles_tecnicos_directo' : 'descripcion_perfiles_tecnicos_indirecto';

      const payload = {
        id,
        [seccionGore3]: {
          [campoDescripcion]: descripcion,
        },
      };

      try {
        await updatePasoGore(payload);
        setDescripcionInicial(descripcion); // Actualizar el valor inicial
        setEstadoGuardado({ loading: false, saved: true });
      } catch (error) {
        console.error('Error updating data', error);
        setEstadoGuardado({ loading: false, saved: false });
      }
    }
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
    // Restablecer el estado de guardado al editar
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
      {/* seccion que debe implementarse en la los item 4  */}
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
      {/* )} */}

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
          id={`descripcion_perfiles_tecnicos_${title
            .toLowerCase()
            .replace(' ', '_')}`}
          label={`Descripción de perfiles técnicos ${title}`}
          placeholder={`Describe los perfiles técnicos ${title.toLowerCase()} necesarios`}
          maxLength={300}
          value={descripcion}
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
