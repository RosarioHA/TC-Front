import { CostoPersonal } from '../componentes/CostoPersonal';
export const Sub1_b = () => {
  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">
          b. Personal transversal o de soporte
        </span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            En los siguientes cuadros, y a partir de la información provista por
            el Ministerio o Servicio de origen, se deberá consignar el personal
            requerido para el ejercicio directo de la competencia.
          </h6>
        </div>
        <div>
          <CostoPersonal title="indirectos" />
        </div>
      </div>
    </>
  );
};
