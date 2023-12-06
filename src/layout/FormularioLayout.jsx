import { FormTitle } from "./../components/layout/FormTitle";
import { MonoStepers } from "./../components/stepers/MonoStepers";
import { Outlet } from 'react-router-dom';
import { ButtonsNavigate } from "../components/layout/ButtonsNavigate";
import { HorizontalStepper } from "../components/stepers/HorizontalStepper";
import { Timmer } from "../components/layout/Timmer";

const FormularioLayout = () =>
{
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col mb-2">
            <FormTitle />
            <div className="mx-5">
              <HorizontalStepper />
              <Timmer />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-1">
            <MonoStepers />
          </div>
          <div className="col-11">
            <Outlet />
          </div>
        </div>
        <div className="row">
          <div className="col mx-5">
            <ButtonsNavigate />
          </div>
        </div>
      </div>
    </>
  )
}

export default FormularioLayout