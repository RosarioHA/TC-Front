import CustomInput from "../../forms/custom_input";
import InputCosto from "../../forms/input_costo";
export const AgregarPersonal = ({solo_lectura}) =>
{

  return (
    <>
      <div>
        <form onSubmit="">
            <div key="">

              <div>
                <span className="text-sans-p-bold mt-4">Calidad Jurídica: </span>
                <span></span>
              </div>
              {/* Encabezado para cada grupo */}
              <div className="row mt-3">
                <div className="col-1"> <p className="text-sans-p-bold">N°</p> </div>
                <div className="col"> <p className="text-sans-p-bold">Estamento</p> </div>
                <div className="col"> <p className="text-sans-p-bold">Renta bruta mensual ($M)</p> </div>
                <div className="col"> <p className="text-sans-p-bold">Grado <br /> (Si corresponde)</p> </div>
                {!solo_lectura && (
                  <div className="col"> <p className="text-sans-p-bold">Acción</p> </div>
                )}
              </div>

                <div
                  key={persona.id}
                  className={`row py-3 ${personaIndex % 2 === 0 ? 'white-line' : 'neutral-line'} align-items-center me-3`}>

                  <div className="col-1"> <p className="text-sans-p-bold mt-3">{personaIndex + 1}</p> </div>
                  <div className="col">
                    <Controller
                      control={control}
                      name={`estamento_${persona.id}`}
                      render={({ field }) =>
                      {
                        return (
                          <DropdownSelect
                            id={`estamento_${persona.id}`}
                            name={`estamento_${persona.id}`}
                            placeholder="Estamento"
                            options={opcionesEstamentos}
                            onSelectionChange={(selectedOption) =>
                            {
                              handleSave(persona.id, 'estamento', selectedOption);
                              field.onChange(selectedOption.value);
                            }}

                            readOnly={solo_lectura}
                            selected={persona.estamento_label_value}
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="col pt-3">
                    <Controller
                      control={control}
                      name={`renta_bruta_${persona.id}`}
                      defaultValue={persona?.renta_bruta || ''}
                      render={({ field }) =>
                      {
                        // Destructura las propiedades necesarias de field
                        const { onChange, onBlur, value } = field;

                        const handleChange = (valor) =>
                        {
                          clearErrors(`renta_bruta_${persona.id}`);
                          onChange(valor);
                          handleInputChange(persona.id, 'renta_bruta', valor);
                        };

                        // Función para manejar el evento onBlur
                        const handleBlur = async () =>
                        {
                          const isFieldValid = await trigger(`renta_bruta_${persona.id}`);
                          if (isFieldValid)
                          {
                            handleSave(persona.id, 'renta_bruta');
                          }
                          onBlur();
                        };

                        return (
                          <InputCosto
                            id={`renta_bruta_${persona.id}`}
                            placeholder="Renta bruta (M$)"
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            loading={persona.estados?.renta_bruta?.loading ?? false}
                            saved={persona.estados?.renta_bruta?.saved ?? false}
                            error={errors[ `renta_bruta_${persona.id}` ]?.message}
                            disabled={solo_lectura}
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="col pt-3">
                    <Controller
                      control={control}
                      name={`grado_${persona.id}`}
                      defaultValue={persona?.grado || ''}
                      render={({ field }) =>
                      {
                        // Destructura las propiedades necesarias de field
                        const { onChange, onBlur, value } = field;

                        const handleChange = (valor) =>
                        {
                          clearErrors(`grado_${persona.id}`);
                          onChange(valor);
                          handleInputChange(persona.id, 'grado', valor);
                        };

                        // Función para manejar el evento onBlur
                        const handleBlur = async () =>
                        {
                          const isFieldValid = await trigger(`grado_${persona.id}`);
                          if (isFieldValid)
                          {
                            handleSave(persona.id, 'grado');
                          }
                          onBlur();
                        };

                        return (
                          <CustomInput
                            id={`grado_${persona.id}`}
                            placeholder="Grado"
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            loading={persona.estados?.grado?.loading ?? false}
                            saved={persona.estados?.grado?.saved ?? false}
                            error=""
                            disabled={solo_lectura}
                          />
                        );
                      }}
                    />
                  </div>

                  {!solo_lectura && (
                    <div className="col">
                      <button
                        className="btn-terciario-ghost"
                        
                      >
                        <i className="material-symbols-rounded me-2">delete</i>
                        <p className="mb-0 text-decoration-underline">Borrar</p>
                      </button>
                    </div>
                  )}
                </div>
              ))}



              {!solo_lectura && (
                <button
                  className="btn-secundario-s m-2"
                  
                >
                  <i className="material-symbols-rounded me-2">add</i>
                  <p className="mb-0 text-decoration-underline">Agregar</p>
                </button>
              )}

            </div>
        </form>
      </div >
    </>
  )
}
