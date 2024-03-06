// import { useEffect, useState } from "react";
import SubirArchivo from "../../forms/subir_archivo"



export const SubUno_dos = () =>
{

  // const [ flujogramaFiles, setFlujogramaFiles ] = useState(pasoData?.flujograma || flujograma || []);
  // const [ uploading, setUploading ] = useState(false);
  // const [ deleting, setDeleting ] = useState(false);

  //visualizar pdf
  const ver = true;

  // useEffect(() =>
  // {
  //   setFlujogramaFiles(pasoData?.flujograma_ejercicio_competencia || []);
  // }, [ pasoData ]);




  return (
    <>
      <h4 className="text-sans-h4">
      1.2 Flujograma de ejercicio de la competencia:
      </h4>
      <div className="text-sans-h6-primary my-3 col-11">
          <h6>
          A partir de la informacion levantada anteriormente, se debe modelar un flujograma en formato BPM que permita visualizar el ejercicio de la competencia ante una eventual transferencia al Gobierno Regional.
          </h6>
        </div>
      <h6 className="text-sans-h6-grey">
      (Mínimo 1 archivo, máximo 3 archivos, peso máximo 20 MB cada uno, formato PDF)
      </h6>

      <div className="col-11">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="d-flex mb-2">
            <div className="ms-4">#</div>
            <div className="ms-5">Documento</div>
          </div>
          <div className="me-5">Acción</div>
        </div>
          <SubirArchivo
            key=''
            index=''
            tituloDocumento=""
            handleFileSelect=""
            handleDelete=""
            readOnly={false}
            onViewFile=""
            ver={ver}
            archivoDescargaUrl=""
            // uploading={uploading}
            // deleting={deleting}
          />

        {/* {!uploading && flujogramaFiles.length < 5 && (
          <SubirArchivo
            index={flujogramaFiles.length + 1}
            handleFileSelect=""
            onViewFile=""
            readOnly={false}
            ver={ver}
          />
        )} */}
      </div>

      <div className="my-4 col-11">
        <iframe
          id="visorPDF"
          src=''
          title="Vista previa del documento"
        ></iframe>
      </div>

    </>
  )
}
