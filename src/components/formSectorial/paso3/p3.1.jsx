import { useState, useEffect, useContext, useCallback } from "react";
import { FormularioContext } from "../../../context/FormSectorial";
import { usePasoForm } from "../../../hooks/formulario/usePasoForm";

export const Subpaso_Tres = ({ esquemaDatos, id, stepNumber, solo_lectura, region }) =>
{
  const { handleUpdatePaso } = useContext(FormularioContext);
  const { refetchTrigger } = usePasoForm(id, stepNumber);
  const [ datos, setDatos ] = useState(esquemaDatos || []);
  const [ showErrorMessage, setShowErrorMessage ] = useState(false);
  const currentYear = new Date().getFullYear();
  const yearDifferences = datos?.map(data => currentYear - data?.anio);
  const [ ultimoCampoModificado, setUltimoCampoModificado ] = useState(null);
  const [ ultimoGuardadoExitoso, setUltimoGuardadoExitoso ] = useState(null);
  const [ errorField, setErrorField ] = useState(null);
  const [ valorInicial, setValorInicial ] = useState({});

  // useEffect(() =>
  // {
  //   if (dataPaso)
  //   {
  //     setDatos(dataPaso?.cobertura_anual );
  //   }
  // }, [ dataPaso ]);

  useEffect(() =>
  {
    if (esquemaDatos)
    {
      setDatos(esquemaDatos);
    }
  }, [ esquemaDatos ]);

  const handleFocus = useCallback((index, campo, value) =>
  {
    setValorInicial(prev => ({ ...prev, [ `${index}-${campo}` ]: value }));
  }, []);

  const handleInputChange = useCallback((index, campo, value) =>
  {
    const newDatos = [ ...datos ];
    const numericValue = Number(value.replace(/\$|\./g, ''));

    if (!isNaN(numericValue))
    {
      newDatos[ index ][ campo ] = numericValue;
      setDatos(newDatos);
      setUltimoCampoModificado({ index, campo });
      setUltimoGuardadoExitoso(null);
      setShowErrorMessage('');
      setErrorField(null);
    } else
    {
      setShowErrorMessage("");
      setErrorField(null);
    }
  }, [ datos ]);

  const handleBlur = useCallback(async (index, campo, value) =>
  {
    const inputValue = value.trim() === '' ? null : Number(value.replace(/\$|\./g, ''));
    const valorInicialKey = `${index}-${campo}`;
    const valorInicialInput = valorInicial[ valorInicialKey ];
    const valorInicialNumeric = valorInicialInput ? Number(valorInicialInput.replace(/\$|\./g, '')) : null;

    if (inputValue === valorInicialNumeric)
    {
      return;
    }

    const updatedData = [ ...datos ];
    updatedData[ index ][ campo ] = inputValue;

    try
    {
      await handleUpdatePaso(id, stepNumber, { regiones: [ { region, cobertura_anual: updatedData } ] });
      setDatos(updatedData);
      setUltimoGuardadoExitoso(true);
      setShowErrorMessage('');
      setErrorField(null);
      refetchTrigger();
    } catch (error)
    {
      console.error("Error al actualizar:", error);
      setUltimoGuardadoExitoso(false);
      setShowErrorMessage("Error al guardar los cambios. Intente de nuevo.");
    }
  }, [ valorInicial, datos, handleUpdatePaso, id, stepNumber, region, refetchTrigger ]);

  const getPlaceholder = (rowIndex) =>
  {
    switch (rowIndex)
    {
      case 0:
      case 1:
        return "Unidades";
      case 2:
        return "Recursos (M$)";
      default:
        return "";
    }
  };

  function formatNumber(value)
  {
    if (value === null || value === undefined) return "";
    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${formatter.format(value)}`;
  }

  function capitalizeFirstLetter(string)
  {
    return string
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  return (
    <div className="mt-4">
      <span className="my-4 text-sans-h4">3.1 Cobertura financiera de los últimos 5 años</span>
      <div className="text-sans-h6-primary">
        <h6>
          En función a lo descrito se debe cuantificar el universo de cobertura y la cobertura efectivamente abordada en los últimos 5 años. Luego cuantificar los recursos ejecutados anualmente (en M$) respecto a la cobertura efectivamente abordada.<br /><br />
          Solo llenar con números enteros. En caso de que un año no se hayan ejecutado recursos, llenar con 0.
        </h6>
      </div>
      <div className="my-4">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col" className="text-sans-p-bold px-2 pb-5">#</th>
              <th scope="col" className="text-sans-p-bold px-2 pb-5">Año de ejercicio</th>
              {datos?.map((data, index) => (
                <th key={index} scope="col" className="text-sans-p text-center border-start">
                  <u>{data?.anio}</u>
                  <p className="text-sans-h6-grey">(año n-{yearDifferences[ index ]})</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[ 'universo_cobertura', 'cobertura_efectivamente_abordada', 'recursos_ejecutados' ].map((item, rowIndex) => (
              <tr key={rowIndex} className="mt-2">
                <th scope="row" className="text-sans-p-bold align-self-center">{rowIndex + 1}</th>
                <th scope="row" className="text-sans-p-bold pt-2">
                  {capitalizeFirstLetter(item)}{item === 'recursos_ejecutados' ? ' (M$)' : ''}
                </th>
                {datos?.map((data, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className="border-start px-1">
                    <input
                      type="text"
                      disabled={solo_lectura}
                      onFocus={(e) => handleFocus(colIndex, item, e.target.value)}
                      value={item === 'recursos_ejecutados' && data[ item ] === null ? '' : item === 'recursos_ejecutados' ? `$${formatNumber(data[ item ])}` : `${formatNumber(data[ item ])}`}
                      placeholder={getPlaceholder(rowIndex)}
                      onChange={(e) => handleInputChange(colIndex, item, e.target.value)}
                      onBlur={(e) => handleBlur(colIndex, item, e.target.value)}
                      className={`form-control mx-auto px-0 mb-4 text-center ${errorField === `${colIndex}-${item}` ? 'border-error' : ''}
                      ${ultimoCampoModificado?.index === colIndex && ultimoCampoModificado?.campo === item
                          ? ultimoGuardadoExitoso
                            ? 'border-success'
                            : 'border-error'
                          : ''
                        }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">4</th>
              <th scope="row" className="text-sans-p-bold">Total<br />M$/Cobertura <br />efectiva</th>
              {datos?.map((data, index) => (
                <td key={`total-${index}`} className="border-start px-3 text-center">
                  <p className="text-sans-h6-primary">
                    {typeof data?.total_cobertura_efectiva === 'number'
                      ? `$${formatNumber(data?.total_cobertura_efectiva)}`
                      : data?.total_cobertura_efectiva}
                  </p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        {showErrorMessage && (
          <div className="error-message text-sans-h6-darkred">
            {showErrorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
