import CustomTextarea from "../../forms/custom_textarea";
import { DropdownSelectSimple } from "../../dropdown/selectSimple";

export const IndicadoresDesempeno = () => {
    return (
        <div className="mb-4 col-11">
            <h4 className="text-sans-h4 mb-3"> 4.5a Indicadores de desempeño </h4>
            <div className="mx-1 border row">
              <div className="border-end col-1 p-3"> 1</div>
              <div className="border col-11">
                <div className="row">
                  <div className="row py-3">
                    <div className="col-5 ps-4">
                      <p className="text-sans-p-bold mb-0">Tipo de indicador</p>
                      <p className="text-sans-h6 mb-0">(Obligatorio)</p>
                    </div>
                    <div className="col ps-4">
                      <p className="text-sans-p-bold mb-0">Nombre del indicador</p>
                      <p className="text-sans-h6 mb-0">(Obligatorio)</p>
                    </div>
                  </div>
                  <div className="row neutral-line m-0 py-3">
                    <div className="col-5">
                      <DropdownSelectSimple/>
                    </div>
                    <div className="col">
                      <CustomTextarea
                      placeholder="Nombre del indicador"
                      maxLength="300"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="row py-3">
                  <div className="col-5 ps-4">
                      <p className="text-sans-p-bold mb-0">Tipo de Cálculo</p>
                      <p className="text-sans-h6 mb-0">(Obligatorio)</p>
                    </div>
                    <div className="col ps-4">
                      <p className="text-sans-p-bold mb-0">Fórmula del indicador</p>
                      <p className="text-sans-h6 mb-0">(Obligatorio)</p>
                    </div>
                  </div>
                  <div className="row neutral-line m-0 py-3">
                    <div className="col-5">
                      <DropdownSelectSimple/>
                    </div>
                    <div className="col">
                      COMPONENTE QUE CAMBIA SEGUN SELECCION
                    </div>
                  </div>
                </div>

                <div className="row mt-3 py-3">
                  <CustomTextarea
                  label="Verificador (Obligatorio)"
                  placeholder="Describe el indicador de desempeño"
                  maxLength="300"/>
                </div>
              </div>
            </div>
          </div>

    );
};