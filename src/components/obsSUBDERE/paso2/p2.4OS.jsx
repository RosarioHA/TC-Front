import PlataformasYsoftware from "../../tables/PlataformasYsoftware";

export const Subpaso_dosPuntoCuatroOS = () => {
  return(
    <div>
      <h4 className="text-sans-h4">2.4 Plataformas y softwares utilizados en el ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary">Identifica las plataformas y/o softwares utilizados en el ejercicio de la competencia y llena una ficha técnica para cada plataforma o software.</h6>
  
      {/* Se debe generar un componente PlataformasYsoftware por cada plataforma ingresada por el usuario sectorial */}
      <div className="my-4">
        <PlataformasYsoftware 
        readOnly={true}/>
      </div>
    </div>
  )
};