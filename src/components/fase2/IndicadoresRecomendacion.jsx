// import { useState } from "react";
import DropdownSelect from "../fase1/dropdown/select";
import CustomTextarea from "../forms/custom_textarea";
// import CustomInput from "../forms/custom_input";

const IndicadoresRecomendacion = () =>
{

  return (
    <div className="row border">
      <div className="col-1 border-end">
        {/* tiene que ser dinamico */}
        <p className="mt-2">1</p>
      </div>
      <div className="col">
        <div className="row py-2">
          <div className="col-3">
            <p className="mt-2 ms-2 text-sans-p"> <strong> Tipo de Indicador</strong> <br /> (Obligatorio)</p>
          </div>
          <div className="col">
            <p className="mt-2 ms-2 text-sans-p"> <strong> Nombre del indicador</strong> <br /> (Obligatorio)</p>
          </div>
        </div>

        <div className="row neutral-line py-2">
          <div className="col-3">
            <DropdownSelect
              placeholder="Tipo de indicador" />
          </div>
          <div className="col">
            <CustomTextarea
              maxLength={300}
            />
          </div>
        </div>

        <div className="row py-2">
          <div className="col-3">
            <p className="mt-2 ms-2 text-sans-p"> <strong>Tipo de Cálculo</strong> <br /> (Obligatorio)</p>
          </div>
          <div className="col">
            <p className="mt-2 ms-2 text-sans-p"> <strong>Fórmula del indicador</strong> <br /> (Obligatorio)</p>
          </div>
        </div>

        <div className="row neutral-line py-2">
          <div className="col-3">
            <DropdownSelect
              placeholder="Tipo de cálculo" />
          </div>
          <div className="col">
            {/* aqui hay una condicional segun la eleccion del usuario en tipo de calculo */}
            <p className="py-4 mb-0 ms-2 text-sans-h6-primary">Debes elegir el tipo de cálculo para definir la fórmula del indicador.</p>
          </div>
        </div>

        <div className="row pb-3 pt-4 mt-1">
          <CustomTextarea
            label="Verificador (Obligatorio)"
            placeholder="Describe el indicador de desempeño"
            maxLength={300}
          />
        </div>

      </div>
    </div>
  )
};

export default IndicadoresRecomendacion;