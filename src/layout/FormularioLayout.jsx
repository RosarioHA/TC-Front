import { useContext, useEffect } from "react";
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { FormTitle } from "./../components/layout/FormTitle";
import { HorizontalStepper } from "../components/stepers/HorizontalStepper";
import { Timmer } from "../components/layout/Timmer";
import { FormularioContext } from "../context/FormSectorial";

const FormularioLayout = () => {
  const { data, loading, error, updateFormId, pasoData, stepNumber, errorPaso, loadingPaso } = useContext(FormularioContext);
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    // Definición de la variable id directamente dentro de useEffect
    let currentId = location.state?.id || params.id;

    if (currentId) {
      updateFormId(currentId);
    }
  }, [location.state, params.id, updateFormId]); 

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
            <FormTitle data={data} loading={loading} id={data?.id} />
            <div className="mx-5">
              {data && <HorizontalStepper data={data} loading={loading} id={data.id} />}
              <Timmer data={data} loading={loading} id={data?.id} />
            </div>
          </div>
        </div>
        <div className="row">
          <Outlet context={{ id: data?.id, pasoData, stepNumber, loadingPaso, errorPaso }} />
        </div>
      </div>
    </>
  );
};

export default FormularioLayout;
