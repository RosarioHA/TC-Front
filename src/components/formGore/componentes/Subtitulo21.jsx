import CustomTextarea from '../../forms/custom_textarea';
export const Subtitulo21 = () => {
  return (
    <>
      <div className=" mt-4 col-11">
        <div className="subrayado col-12">
          <span className="py-2 my-2 align-self-center">
            Subtítulo 21 - Gastos en Personal informados por el $nombreSector
          </span>
        </div>
        <div className="text-sans-h6-primary my-3 col-12">
          <h6>
            En caso de requerir subtítulos adicionales puedes agregarlos a
            continuación. Deberás justificarlos en el siguiente paso. En el paso
            3 podrás elegir al personal de comisión de servicio que necesites.
          </h6>
        </div>
        <div
          className="col d-flex flex-column justify-content-between my-5 col-11"
          key=""
        >
          <div className="d-flex flex-row">
            <div className="col-4">
              <p className="text-sans-p-bold">Subtítulo </p>
              <div className="border border-1 col-4 py-4 px-3">
                <span className="text-sans-p-grayc">sub. 21</span>
              </div>
            </div>
            <div className="col-6">
              <p className="text-sans-p-bold">Item</p>
              <div className="border border-1 col-6 py-3 px-2">
                <span className="text-sans-p-grayc">
                  02 - Textiles, Vestuario y Calzado
                </span>
              </div>
            </div>
            <div className="col-5 pe-2">
              <p className="text-sans-p-bold">
                Total Anual ($M) <br /> informado por el sector
              </p>
              <div className="border-gris col-5 py-2 px-3">$300</div>
            </div>
          </div>
          <div  className="d-flex flex-row mt-4">
            <div className="col-12">
              <CustomTextarea
                label="Descripción"
                placeholder="Describe el costo por subtítulo e ítem"
                name="descripcion"
                value=""
              />
            </div>
          </div>
          <hr/>
        </div>
      </div>
    </>
  );
};
