import { useState } from "react";

const DescargarArchivo = ({ index, pretitulo, tituloDocumento }) => {
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDownload = () => {
		// Realiza una solicitud al backend para obtener el archivo, BUSCAR RUTA CORRECTA EN LA API
		fetch(`/api/descargar-archivo/${archivoId}`)
			.then(response => response.blob())
			.then(blob => {
				setFileDownloaded(true);
				setFileName(tituloDocumento);
	
				// Crea un enlace de descarga para el usuario
				const url = window.URL.createObjectURL(new Blob([blob]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', fileName);
				document.body.appendChild(link);
				link.click();
				link.parentNode.removeChild(link);
			})
			.catch(error => {
				console.error('Error al descargar el archivo:', error);
			});
	};

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="col-1 p-3 ms-2 fw-bold">{index}</div>
					{pretitulo && <div className="p-3 col-3 ms-3 text-sans-h6">{pretitulo}</div>}
          {tituloDocumento && <div className="ms-4 py-3 col-6 text-sans-h6">{tituloDocumento}</div>}
        </div>
        <div>
          <div className="col p-3 d-flex">
            <button onClick={handleDownload} className="btn-secundario-s px-2 d-flex align-items-center mx-1">
              <span className="text-sans-b-green text-decoration-underline mx-1">Descargar</span>
              <i className="material-symbols-rounded ms-2">download</i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DescargarArchivo;
