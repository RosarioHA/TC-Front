import { useContext, useEffect } from 'react';
import { Outlet, useLocation, useParams} from 'react-router-dom'; 
import { Timmer } from "../components/layout/Timmer"
import { FormTitle } from "../components/layout/FormTitle"
import { HorizontalRevision} from "../components/stepers/HorizontalRevision";
import { FormSubdereContext } from '../context/RevisionFinalSubdere';


const FormLayout = () =>{
  const{ dataFormSubdere, loadingFormSubdere, errorFormSubdere, updateFormId } = useContext(FormSubdereContext);
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const currentId = location.state?.id || params.id;
    if (currentId) {
      updateFormId(currentId);
    }
  }, [location, params.id, updateFormId]);

  const baseUrl = `/home/revision_subdere/${params.id}`;

  if (errorFormSubdere) {
    return <div>Error: {errorFormSubdere.message}</div>;
  }

  if (!dataFormSubdere) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container-fluid col-11">
    <div className="row">
      <div className="col mb-2">
        <FormTitle data={dataFormSubdere} title="Revision Final SUBDERE" loading={loadingFormSubdere} id={dataFormSubdere.id} />
        <div className="mx-5">
          {dataFormSubdere && <HorizontalRevision baseUrl={baseUrl} />}
          <Timmer data={dataFormSubdere} loading={loadingFormSubdere} id={dataFormSubdere.id} />
        </div>
      </div>
    </div>
    <div className="row">
      <Outlet key={params.id} context={{ id: dataFormSubdere.id, ...dataFormSubdere }}  />
    </div>
  </div>
  )
}

export default FormLayout;