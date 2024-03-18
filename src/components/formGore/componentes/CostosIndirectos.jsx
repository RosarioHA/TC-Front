import CustomTextarea from "../../forms/custom_textarea";
import InputCosto from "../../forms/input_costo";
import { OpcionesAB } from "../../forms/opciones_AB";
import { Monto } from "./MOnto";

export const CostosIndirectosSector = ({ costosIndirectos }) =>
{
  return (
    <>
      <div className="mt-4 col-11">
        <div className="col-12">
        <div className="subrayado">
          <span className="py-2 my-2 align-self-center">$nombreSector</span>
        </div>
          {costosIndirectos?.map((costo) => (
            <div className="col d-flex flex-column justify-content-between my-5 col-10" key={costo.id}>
              <div className="d-flex flex-row">
                <div className="col-4">
                  <p className="text-sans-p-bold">Subtítulo </p>
                  <div className="border border-1 col-4 py-4 px-3">
                    <span className="text-sans-p-grayc">{costo.subtitulo_label_value.label}</span>
                  </div>
                </div>
                <div className="col-6">
                  <p className="text-sans-p-bold">Item</p>
                  <div className="border border-1 col-6 py-3 px-2">
                    <span className="text-sans-p-grayc">
                      {costo.item_subtitulo_label_value.label}</span>
                  </div>
                </div>
                <div className="col-5 pe-2">
                  <p className="text-sans-p-bold">Total Anual ($M) <br /> informado por el sector</p>

                  <div className="border-gris col-6 py-2 px-3">
                    ${costo.total_anual_sector}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row my-3 col-10">
                <div className="col-4">
                  <p className="text-sans-p-bold mb-3">
                    Total Anual ($M) informado por GORE</p>
                  <InputCosto
                    id=""
                    placeholder="Costo (M$)"
                    value=""
                    onChange=''
                    onBlur=""
                    loading=""
                    saved=''
                    error=''
                    disabled=''
                  />
                </div>
                <div className="col-6 ms-5 ps-3">
                  <p className="text-sans-p-bold">¿Es transitorio?</p>
                  <OpcionesAB
                    id=""
                    readOnly=""
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
                    fieldName=""

                  />
                </div>
                <div className="col-5 ms-2">
                  <Monto monto={costo.total_anual_sector}/>
                </div>

              </div>
              <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
                <i className="material-symbols-rounded me-2">info</i>
                <h6 className="mt-0">
                  Si no se hará uso del costo informado por el sector, llena con un 0.
                </h6>
              </div>
              <div className="mx-2">
                <CustomTextarea
                  label="Descripción"
                  placeholder="Describe el costo por subtítulo e ítem"
                  name=""
                  maxLength={500}
                  value=""
                  onChange=""
                  onBlur=""
                  loading=""
                  saved=""
                />
              </div>
              <hr className="col-12" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}