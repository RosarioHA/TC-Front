import { useContext, useState, useEffect } from "react";
import { FormSubdereContext } from "../../../context/RevisionFinalSubdere";
import { useAmbitos } from "../../../hooks/useAmbitos";
import { useForm, Controller } from "react-hook-form";
import DropdownSelect from "../../dropdown/select";

export const AmbitoDefinitivo = ({ ambito_definitivo_competencia, solo_lectura }) => {
  const { updatePasoSubdere } = useContext(FormSubdereContext);
  const { ambitos } = useAmbitos();
  const [ambitoSeleccionado, setAmbitoSeleccionado] = useState('');
  const [inputStatus, setInputStatus] = useState({
    ambito_definitivo_competencia: { loading: false, saved: false }
  });

  const {
    control,
    setValue,
  } = useForm({
    mode: 'onBlur',
  });

  // Inicializa el valor seleccionado del ámbito basándose en los datos de la base de datos
  useEffect(() => {
    if (ambito_definitivo_competencia && ambito_definitivo_competencia.id) {
      setAmbitoSeleccionado(ambito_definitivo_competencia.id);
      setValue('ambito_competencia', ambito_definitivo_competencia.id);
    }
  }, [ambito_definitivo_competencia, setValue]);

  const handleAmbitoChange = async (selectedOption) => {
    setAmbitoSeleccionado(selectedOption.value);
    setValue('ambito_competencia', selectedOption.value);

    const payload = {
      ambito_definitivo_competencia: { "id": selectedOption.value }
    };

    try {
      await updatePasoSubdere(payload);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        ambito_definitivo_competencia: { loading: false, saved: true },
      }));
    } catch (error) {
      console.error("Error al actualizar el ámbito definitivo", error);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        ambito_definitivo_competencia: { loading: false, saved: false },
      }));
    }
  };

  // Opciones para el ámbito
  const opcionesAmbito = ambitos.map(ambito => ({
    label: ambito.nombre,
    value: ambito.id,
  }));

  return (
    <>
      <div className="col-11">
        <div className="container container-xxl-fluid">
          <h4 className="text-sans-h4">
            1. Ámbito definitivo de la competencia:
          </h4>
          <div className="text-sans-h6-primary my-3 col-11">
            <h6>
              El ámbito que selecciones será el ámbito que se asociará a la competencia.
            </h6>
          </div>
          <div className="mb-4 d-flex col-12">
            <Controller
              name="ambito_competencia"
              control={control}
              render={() => (
                <DropdownSelect
                  id="ambito_competencia"
                  label="Elige el ámbito de la competencia (Obligatorio)"
                  placeholder="Elige el ámbito de la competencia"
                  name="ambito_competencia"
                  options={opcionesAmbito}
                  onSelectionChange={handleAmbitoChange}
                  selected={ambitoSeleccionado}
                  readOnly={solo_lectura}
                />
              )}
            />
            <div className="col-1 mx-3 my-auto">
              {inputStatus.ambito_definitivo_competencia.loading && <div className="spinner-border text-primary" role="status"></div>}
              {inputStatus.ambito_definitivo_competencia.saved && <i className="material-symbols-outlined text-success">check</i>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
