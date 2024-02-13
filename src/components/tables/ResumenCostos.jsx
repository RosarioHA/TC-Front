import { useState, useContext, useEffect } from "react";
import CustomTextarea from "../forms/custom_textarea";
import { FormularioContext } from "../../context/FormSectorial";
import { apiTransferenciaCompentencia } from "../../services/transferenciaCompetencia";
import { useForm, Controller } from "react-hook-form";

const ResumenCostos = ({
  id,
  data,
  costosTotales,
  descripcionCostosTotales,
  stepNumber,
  formulario_enviado,
  refreshSumatoriaCostos,
  setRefreshSumatoriaCostos,
}) => {

  const initialState = data?.map(item => ({
    ...item,
    estados: {
      descripcion: { loading: false, saved: false }
    }
  }));

  const [ResumenCostos, setResumenCostos] = useState(() => { return Array.isArray(data) ? data : []; });
  const [dataDirecta, setDataDirecta] = useState(null);
  const { handleUpdatePaso } = useContext(FormularioContext);
  const [descripcionCostosTotalesLoading, setDescripcionCostosTotalesLoading] = useState(false);
const [descripcionCostosTotalesSaved, setDescripcionCostosTotalesSaved] = useState(false);


  const { control, trigger, clearErrors, setValue } = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    // Verifica si descripcionCostosTotales tiene un valor y actualiza el campo correspondiente
    if (descripcionCostosTotales) {
      setValue("descripcionCostosTotales", descripcionCostosTotales);
    }
  }, [descripcionCostosTotales, setValue]);

  // Llamada para recargar componente
  const fetchDataDirecta = async () => {
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
      setDataDirecta(response.data);
    } catch (error) {
      console.error('Error al obtener datos directamente:', error);
    }
  };

  useEffect(() => {
    if (refreshSumatoriaCostos) {
      fetchDataDirecta();
      setRefreshSumatoriaCostos(false);
    }
  }, [refreshSumatoriaCostos, id, stepNumber]);


  useEffect(() => {
    if (dataDirecta && dataDirecta.paso5) {
      setResumenCostos(dataDirecta.p_5_1_c_resumen_costos_por_subtitulo || '0');
    }
  }, [dataDirecta]);

  // Función para recargar campos por separado
  const updateFieldState = (instanciaId, fieldName, newState) => {
    setResumenCostos(previnstancia =>
      previnstancia.map(instancia => {
        if (instancia.id === instanciaId) {
          // Actualiza solo los estados del campo específico
          const updatedEstados = { ...instancia.estados, [fieldName]: { ...newState } };
          return { ...instancia, estados: updatedEstados };
        }
        return instancia;
      })
    );
  };

  // Manejadora de CustomInput y CustomTextArea
  const handleInputChange = (instanciaId, campo, valor) => {
    setResumenCostos(prevInstancia =>
      prevInstancia.map(elemento => {
        // Verifica si es la costo que estamos actualizando
        if (elemento.id === instanciaId) {
          // Actualiza el valor del campo específico de manera inmutable
          return { ...elemento, [campo]: valor };
        }
        // Si no es la costo que estamos actualizando, la retorna sin cambios
        return elemento;
      })
    );
  };

  // Función de guardado
  const handleSave = async (arrayNameId, fieldName, fieldValue) => {
    // Si se está guardando por blur, no es necesario desactivar el botón de guardar general

    const resumenSubtitulo = ResumenCostos.find(e => e.id === arrayNameId);

    updateFieldState(arrayNameId, fieldName, { loading: true, saved: false });

    let payload;
    // Payload para otros campos

    if (fieldName === 'descripcion') {
      payload = {
        'p_5_1_c_resumen_costos_por_subtitulo': [{ id: arrayNameId, [fieldName]: resumenSubtitulo[fieldName] }]
      };
    } else {
      // Payload para otros campos
      setDescripcionCostosTotalesLoading(true);
      setDescripcionCostosTotalesSaved(false);
      payload = {
        'paso5': { "descripcion_costos_totales": fieldValue }
      };
    }

    try {
      // Asume que handleUpdatePaso puede manejar ambos casos adecuadamente
      await handleUpdatePaso(id, stepNumber, payload);

      // Actualiza el estado de carga y guardado
      updateFieldState(arrayNameId, fieldName, { loading: false, saved: true });
      setDescripcionCostosTotalesLoading(false);
      setDescripcionCostosTotalesSaved(true);

    } catch (error) {
      console.error("Error al guardar los datos:", error);

      updateFieldState(arrayNameId, fieldName, { loading: false, saved: false });
      setDescripcionCostosTotalesLoading(false);
      setDescripcionCostosTotalesSaved(false);
    }
  };


  return (
    <div>
      {/* Encabezado */}
      <div className="ps-3 my-4">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="col-2">
            <p className="text-sans-p-bold mb-0 mt-1">Subtítulo</p>
          </div>
          <div className="col">
            <p className="text-sans-p-bold mb-0 mt-1">Total Anual (M$)</p>
          </div>
          <div className="col-7 d-flex">
            <p className="text-sans-p-bold mb-0 mt-1">Descripción</p>
            <p className="text-sans-p ms-2 mb-0">(Opcional)</p>
          </div>
        </div>

        {/* filas, se tienen que generar dinamicamente segun los costos elegidos en a. y b., enumerados por subtitulo */}
        {ResumenCostos.map((subtitulo, index) => (
          <div
            key={subtitulo.id}
            className={`row ${index % 2 === 0 ? 'neutral-line' : 'white-line'} align-items-center me-3`}>
            <div className="d-flex justify-content-between py-3 fw-bold">
              <div className="col-2">
                <p className="text-sans-p-bold mb-0 mt-3 ms-4">{subtitulo.nombre_subtitulo}</p>
              </div>
              <div className="col">
                <p className="text-sans-p-bold mb-0 mt-3 ms-5">{subtitulo.total_anual}</p>
              </div>
              <div className="col-7 ps-2 d-flex">
                <Controller
                  control={control}
                  name={`descripcion_${subtitulo.id}`}
                  defaultValue={subtitulo?.descripcion || ''}
                  render={({ field }) => {
                    // Destructura las propiedades necesarias de field
                    const { onChange, onBlur, value } = field;

                    const handleChange = (e) => {
                      clearErrors(`descripcion_${subtitulo.id}`);
                      onChange(e.target.value);
                      handleInputChange(subtitulo.id, 'descripcion', e.target.value);
                    };

                    // Función para manejar el evento onBlur
                    const handleBlur = async () => {
                      const isFieldValid = await trigger(`descripcion_${subtitulo.id}`);
                      if (isFieldValid) {
                        handleSave(subtitulo.id, 'descripcion');
                      }
                      onBlur();
                    };

                    return (
                      <CustomTextarea
                        id={`descripcion_${subtitulo.id}`}
                        placeholder="Describe el costo por subtítulo."
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        loading={subtitulo.estados?.descripcion?.loading ?? false}
                        saved={subtitulo.estados?.descripcion?.saved ?? false}
                        readOnly={formulario_enviado}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <div className={`row ${ResumenCostos.length % 2 === 0 ? 'neutral-line' : 'white-line'} align-items-center me-3`}>
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="col-2">
              <p className="text-sans-p-bold mb-0 mt-3 ms-4">Costos <br /> totales</p>
            </div>
            <div className="col">
              {/* sumatoria de los valores de todos los subtitulos de la tabla */}
              <p className="text-sans-p-bold mb-0 mt-3 ms-5">{costosTotales}</p>
            </div>
            <div className="col-7 ps-2 d-flex">
              <Controller
                control={control}
                name="descripcionCostosTotales"
                defaultValue={descripcionCostosTotales || ''}
                render={({ field }) => {
                  // Destructura las propiedades necesarias de field
                  const { onChange, onBlur, value } = field;

                  const handleChange = (e) => {
                    clearErrors("descripcionCostosTotales");
                    onChange(e.target.value);
                    handleInputChange('descripcion_costos_totales', e.target.value);
                  };

                  // Función para manejar el evento onBlur
                  const handleBlur = async () => {
                    const isFieldValid = await trigger("descripcionCostosTotales");
                    if (isFieldValid) {
                      handleSave(null, 'descripcion_costos_totales', value);
                    }
                    onBlur();
                  };

                  return (
                    <CustomTextarea
                      id="descripcionCostosTotales"
                      name="descripcionCostosTotales"
                      placeholder="Describe el costo total."
                      value={value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      loading={descripcionCostosTotalesLoading}
                      saved={descripcionCostosTotalesSaved}
                      readOnly={formulario_enviado}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
};

export default ResumenCostos;
