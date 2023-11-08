

const Error404 = () => {
  return (
    <div className="container col-md-8 px-5 my-2 mb-5 my-md-5">
      <h1 className="text-serif-h1">Página no encontrada.</h1>
      <h3 className="text-sans-h5 mt-3">Código de error: 404 - No encontrado.</h3>
      <h2 className="text-sans-p mt-4">Sentimos no haber encontrado la página que buscabas. Es posible que 
        <strong> haya cambiado de ubicación, haya sido eliminada o no exista.</strong>
      </h2>
      <ul>
        <li className="text-sans-p mt-4">Si escribiste la dirección, revisa que no haya errores de escritura.</li>
        <li className="text-sans-p mt-2">Si copiaste y pegaste la dirección, revisa si copiaste la dirección completa.</li>
      </ul>
    </div>
  );
};
  
export default Error404;