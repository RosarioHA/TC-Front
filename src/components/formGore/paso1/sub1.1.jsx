import CustomTextarea from "../../forms/custom_textarea";

export const SubUno_Uno = (dataPaso) =>
{

  console.log(dataPaso);


  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">1.1 Descripción del ejercicio de la competencia en el Gobierno Regional</span>
        <div className="text-sans-h6-primary my-3 col-11">
          <h6>
            Describir brevemente de qué manera proyecta el ejercicio de la competencia en el caso de ser transferida, asociandola a funciones o competencias que hoy realiza y que son estratégicas para su gestion y a la eventual interacción con otros organismos públicos que intervengan en su ejercicio.
          </h6>
        </div>
        <div className="my-4 ">
          <CustomTextarea
            label="Descripción (Obligatorio)"
            placeholder="Describe el ejercicio de la competencia en el Gobierno Regional."
            name="descripcion_ejercicio_competencia"
            maxLength={8800}
          />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-0">Se deben describir aquellos elementos que permitirían dar cuenta de una mejor calidad y oportunidad en la toma de decisiones, y una mejor adecuacion de la Politica Nacional en el territorio.</h6>
          </div>
        </div>
      </div>
    </>
  )
}
