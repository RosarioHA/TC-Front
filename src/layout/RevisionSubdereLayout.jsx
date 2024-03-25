import { useContext, useEffect } from 'react';
import { Outlet, useLocation, useParams} from 'react-router-dom'; 
import { Timmer } from "../components/layout/Timmer"
import { FormTitle } from "../components/layout/FormTitle"
import { HorizontalRevision} from "../components/stepers/HorizontalRevision";
import { FormRevFinalSubdereContext } from '../context/RevisionFinalSubdere';


const FormRevFinalLayout = () =>{
  const{dataFormRevFinalSubdere, loadingFormRevFinalSubdere, errorFormRevFinalSubdere, updateFormId} = useContext(FormRevFinalSubdereContext);
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const currentId = location.state?.id || params.id;
    if (currentId) {
      updateFormId(currentId);
    }
  }, [location, params.id, updateFormId]);

  const baseUrl = `/home/revision-final-competencia/${params.id}`;

  if (errorFormRevFinalSubdere) {
    return <div>Error: {errorFormRevFinalSubdere.message}</div>;
  }

  if (!dataFormRevFinalSubdere) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container-fluid col-11">
    <div className="row">
      <div className="col mb-2">
        <FormTitle data={dataFormRevFinalSubdere} title="Revision Final SUBDERE" loading={loadingFormRevFinalSubdere} id={dataFormRevFinalSubdere.id} />
        <div className="mx-5">
          {dataFormRevFinalSubdere && <HorizontalRevision baseUrl={baseUrl} />}
          <Timmer data={dataFormRevFinalSubdere} loading={loadingFormRevFinalSubdere} id={dataFormRevFinalSubdere.id} />
        </div>
      </div>
    </div>
    <div className="row">
      <Outlet key={params.id} context={{ id: dataFormRevFinalSubdere.id, ...dataFormRevFinalSubdere }}  />
    </div>
  </div>
  )
}

export default FormRevFinalLayout;