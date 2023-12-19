import { useContext, useState } from 'react';
import { FormularioContext } from '../../../context/FormSectorial'; // Asegúrate de usar la ruta correcta

export const SubpasoTres = () => {
  const { cobertura_anual, updatePaso } = useContext(FormularioContext);
  const [editData, setEditData] = useState({}); // Estado para datos editados en los inputs

  const handleBlur = (id, field) => {
    // Aquí llamarías a la función para actualizar los datos en el backend
    updatePaso({ id, ...editData[id] });
  };

  const handleChange = (id, field, value) => {
    // Establecer nuevos valores en el estado de editData
    setEditData({
      ...editData,
      [id]: {
        ...editData[id],
        [field]: value
      }
    });
  };

  return (
    <div className="mt-4">
      <span className="my-4 text-sans-h4">3.1 Cobertura financiera de los últimos 5 años</span>
      <h6 className="text-sans-h6-primary">
        [Descripción de la sección]
      </h6>
      <div className="my-4">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Año de ejercicio</th>
              <th scope="col">Universo de cobertura</th>
              <th scope="col">Cobertura efectivamente abordada</th>
              <th scope="col">Recursos ejecutados anualmente en M$</th>
              <th scope="col">Total M$/Cobertura efectiva</th>
            </tr>
          </thead>
          <tbody>
            {cobertura_anual.map((data, index) => (
              <tr key={data.id}>
                <td>{index + 1}</td>
                <td>{data.anio}</td>
                <td>
                  <input
                    type="number"
                    value={editData[data.id]?.universo_cobertura || data.universo_cobertura}
                    onChange={(e) => handleChange(data.id, 'universo_cobertura', e.target.value)}
                    onBlur={() => handleBlur(data.id, 'universo_cobertura')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={editData[data.id]?.cobertura_efectivamente_abordada || data.cobertura_efectivamente_abordada}
                    onChange={(e) => handleChange(data.id, 'cobertura_efectivamente_abordada', e.target.value)}
                    onBlur={() => handleBlur(data.id, 'cobertura_efectivamente_abordada')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={editData[data.id]?.recursos_ejecutados || data.recursos_ejecutados}
                    onChange={(e) => handleChange(data.id, 'recursos_ejecutados', e.target.value)}
                    onBlur={() => handleBlur(data.id, 'recursos_ejecutados')}
                  />
                </td>
                <td>{data.total_cobertura_efectiva}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
