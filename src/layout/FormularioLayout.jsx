import { useContext, useEffect } from "react";
import { Outlet, useLocation } from 'react-router-dom';
import { FormTitle } from "./../components/layout/FormTitle";
import { MonoStepers } from "./../components/stepers/MonoStepers";

import { HorizontalStepper } from "../components/stepers/HorizontalStepper";
import { Timmer } from "../components/layout/Timmer";
import { FormularioContext } from "../context/FormSectorial";


const FormularioLayout = () =>
{
  const { data, loading, error, updateFormId, pasoData, stepNumber, errorPaso, loadingPaso } = useContext(FormularioContext);
  const location = useLocation();
  const id = location.state?.id;

  useEffect(() => {
    if (id) {
      updateFormId(id);
    }
  }, [id, updateFormId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>

      <div className="container-fluid">
        <div className="row">
          <div className="col mb-2">
            <FormTitle data={data} loading={loading} id={id} />
            <div className="mx-5">
            {data && <HorizontalStepper data={data} loading={loading} id={data.id} />}
              <Timmer data={data} loading={loading} id={id}  />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-1">
          {pasoData &&<MonoStepers stepNumber={pasoData.numero_paso} />}
          </div>
          <div className="col-11">
          <Outlet context={{ id, pasoData, stepNumber, loadingPaso, errorPaso }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default FormularioLayout