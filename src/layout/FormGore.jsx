import { useContext, useEffect } from "react";
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { FormTitle } from "./../components/layout/FormTitle";
import { HorizontalGore } from "../components/stepers/HorizontalGore";
import { Timmer } from "../components/layout/Timmer";
import { FormGOREContext } from "../context/FormGore";

const FormGoreLayout = () => {
  const { dataFormGore, loadingFormGore, errorFormGore, updateFormId } = useContext(FormGOREContext);
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const currentId = location.state?.id || params.id;
    if (currentId) {
      updateFormId(currentId);
    }
  }, [location, params.id, updateFormId]);

  const baseUrl = `/home/formulario_gore/${params.id}`;

  if (errorFormGore) {
    return <div>Error: {errorFormGore.message}</div>;
  }

  if (!dataFormGore) {
    return <div>Cargando...</div>;
  }
  return (
    <div className="container-fluid col-11">
      <div className="row">
        <div className="col mb-2">
          <FormTitle data={dataFormGore} title="Formulario Gobierno Regional" loading={loadingFormGore} id={dataFormGore.id} />
          <div className="mx-5">
            {dataFormGore && <HorizontalGore baseUrl={baseUrl} />}
            <Timmer data={dataFormGore} loading={loadingFormGore} id={dataFormGore.id} />
          </div>
        </div>
      </div>
      <div className="row">
        <Outlet key={params.id} context={{ id: dataFormGore.id, ...dataFormGore }} />
      </div>
    </div>
  );
};

export default FormGoreLayout;
