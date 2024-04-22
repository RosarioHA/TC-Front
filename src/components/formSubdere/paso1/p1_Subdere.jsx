import { useContext, useState } from "react";
import { FormSubdereContext } from "../../../context/RevisionFinalSubdere";
import { useAmbitos } from "../../../hooks/useAmbitos";
import { useForm, Controller } from "react-hook-form";
import DropdownSelect from "../../dropdown/select";


export const AmbitoDefinitivo = ({ ambito_definitivo_competencia, solo_lectura }) =>
{
  const { updatePasoSubdere } = useContext(FormSubdereContext);
  const { ambitos } = useAmbitos();
  const [ ambitoSeleccionado, setAmbitoSeleccionado ] = useState('');
  const [ setInputStatus ] = useState({
    ambito_definitivo_competencia: { loading: false, saved: false }
  });

  const {
    control,
    setValue,
  } = useForm({
    mode: 'onBlur',
  });


  //opciones ambito
  const opcionesAmbito = ambitos.map(ambito => ({
    label: ambito.nombre,
    value: ambito.id,
  }));


  const handleAmbitoChange = async (selectedOption) =>
  {
    setAmbitoSeleccionado(selectedOption.value);
    setValue('ambito_competencia', selectedOption.value);

    // Construye el payload basado en el valor seleccionado
    const payload = {
      ambito_definitivo_competencia: { "id": selectedOption.value }
    };

    try
    {
      // Llama a updatePasoSubdere con el payload
      await updatePasoSubdere(payload);
      // actualizar el estado para indicar que el guardado fue exitoso
      setInputStatus(prevStatus => ({
        ...prevStatus,
        ambito_definitivo_competencia: { loading: false, saved: true },
      }));
    } catch (error)
    {
      // Manejo de error
      console.error("Error al actualizar el ámbito definitivo", error);
      // Actualizar el estado para reflejar que hubo un error
      setInputStatus(prevStatus => ({
        ...prevStatus,
        ambito_definitivo_competencia: { loading: false, saved: false },
      }));
    }
  };


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

          <div className="mb-4 col-11">
            <Controller
              name="ambito_competencia"
              control={control}
              render={() => (
                <DropdownSelect
                  id="ambito_competencia"
                  label="Elige el ámbito de la competencia (Obligatorio)"
                  placeholder={ambito_definitivo_competencia?.nombre || "Elige el ámbito de la competencia"}
                  name="ambito_competencia"
                  options={opcionesAmbito}
                  onSelectionChange={handleAmbitoChange}
                  selected={ambitoSeleccionado}
                  readOnly={solo_lectura}
                />
              )} />
          </div>
        </div>
      </div>
    </>
  );
};