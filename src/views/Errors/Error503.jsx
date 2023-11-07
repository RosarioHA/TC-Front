const Error503 = () => {
  return (
    <div className="container col-md-8 px-5 my-2 mb-5 my-md-5">
      <h1 className="text-serif-h1">Servicio no disponible temporalmente.</h1>
      <h3 className="text-sans-h5 mt-3">Código de error: 500 - Servicio no disponible.</h3>
      <h2 className="text-sans-p mt-4">La plataforma se encuentra en mantenimiento y 
        <strong> ha sido desactivada temporalmente</strong>
        . Sentimos los inconvenientes que esto pueda haber 
        provocado. Podrás volver a ingresar el $Date.
      </h2>
      <h2 className="text-sans-p mt-4">Si te encontrabas ingresando información o llenando formularios,  
        <strong> no ha sido posible guardar tus respuestas. </strong>
        Cuando la plataforma vuelva a estar disponible, deberás hacerlo nuevamente.
      </h2>
      <h2 className="text-sans-p mt-4">Te puedes contactar con la SUBDERE al teléfono de mesa central: 
        <strong> (2) 2 636 36 00</strong>
      </h2>
    </div>
    );
  };
  
  export default Error503;