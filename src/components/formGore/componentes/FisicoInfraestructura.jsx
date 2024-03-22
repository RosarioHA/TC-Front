import DropdownSelect from '../../dropdown/select';
import CustomTextarea from '../../forms/custom_textarea';

export const FisicoInfraestructura = () => {
  return (
    <>
      <div>
        <div className="pe-5 me-5 mt-5 col-12">
          <span className="my-4 text-sans-h4">
            b. Recursos físicos e infraestructura
          </span>
          <div className="text-sans-h6-primary my-3 col-11">
            <h6>
              Tomando como base la informacion aportada por el Ministerio o
              Servicio de origen, agregue todas aquellas fichas técnicas de
              programas o softwares requeridos y que el Gobierno Regional no
              posee:
            </h6>
          </div>
          <div className="col-10 my-5 border ">
            <div className="row">
              <div className="col-3 border-end d-flex justify-content-between flex-column">
                <div className="my-5 mx-3 pb-5">
                  <DropdownSelect placeholder="Subtítulo" />
                </div>
                <div className="my-5 mx-3 pt-5">
                  <DropdownSelect placeholder="Item" />
                </div>
              </div>
              <div className="col-9 mt-5">
                <div className="mb-2 d-flex">
                  <div className="mx-3 my-3">1</div>
                  <div className="my-3 ms-3 col-9 " >
                    <CustomTextarea
                      label="Cantidad"
                      placeholder="Cantidad del recurso seleccionado"
                      descripcion="Campo númerico en miles de pesos."
                    />
                  </div>
                </div>
                <div className="my-3 col-6 ms-5 ps-2">
                  <CustomTextarea
                    label="Costo total (M$)"
                    placeholder="Costo del recurso"
                    descripcion="Campo númerico en miles de pesos."
                  />
                </div>
                <div className="mt-5 mb-3 col-9 ms-5 ps-2">
                  <CustomTextarea
                    label="Fundamentación"
                    placeholder="Fundamentos del uso y cantidad de este recurso."
                    maxLength={300}
                  />
                </div>
                <div className="col-12 d-flex flex-row-reverse">
                  <button className="btn-terciario-ghost ms-2 mb-2 me-3">
                    <i className="material-symbols-rounded me-2">delete</i>
                    <p className="mb-0 text-decoration-underline">
                      Borrar
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button className="btn-secundario-s m-" type="submit">
            <i className="material-symbols-rounded me-2">add</i>
            <p className="mb-0 text-decoration-underline">Agregar Recurso</p>
          </button>
        </div>
      </div>
    </>
  );
};
