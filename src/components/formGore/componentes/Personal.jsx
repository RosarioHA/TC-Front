import DropdownSelect from "../../dropdown/select"

export const Personal = () =>
{
  return (
    <div>

      {mostrarFormularioNuevo && (
        <>
          <p>Primero elige la calidad jurídica que quieres agregar:</p>
          <div className="row">
            <div className="col-1">
              <p className="text-sans-p-bold mt-3">Calidad Jurídica</p>
            </div>
            <div className="col-2">
              <DropdownSelect
                placeholder="Calidad Jurídica"
                options={opcionesCalidadJuridica}
                onSelectionChange={manejarDropdownCalidadJuridica}
              />
            </div>
          </div>
        </>
      )}

      {/* {mostrarBotonFormulario && !solo_lectura && ( */}
        <button className="btn-secundario-s m-2">
          <i className="material-symbols-rounded me-2">add</i>
          <p className="mb-0 text-decoration-underline">
            Agregar Calidad Juridica
          </p>
        </button>
      {/* )} */}

      <div className="mt-5">

              <CustomTextarea
                id={`descripcion_funciones_personal_directo`}
                label="Descripción de funciones"
                placeholder="Describe las funciones asociadas a otras competencias."
                maxLength=""
                value=""
                onChange=""
                onBlur=""
                loading=""
                saved=""
                error=""
                // readOnly={solo_lectura}
              />
        <div className="d-flex text-sans-h6-primary">
          <i className="material-symbols-rounded me-2">info</i>
          <h6>
            En el caso de que los/as funcionarios/as identificados/as realicen
            funciones asociadas a otras competencias, describa brevemente sus
            características, y si existe relación entre ellas y el ejercicio de
            la competencia en estudio.
          </h6>
        </div>
      </div>
    </div>
  )
}
