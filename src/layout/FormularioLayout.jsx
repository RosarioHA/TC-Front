import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { FormTitle } from "./../components/layout/FormTitle";
import { HorizontalStepper } from "../components/stepers/HorizontalStepper";
import { Timmer } from "../components/layout/Timmer";
import { FormularioContext } from "../context/FormSectorial";

const FormularioLayout = () => {
  const { data, loading, error, updateFormId, pasoData, stepNumber, errorPaso, loadingPaso} = useContext(FormularioContext);
  const location = useLocation();
  const params = useParams();
  const [baseUrl, setBaseUrl] = useState('');

  const id = data.id; 

  useEffect(() => {
    let currentId = location.state?.id || params.id;
    if (currentId && currentId !== id) {
      updateFormId(currentId);
    }
    // Actualizar baseUrl basado en la ruta actual
    if (location.pathname.includes('formulario_sectorial')) {
      setBaseUrl(`/home/formulario_sectorial/${params.id}`);
    } else if (location.pathname.includes('revision_formulario_sectorial')) {
      setBaseUrl(`/home/revision_formulario_sectorial/${params.id}`);
    }
  }, [location, params.id, id, updateFormId]);

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
              {data && <HorizontalStepper baseUrl={baseUrl} />}
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
