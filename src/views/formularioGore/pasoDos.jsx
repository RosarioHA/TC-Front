import { useContext, useEffect } from "react";
import { FormGOREContext } from "../../context/FormGore";
// import { MonoStepers } from "../../components/stepers/MonoStepers";
// import { Avance } from "../../components/tables/Avance";
// import { NavigationGore } from "../../components/layout/navigationGore";
import { DosA } from "../../components/formGore/paso2/DosA";
import { DosB } from "../../components/formGore/paso2/DosB";
import { DosC } from "../../components/formGore/paso2/DosC";


const PasoDosGore = () => {

  const { dataFormGore, dataPasoGore, errorPasoGore, updateStepNumber } = useContext(FormGOREContext);
  const stepNumber = 2;

  useEffect(() =>
  {
    updateStepNumber(stepNumber);
  }, [ updateStepNumber, stepNumber ]);

  if (errorPasoGore) return <div>Error: {errorPasoGore.message || "Error desconocido"}</div>;
  if (!dataPasoGore || dataPasoGore.length === 0) return <div>No hay datos disponibles para el Paso 1</div>;

  const { p_2_1_a_costos_directos ,costos_directos_sector , personal_directo_sector, costos_directos_gore, p_2_1_b_costos_indirectos, resumen_costos, p_2_1_c_fluctuaciones_presupuestarias} = dataPasoGore;

console.log( p_2_1_a_costos_directos); 


  return (
    <>
    <div className="col-1">
      {/* <MonoStepers stepNumber={paso2Data.numero_paso} /> */}
    </div>
    <div className="col-11">
      <div className="container-fluid">
        <div className="d-flex">
          {/* <h3 className="mt-3 me-4">{paso2Data.nombre_paso}</h3>
          <Avance avance={paso2Data.avance} /> */}
        </div>
        <div className='col-10 text-sans-h6-primary'>
        <h6>Se deben estimar los gastos necesarios para el ejercicio de la competencia por el Gobierno Regional, considerando los costos directos e indirectos informados por el Ministerio o Servicio de origen, y complementados por la DIPRES. En el caso de los costos indirectos, se debe considerar que corresponden a tareas de soporte nacional, por lo que no son replicables region a region.</h6>
        </div>
        <DosA
          costosDirectos={p_2_1_a_costos_directos}
          costosDirecSector={costos_directos_sector}
          PersonalDirecto={personal_directo_sector}
          costosDircGore={costos_directos_gore}
          id={dataFormGore?.id}
          stepNumber={stepNumber}
        />
        <DosB
          costosIndirectos={p_2_1_b_costos_indirectos}
          resumen={resumen_costos}
          id={dataFormGore?.id}
          stepNumber={stepNumber}
        />
        <DosC
          fluctuaciones={p_2_1_c_fluctuaciones_presupuestarias}
          id={dataFormGore?.id}
          stepNumber={stepNumber}
        />
        {/* <NavigationGore step={paso2Data.numero_paso} id={dataFormGore?.id} /> */}
      </div>
    </div>
  </>
  )
}

export default PasoDosGore; 