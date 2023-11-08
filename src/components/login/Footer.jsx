
const Footer = () =>
{
  return (
    <footer className="footer-container content-always-on-display position-relative">
      <div className="container py-5">

        <div className="row line-reference">

          <div className="col-md-2 col-8 a11y-fonts-col-12 me-5">
            <div className="aspect-ratio ratio-4x3">
              <div className="logo-container">
                <img className="mb-3 img-fluid img-sm" src="./src/static/img/logo_Subdere.png" />
                <div className="deco-line">
                  <div className="azul"></div>
                  <div className="rojo"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="container d-lg-none d-flex justify-content-center">
            <div className="divider mt-4"></div>
          </div>

          <div className="col col-md-3 col-lg-3 d-flex flex-column h-100 mt-5 mt-lg-0 ms-3 ms-lg-0 p-0">
            <p className="text-sans-p-white mb-3">Enlaces de Interés</p>
            <a className="text-sans-p-white text-decoration-underline" href="https://www.subdere.gov.cl/" target="_blank" rel="noreferrer">Subsecretaría de Desarrollo <br />Regional y Administrativo SUBDERE</a>
            <a className="text-sans-p-white text-decoration-underline" href="https://www.subdere.gov.cl/" target="_blank" rel="noreferrer">Ministerio del Interior y Seguridad<br /> Pública</a>
            <a className="text-sans-p-white text-wrap h-75 text-underline" href="https://www.subdere.gov.cl/" target="_blank" rel="noreferrer"> Gobierno de Chile</a>
          </div>

          <div className="d-lg-none d-flex justify-content-center">
            <div className="divider mt-4"></div>
          </div>

          <div className="col col-md-3 col-lg-3  d-flex flex-column mt-5 ml-2 mt-lg-0 ms-3 ms-lg-0 p-0">
            <p className="text-sans-p-white mb-m-3 mt-md-5">Dirección:</p>
            <p className="text-sans-p-white mb-3"> Teatinos 92 - Pisos 2 y 3. Santiago,<br /> Chile.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;