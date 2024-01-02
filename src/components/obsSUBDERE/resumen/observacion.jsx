import CustomTextarea from "../../forms/custom_textarea";

const Observacion = ({index, titulo, value}) => {
  return(
    <>
    <div className="d-flex justify-content-between p-3">
      <div className="d-flex">
        <p className="mb-0 text-sans-p-semibold ms-3">Paso {index}:</p>
        <p className="ms-3 mb-0 text-sans-p">{titulo}</p>
      </div>
      {value && (
      <>
        <p className="mb-0">check</p>
        <p className="text-sans-p-blue me-5 mb-0">Listo</p>
      </>
      )}
    </div>

    <div className="container my-3">
        {value ? (
          <CustomTextarea 
            label="Observaciones (Opcional)"
            readOnly={true}
            value={value}
          />
        ) : (
          <p className="text-sans-p">{`No dejaste observaciones en este paso.`}</p>
        )}
      </div>
    <hr/>
    </>
  )
};

export default Observacion;