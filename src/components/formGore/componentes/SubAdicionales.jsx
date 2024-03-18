import DropdownSelect from '../../dropdown/select';
import InputCosto from '../../forms/input_costo';
import DropdownCheckbox from '../../dropdown/checkbox';
import CustomTextarea from '../../forms/custom_textarea';
import { OpcionesAB } from '../../forms/opciones_AB';

export const SubAdicionales = ({ solo_lectura , titulo}) => {
  return (
    <>
      <div className="mt-4 col-11">
        <div className="subrayado col-12">
          <span className="py-2 my-2 align-self-center">
            {titulo}
          </span>
        </div>
        <div className="text-sans-h6-primary my-3 col-12">
          <h6>
            En caso de requerir subtítulos adicionales puedes agregarlos a
            continuación. Deberás justificarlos en el siguiente paso. En el paso
            3 podrás elegir al personal de comisión de servicio que necesites.
          </h6>
        </div>
        <div>
          <form onSubmit="">
            <div key="" className="col mt-4">
              <div className="row">
                <span className="text-sans-p-bold mb-0"></span>
                <div className="col d-flex flex-column justify-content-between">
                  <p className="text-sans-p-bold">Subtítulo</p>

                  <DropdownSelect
                    id=""
                    name=""
                    placeholder="Subtítulos"
                    options=""
                    onSelectionChange=""
                    readOnly=""
                    selected=""
                    loading=""
                    saved=""
                    error=""
                  />
                </div>

                <div className="col border-end  d-flex flex-column justify-content-between">
                  <p className="text-sans-p-bold">Item</p>

                  <DropdownSelect
                    id=""
                    name=""
                    placeholder="Ítem"
                    options=""
                    onSelectionChange=""
                    readOnly=""
                    selected=""
                    loading=""
                    saved=""
                    error=""
                  />
                </div>
                <div className="col d-flex flex-column justify-content-between border-end pe-4">
                  <div>
                    <p className="text-sans-p-bold mb-0">Total Anual</p>
                    <p className="mb-0">($M)</p>
                  </div>

                  <InputCosto
                    id=""
                    placeholder="Costo (M$)"
                    value=""
                    onChange=""
                    onBlur=""
                    loading=""
                    saved=""
                    error=""
                    disabled={solo_lectura}
                  />
                </div>

                <div className="col d-flex flex-column justify-content-between border-end">
                  <div>
                    <p className="text-sans-p-bold mb-0">Etapa</p>
                    <p className="">(Opcional)</p>
                  </div>
                  <div className="ps-2">
                    <DropdownCheckbox
                      id=""
                      name=""
                      placeholder="Etapa"
                      options=""
                      onSelectionChange=""
                      readOnly=""
                      selectedValues=""
                      loading=""
                      saved=""
                    />
                  </div>
                </div>

                <div className="col d-flex flex-column justify-content-between">
                  <p className="text-sans-p-bold">¿Es transversal?</p>

                  <OpcionesAB
                    id=""
                    readOnly={solo_lectura}
                    initialState=""
                    handleEstadoChange=""
                    loading=""
                    saved=""
                    error=""
                    altA="Si"
                    altB="No"
                    field=""
                    handleSave=""
                    arrayNameId=""
                    fieldName="es_transversal"
                  />
                </div>
              </div>

              <div className="row pe-3 mt-4">
                <CustomTextarea
                  id=""
                  label="Descripción"
                  placeholder="Describe el costo por subtítulo e ítem."
                  maxLength=""
                  value=""
                  onChange=""
                  onBlur=""
                  loading=""
                  saved=""
                  error=""
                  readOnly={solo_lectura}
                />
              </div>

              <div className="d-flex justify-content-end me-2">
                {!solo_lectura && (
                  <div className="">
                    <button className="btn-terciario-ghost mt-3" onClick="">
                      <i className="material-symbols-rounded me-2">delete</i>
                      <p className="mb-0 text-decoration-underline">
                        Borrar subtítulo
                      </p>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {!solo_lectura && (
              <button className="btn-secundario-s m-2" type="submit">
                <i className="material-symbols-rounded me-2">add</i>
                <p className="mb-0 text-decoration-underline">
                  Agregar subtítulo
                </p>
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
