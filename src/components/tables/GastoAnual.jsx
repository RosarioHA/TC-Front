import React,{ useContext, useState, useEffect } from "react";
import { FormularioContext } from "../../context/FormSectorial";
import CustomTextarea from "../forms/custom_textarea";

const datosGastos = [
  { 'id': 1, 'subtitulo': 'Sub. 21', 'descripcion': '' },
  { 'id': 2, 'subtitulo': 'Sub. 22', 'descripcion': '' },
  { 'id': 3, 'subtitulo': 'Sub. 23', 'descripcion': '' },
]
export const GastosAnuales = () =>
{

  const { id, stepNumber, updatePaso } = useContext(FormularioContext);
  const [ datos, setDatos ] = useState([]);
  const [ showErrorMessage, setShowErrorMessage ] = useState(false);


  useEffect(() =>
  {
    if (datosGastos)
    {
      setDatos(datosGastos);
    }
  }, [ id ]);

  if (!datosGastos)
  {
    return <div>Cargando datos...</div>;
  }

  if (!datos || datos.length === 0)
  {
    return <div>No hay datos para mostrar.</div>;
  }
  const validateInput = (value) =>
  {
    return value.replace(/[-+.e-]/g, '');
  };

  const headers = datos.map(data => data.anio);

  const handleBlur = async (index, tipo, value) =>
  {
    const validatedValue = validateInput(value);
    if (datos[ index ][ tipo ] !== validatedValue)
    {
      try
      {
        console.log(`Guardando: ${tipo} = ${value} para el ID: ${id}`);
        await updatePaso(id, stepNumber, { [ tipo ]: value });
        const newDatos = [ ...datos ];
        newDatos[ index ][ tipo ] = validatedValue;
        setDatos(newDatos);
        if (!areAllFieldsFilled())
        {
          setShowErrorMessage(true);
        } else
        {
          setShowErrorMessage(false);
        }
      } catch (error)
      {
        console.error("Error al actualizar:", error);
      }
    }
  };


  const handleInputChange = (index, tipo, value) =>
  {
    const validatedValue = validateInput(value);
    const newDatos = [ ...datos ];
    newDatos[ index ][ tipo ] = validatedValue;
    setDatos(newDatos);
  };
  const areAllFieldsFilled = () =>
  {
    return datos.every(data => Object.values(data).every(value => value !== ""));
  };

  const currentYear = new Date().getFullYear();
  const yearDifferences = headers.map(year => currentYear - year);




  return (
    <div className="mt-4">
      <span className="my-4 ">Variación promedio del gasto anual respecto del año n-1</span>
      <div className="container-fluid me-5 pe-5 text-sans-h6-primary">
        <h6>
          Las variaciones se calcularan automáticamente a partir de la tabla anterior.
          Debes describir los motivos de las variaciones anuales sustantivas.
        </h6>
      </div>
      <div className="my-4">
      <table className="table table-borderless table-striped">
          <thead>
            <tr>
              <th scope="col" className="text-sans-p-bold px-2 pb-5">Subtitulo</th>
              {headers.map((year, index) => (
                <th key={index} scope="col" className="text-sans-p text-center">
                  <u>{year}</u>
                  <p className="text-sans-h6-grey">(año n-{yearDifferences[ index ]})</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datosGastos.map((item, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr>
                  <th scope="row" className="text-sans-p-bold pt-2"><u>{item.subtitulo}</u></th>
                  {datos.map((data, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`} className="px-1">
                    </td>
                  ))}
                </tr>
                <tr>
                  <td colSpan={headers.length + 1} className="px-0">
                    <CustomTextarea
                      label="Descripción"
                      placeholder="Describe la evolución del gasto por subtitulo"
                      maxLength={500}
                      value={item.descripcion}
                      onChange={(e) => handleInputChange(rowIndex, 'descripcion', e.target.value)}
                      onBlur={(e) => handleBlur(rowIndex, 'descripcion', e.target.value)}
                      className={`form-control ${rowIndex % 2 === 0 ? "bg-color-even" : "bg-color-odd"}`}
                    />
                  </td>
                </tr>
              </React.Fragment >
            ))}

          </tbody>
        </table>
        {showErrorMessage && (
          <div className="error-message text-sans-h6-darkred">
            Debes llenar todos los campos para poder enviar el formulario.
          </div>
        )}
      </div>

    </div >
  );
}