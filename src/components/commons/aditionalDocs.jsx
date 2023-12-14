export const AdditionalDocs = (props) =>
{

  const handleDelete = (event, index) =>
  {
    event.preventDefault();
    props.onDelete(index);
  }

  return (
    <>
      <div className="row my-4 fw-bold border-top">
        <div className="col-1 mt-3">#</div>
        <div className="col mt-3">Documento</div>
        <div className="col mt-3">Acción</div>
      </div>
      {props.files.map((fileObj, index) => (
        <div key={index} className={`row border-top align-items-center  ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
          <div className="col-1 p-3">{index + 1}</div>
          <div className="col p-3">{fileObj.title}</div>
          <div className="col p-3 d-flex">
            <button
              type="button"
              onClick={(e) => handleDelete(e, index)}
              className="btn-terciario-ghost px-0 d-flex align-items-center mx-0 ">
              <span className="text-sans-b-red mx-2 ">Borrar</span><i className="material-symbols-rounded ">delete</i>
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
