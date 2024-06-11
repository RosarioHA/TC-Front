import { useContext, useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Timmer } from "../components/layout/Timmer"
import { HorizontalRevision } from "../components/stepers/HorizontalRevision";
import { FormSubdereContext } from '../context/RevisionFinalSubdere';
import { EncabezadoFormularios } from '../components/layout/EncabezadoFormularios';

const FormLayout = () => {
  const { dataFormSubdere, dataPasoSubdere, loadingFormSubdere, errorFormSubdere, updateFormId, permisoPaso2,setPermisoPaso2 } = useContext(FormSubdereContext);
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const currentId = location.state?.id || params.id;
    if (currentId) {
      updateFormId(currentId);
      setPermisoPaso2(true); 
    }
  }, [location, params.id, updateFormId, setPermisoPaso2]);

  const baseUrl = `/home/revision_subdere/${params.id}`;

  if (errorFormSubdere) {
    return <div>Error: {errorFormSubdere.message}</div>;
  }
  if (!dataFormSubdere) {
    return <div className="container">
    <div className="d-flex align-items-center flex-column my-5 px-5 ">
      <div className="text-center text-sans-h5-medium-blue ">Cargando Formulario</div>
      <span className="placeholder col-10 bg-primary"></span>
    </div>
  </div>;  
  }

  return (
    <div className="container col-10 col-xxl-11">
      <div className="row">
        <div className="col mb-2">
          <div className="border-bottom my-3">
            <h1 className="text-sans-Title">Revisión final SUBDERE</h1>
            <EncabezadoFormularios id={params.id} />
          </div>

          <div className="mx-5">
            {dataFormSubdere && <HorizontalRevision baseUrl={baseUrl}
              permisoSiguiente={dataPasoSubdere} permisoPaso2={permisoPaso2} id={dataFormSubdere.id}
            />}
            <Timmer data={dataFormSubdere} loading={loadingFormSubdere} id={dataFormSubdere.id} />
          </div>
        </div>
      </div>
      <div className="row">
        <Outlet key={params.id} context={{ id: dataFormSubdere.id, ...dataFormSubdere }} />
      </div>
    </div>
  )
}

export default FormLayout;