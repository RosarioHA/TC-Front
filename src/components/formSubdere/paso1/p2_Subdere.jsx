import { useState, useContext, useRef, useEffect } from 'react';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'material-icons/iconfont/material-icons.css';
import { FormSubdereContext } from '../../../context/RevisionFinalSubdere';
import { ModalAdvertencia } from '../../commons/modalAdvertencia';

export const RecomendacionTransferencia = ({ regionesListado, regionesRecomendadas, solo_lectura }) =>
{
  // Transforma el listado de regiones al formato esperado por DualListBox
  const options = regionesListado.map(region => ({
    value: region.id.toString(),
    label: region.region
  }));

  const [ selected, setSelected ] = useState([]);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const { updatePasoSubdere } = useContext(FormSubdereContext);
  const [ showMessage, setShowMessage ] = useState(false);
  const modalRef = useRef();



  useEffect(() =>
  {
    // Asumiendo que esto ajusta la lista de `selected` basado en los datos externos.
    const recomendadasIds = new Set(regionesRecomendadas);
    const selectedOptions = regionesListado.filter(region => !recomendadasIds.has(region.id)).map(region => region.id.toString());
    setSelected(selectedOptions);
  }, [ regionesRecomendadas, regionesListado ]);

  // Manejador para el envío del formulario
  const onSubmit = (event) =>
  {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const continueWithSaving = () => {
    const disponibles = options.filter(option => !selected.includes(option.value));
    // Define correctamente el objeto anidado para el payload
    const payload = {
      regiones_recomendadas: disponibles.map(option => option.value),
      paso1_revision_final_subdere: {
        regiones_seleccionadas: true, // Así se establece correctamente el campo anidado a true
      },
    };
    updatePasoSubdere(payload); // Envía el payload actualizado
    modalRef.current.handleClose();
    setShowMessage(true);
  };
  

  // Determina el mensaje a mostrar basado en la selección actual
  const getMessageAndStyle = () =>
  {
    let messageComponent;

    if (selected.length === 0)
    {
      messageComponent = (
        <span>La transferencia es <strong>favorable</strong> para todas las regiones.</span>
      );
      return {
        message: messageComponent,
        style: "message-favorable",
        containerStyle: "message-container-favorable"
      };
    } else if (selected.length < options.length)
    {
      messageComponent = (
        <span>La transferencia es <strong>parcialmente favorable</strong>. Solo se transferirá a algunas regiones.</span>
      );
      return {
        message: messageComponent,
        style: "message-parcial",
        containerStyle: "message-container-parcial"
      };
    } else
    {
      messageComponent = (
        <span>La transferencia es <strong>desfavorable</strong> para todas las regiones.</span>
      );
      return {
        message: messageComponent,
        style: "message-desfavorable",
        containerStyle: "message-container-desfavorable"
      };
    }
  };

  const { message, style, containerStyle } = getMessageAndStyle();


  return (
    <>
      <div className="col-11">
        <div className="container container-xxl-fluid">
          <h4 className="text-sans-h4">
            2. Recomendación de transferencia
          </h4>
          <div className="text-sans-h6-primary my-3 col-11">
            <h6>Texto de apoyo.</h6>
          </div>
          <form onSubmit={onSubmit}>
            <DualListBox
              options={regionesListado.map(region => ({
                value: region.id.toString(),
                label: region.region
              }))}
              selected={selected}
              onChange={setSelected}
              canFilter
              disabled={solo_lectura}
              showHeaderLabels
              lang={{
                availableFilterPlaceholder: 'Busca el nombre de la región.',
                selectedFilterPlaceholder: 'Busca el nombre de la región.',
                availableHeader: '✅ Regiones con recomendación favorable',
                selectedHeader: '❌ Regiones con recomendación desfavorable',
                moveAllToAvailable: 'Mover todas a favorable',
                moveAllToSelected: 'Mover todas a desfavorable',
                moveToAvailable: 'Mover a favorable',
                moveToSelected: 'Mover a desfavorable',
              }}
              icons={{
                moveToAvailable: <div className="d-flex flex-row my-1 ms-3"><span className="material-icons mx-2">arrow_back</span>Mover a favorable </div>,
                moveAllToAvailable: <div className="d-flex flex-row my-1 mx-2"><span className="material-icons me-2">arrow_back</span>Mover Todas a Favorable </div>,
                moveToSelected: <div className="d-flex flex-row my-1 ms-4">Mover a Desfavorable<span className="material-icons ms-1">arrow_forward</span> </div>,
                moveAllToSelected: <div className="d-flex flex-row my-1 mx-1">Mover Todas a Desfavorable<span className="material-icons ">arrow_forward</span> </div>,
              }}
            />
            {
              !solo_lectura && (
                <>
                  <div className="message message-container ">Debes guardar la selección para poder completar el siguiente paso.</div>
                  <div className="my-3">
                    <button type="button" className="btn-primario-s text-decoration-underline px-5" onClick={() => setIsModalOpen(true)}>Guardar Selección</button>
                  </div>
                </>
              )
            }
            {showMessage && (
              <div className={`message-container ${containerStyle}`}>
                <div className={`message-general ${style}`}>{message}</div>
              </div>
            )}
          </form>
        </div>
      </div>
      <ModalAdvertencia
        ref={modalRef}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={continueWithSaving}
      />
    </>
  );
};