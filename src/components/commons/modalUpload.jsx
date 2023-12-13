import { useState, useEffect } from 'react';
import {ModalBase } from './modalBase';

export const UploadFile = ({
  reset,
  isEditMode,
  editingFile,
  onFileAdded,
  onFileUpdated,
  editingIndex
}) =>
{
  const [file, setFile] = useState(isEditMode ? editingFile.file : null);
  const [inputValue, setInputValue] = useState(isEditMode ? editingFile.title : '');

  const triggerFileInput = () => document.getElementById('fileInput').click();

  const resetState = () => {
    setFile(null);
    setInputValue('');
  };

  const handleSave = () => {
    if (!file || !inputValue) {
      alert('Por favor, asegúrate de seleccionar un archivo y proporcionar un nombre para el documento.');
      return;
    }

    if (isEditMode) {
      onFileUpdated(editingIndex, file, inputValue);
    } else {
      onFileAdded(file, inputValue);
    }

    resetState();
  }

  useEffect(() => {
    if (reset) resetState();
  }, [reset]);

  useEffect(() => {
    if (isEditMode && editingFile) {
      setFile(editingFile.file);
      setInputValue(editingFile.title);
    } else {
      resetState(); // Si no está editando, reinicia el estado.
    }
  }, [isEditMode, editingFile]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
};


  return (
    <>
      <ModalBase title="Agregar archivo adicional" btnName="Subir Archivo" btnIcon="add" modalID="uploadFile">
        <div className="modal-archivos d-flex flex-column my-3 mx-5" >
          {!file && (
            <div className="container-upload" >
              <span className="text-sans-sub-grey text-start">Otros archivos (Opcionales) </span>
              <p className="text-sans-h5-grey">(Número de archivos máximo, peso máximo 20 MB, formato libre) </p>
              <input type="file" onChange={handleFileChange} className="d-none" id="fileInput" />
              <button className="btn-principal-s d-flex" onClick={triggerFileInput}>
                <i className="material-symbols-outlined ">upgrade</i>
                <u className="align-self-center text-sans-b-white">Subir Archivo</u>
              </button>
            </div>
          )}
          {file && (
            <div className="container-file">
              <div className="file-name justify-content-between d-flex">
                <span className=" d-flex align-items-center ms-2"><i className="material-symbols-rounded">draft</i>{file.name}</span>
                <button className="btn-borderless-red px-2 d-flex align-items-center mx-1" onClick={() => setFile(null)}>Borrar  <i className="material-symbols-rounded">delete</i></button>
              </div>
              <div className="text-sans-h5-blue info d-flex  align-content-center">
                <i className="material-symbols-outlined">
                  info
                </i>
                <span className="ms-2 align-self-center">El nombre que escribas para este documento será el que se muestre al público.</span>
              </div>
              <div className="d-flex flex-column input-container my-4">
                <label className="text-sans-p input-label ms-3 ms-sm-0" htmlFor="nameDocuments">Nombre del documento</label>
                <input
                  className="input-s px-3"
                  type="text"
                  placeholder="Ingresar nombre"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <p className="text-end">{inputValue.length} / 40 caracteres.</p>
              </div>
            </div>
          )}
        </div>
        <div className="d-flex align-items-center" >
          <div className=" col-12 d-flex border-top justify-content-between">
            <button className="btn-borderless d-flex justify-content-between my-4" data-bs-dismiss="modal" aria-label="Close">
              <i className="material-symbols-rounded ms-2 fs-2 mt-1">keyboard_arrow_left</i>
              <p className="text-sans-p-blue text-decoration-underline mb-0 py-1 px-2">Volver a la solicitud</p>
            </button>
            <button
              className="btn-principal-s d-flex text-sans-h4 pb-0 me-3 align-self-center"
              data-bs-dismiss="modal"
              onClick={handleSave}
            >
              <p className="text-sans-p-white text-decoration-underline">Guardar</p>
              <i className="material-symbols-rounded ms-2 pt-1">save</i>
            </button>
          </div>
        </div>
      </ModalBase>
    </>
  )
}


