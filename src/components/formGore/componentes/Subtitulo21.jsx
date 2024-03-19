import React from 'react';
import CustomTextarea from '../../forms/custom_textarea';

export const Subtitulo21 = ({ personal }) => {
  return (
    <>
      <div className="mt-4 col-11">
        {Array.isArray(personal) && personal.map((sectorData) => (
          <React.Fragment key={sectorData.sector}>
            <div className="subrayado col-12">
              <span className="py-2 my-2 align-self-center">
                Subtítulo 21 - Gastos en Personal informados por {sectorData.sector}
              </span>
            </div>
            {sectorData.items.map((item) => (
              <div
                className="col d-flex flex-column justify-content-between my-5 col-11"
                key={item.id}
              >
                <div className="d-flex flex-row">
                  <div className="col-4">
                    <p className="text-sans-p-bold">Subtítulo </p>
                    <div className="border border-1 col-4 py-4 px-3">
                      <span className="text-sans-p-grayc">{item.subtitulo_label_value.label}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <p className="text-sans-p-bold">Item</p>
                    <div className="border border-1 col-6 py-3 px-2">
                      <span className="text-sans-p-grayc">{item.item_subtitulo_label_value.label}</span>
                    </div>
                  </div>
                  <div className="col-5 pe-2">
                    <p className="text-sans-p-bold">
                      Total Anual ($M) <br /> informado por el sector
                    </p>
                    <div className="border-gris col-5 py-2 px-3">
                      ${item.total_anual_sector}
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-row mt-4">
                  <div className="col-12">
                    <CustomTextarea
                      label="Descripción"
                      placeholder="Describe el costo por subtítulo e ítem"
                      name="descripcion"
                      value={item.descripcion || ''}
                      readOnly="true"
                    />
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
