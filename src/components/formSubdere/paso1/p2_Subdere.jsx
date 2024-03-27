import { useContext, useEffect, useState, useCallback } from "react";
import { FormSubdereContext } from "../../../context/RevisionFinalSubdere";


export const RecomendacionTransferencia = () => {
  const { updatePasoSubdere, refetchTriggerSubdere } = useContext(FormSubdereContext);
  const [ inputStatus, setInputStatus ] = useState({
    ambito_definitivo_competencia: { loading: false, saved: false }
  });

  useEffect(() =>
  {
    refetchTriggerSubdere();
  }, [ refetchTriggerSubdere ]);


  return (
    <>
      
      <div className="col-11">
        <div className="container-fluid">

          <h4 className="text-sans-h4">
            2. Recomendación de transferencia
          </h4>
          <div className="text-sans-h6-primary my-3 col-11">
            <h6>
              Texto de apoyo.
            </h6>
          </div>




        </div>
      </div>
    </>
  );
};