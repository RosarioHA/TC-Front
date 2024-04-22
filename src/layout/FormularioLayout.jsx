import { useContext, useEffect, useMemo } from "react";
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { FormTitle } from "./../components/layout/FormTitle";
import { HorizontalStepper } from "../components/stepers/HorizontalStepper";
import { Timmer } from "../components/layout/Timmer";
import { FormularioContext } from "../context/FormSectorial";

const FormularioLayout = () =>
{
  const { data, loading, error, updateFormId } = useContext(FormularioContext);
  const location = useLocation();
  const params = useParams();


  useEffect(() =>
  {
    const currentId = location.state?.id || params.id;
    if (currentId)
    {
      updateFormId(currentId);
    }
  }, [ location, params.id, updateFormId ]);

  const baseUrl = useMemo(() =>
  {
    if (location.pathname.includes('formulario_sectorial'))
    {
      return `/home/formulario_sectorial/${params.id}`;
    } else if (location.pathname.includes('revision_formulario_sectorial'))
    {
      return `/home/revision_formulario_sectorial/${params.id}`;
    }
    return ''; // or a default value
  }, [ location.pathname, params.id ]);

  if (error)
  {
    return <div>Error: {error.message}</div>;
  }

  if (!data)
  {
    return <div className="container">
      <div className="d-flex align-items-center flex-column my-5 px-5 ">
        <div className="text-center text-sans-h5-medium-blue ">Cargando Formulario</div>
        <span className="placeholder col-10 bg-primary"></span>
      </div>
    </div >;
  }

  return (
    <div className="container col-10 col-xxl-11">
      <div className="row">
        <div className="col mb-2">
          <FormTitle data={data} loading={loading} id={data.id} title="Formulario Sectorial" />
          <div className="mx-5">
            {data && <HorizontalStepper baseUrl={baseUrl} id={data.id} />}
            <Timmer data={data} loading={loading} id={data.id} />
          </div>
        </div>
      </div>
      <div className="row">
        <Outlet context={{ id: data.id, ...data }} />
      </div>
    </div>
  );
};

export default FormularioLayout;
