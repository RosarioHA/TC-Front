import PlataformasYsoftware from "../../tables/PlataformasYsoftware";

export const Subpaso_dosPuntoCuatro = ({data}) => {

  console.log('Estructura data 2.4:', data )

    return(
      <div>
        <h4 className="text-sans-h4">2.4 Plataformas y softwares utilizados en el ejercicio de la competencia</h4>
        <h6 className="text-sans-h6-primary">Identifica las plataformas y/o softwares utilizados en el ejercicio de la competencia y llena una ficha técnica para cada plataforma o software.</h6>
  
        <div className="my-4">
          <PlataformasYsoftware />
        </div>
  
        <button className="btn-secundario-s">
          <i className="material-symbols-rounded me-2">add</i>
          <p className="mb-0 text-decoration-underline">Agregar ficha técnica</p>
      </button>
        {/* boton agregar ficha tecnica tambien genera otra ficha para agregar otro software/plataforma */}

      </div>
    )
  };