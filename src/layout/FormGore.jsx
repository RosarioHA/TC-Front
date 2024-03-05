import { useContext, useEffect } from "react";
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { FormTitle } from "./../components/layout/FormTitle";
import { HorizontalGore } from "../components/stepers/HorizontalGore";
import { Timmer } from "../components/layout/Timmer";
// Importa FormGOREContext en lugar de FormularioContext
import { FormGOREContext } from "../context/FormGore";

const FormGoreLayout = () => {
  // Ajusta las propiedades extraídas para coincidir con las de FormGOREContext
  const { dataFormGore, loadingFormGore, errorFormGore, updateFormId } = useContext(FormGOREContext);
  const location = useLocation();
  const params = useParams();

  console.log('datagore',dataFormGore); 

  useEffect(() => {
    const currentId = location.state?.id || params.id;
    if (currentId) {
      updateFormId(currentId);
    }
  }, [location, params.id, updateFormId]);

  const baseUrl = `/home/formulario_gore/${params.id}`; 

  if (errorFormGore) { // Ajusta para usar errorFormGore
    return <div>Error: {errorFormGore.message}</div>;
  }

  if (!dataFormGore) { // Ajusta para usar dataFormGore
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid col-11">
      <div className="row">
        <div className="col mb-2">
          {/* Ajusta las propiedades pasadas a FormTitle y Timmer */}
          <FormTitle data={dataFormGore} title="Formulario Gobierno Regional"  loading={loadingFormGore} id={dataFormGore.id} />
          <div className="mx-5">
            {dataFormGore && <HorizontalGore baseUrl={baseUrl} />}
            <Timmer data={dataFormGore} loading={loadingFormGore} id={dataFormGore.id} />
          </div>
        </div>
      </div>
      <div className="row">
        {/* Ajusta el contexto pasado a Outlet */}
        <Outlet context={{ id: dataFormGore.id, ...dataFormGore }} />
      </div>
    </div>
  );
};

export default FormGoreLayout;