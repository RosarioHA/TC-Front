import CustomTextarea from '../../forms/custom_textarea';

export const FichaInformatico = () => {
  return (
    <>
      <div>
        <div className="pe-5 me-5 mt-4 col-12">
          <span className="my-4 text-sans-h4">
            a. Ficha de sistemas informáticos
          </span>
          <div className="text-sans-h6-primary my-3 col-11">
            <h6>
              Tomando como base la informacion aportada por el Ministerio o
              Servicio de origen, agregue todas aquellas fichas técnicas de
              programas o softwares requeridos y que el Gobierno Regional no
              posee:
            </h6>
          </div>
          <div className="col-10 mt-5 mb-3 border-bottom">
            <div className="d-flex flex-row col">
              <div className="mt-2 me-3">1</div>
              <div className="my-2 col-3 text-sans-p-bold">
                Nombre de Plataforma o Sofware
              </div>
              <div className="mb-2 pt-3 col ms-3">
                <CustomTextarea placeholder="Escribe el nombre de la plataforma o software" />
              </div>
            </div>
            <div className="d-flex flex-row col">
              <div className="my-3 col-3 pe-2 ms-4 me-3 text-sans-p-bold">
                Descripción técnica y versiones
              </div>
              <div className="my-3 col">
                <CustomTextarea placeholder="Indice la versión y una descripción técnica del software o plataforma" />
              </div>
            </div>
            <div className="d-flex flex-row col">
              <div className="my-3 col-3 pe-2 ms-4 me-3 text-sans-p-bold">
                Costo
              </div>
              <div className="d-flex flex-row col">
                <div className="my-3 col-5">
                  <CustomTextarea
                    placeholder="Costo del recurso"
                    descripcion="Campo númerico en miles de pesos."
                  />
                </div>
                <div className="d-flex col-11 mb-5 mt-3">
                  <div className="border border-1 col-3  py-3">
                    <span className="text-sans-p-grayc mx-4">Subtitulo</span>
                  </div>
                  <div className="border border-1 col-3 py-3 ms-3">
                    <span className="text-sans-p-grayc mx-3">Item</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-row col">
              <div className="my-3 col-3 pe-2 ms-4 me-3 text-sans-p-bold">
                Función en el ejercicio de la competencia identificando perfiles
                de usuario
              </div>
              <div className="my-3 col">
                <CustomTextarea placeholder="Describe la función en el ejercicio de la competencia y los perfiles de usuario" />
              </div>
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button className="btn-terciario-ghost ms-2 mb-2">
                <i className="material-symbols-rounded me-2">delete</i>
                <p className="mb-0 text-decoration-underline">Borrar ficha</p>
              </button>
            </div>
          </div>
          <div>
            <button className="btn-secundario-s m-2" type="submit">
              <i className="material-symbols-rounded me-2">add</i>
              <p className="mb-0 text-decoration-underline">
                Agregar ficha técnica
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
