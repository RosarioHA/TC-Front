import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { useAuth } from "../../context/AuthContext";
import InputSearch from "../../components/forms/Input_search";
import { TableCheckbox } from "../../components/tables/TableCheck";
import { columnTitleCompetencias } from "../../Data/Usuarios";

const GestionCompetencias = () => {
  const { userData } = useAuth();
  const { dataListCompetencia, paginationCompetencia, updatePage, currentPage } = useCompetencia();
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ filteredCompetencia, setFilteredCompetencia ] = useState([]);
  const navigate = useNavigate();

  console.log("Data de competencias en GestionCompetencias:", dataListCompetencia); //trae la lista completa de competencias, sin paginacion
  console.log("Datos de paginacion en GestionCompetencias:", paginationCompetencia); // null

  const userSubdere = userData?.perfil?.includes('SUBDERE');

  useEffect(() => {
    if (dataListCompetencia) {
      // Si hay información de paginación, filtra las competencias según la página actual
      if (paginationCompetencia.results) {
        const startIndex = (paginationCompetencia.current_page - 1) * paginationCompetencia.page_size;
        const endIndex = startIndex + paginationCompetencia.results.length;
        setFilteredCompetencia(dataListCompetencia.slice(startIndex, endIndex));
      } else {
        // Si no hay información de paginación, muestra todas las competencias
        setFilteredCompetencia(dataListCompetencia);
      }
    }
  }, [dataListCompetencia, paginationCompetencia]);

  const sortOptions = {
    Estado: (direction) => (a, b) => {
      if (direction === 'asc') {
        return a.estado.localeCompare(b.estado);
      }
      // Orden descendente
      return b.estado.localeCompare(a.estado);
    }
  };

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'En Estudio': return 'badge-status-review';
      case 'Finalizada': return 'badge-status-finish';
      case 'Sin usuario sectorial': return ' badge-status-warning';
      default: return 'badge-status';
    }
  };

  // Función de búsqueda
  const handleSearch = useCallback((query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = dataListCompetencia.filter(competencia =>
      competencia.nombre.toLowerCase().includes(lowerCaseQuery) ||
      competencia.ambito.toLowerCase().includes(lowerCaseQuery) ||
      (competencia.estado ? 'activo' : 'inactivo').includes(lowerCaseQuery) ||
      competencia.origen.toLowerCase().includes(lowerCaseQuery)

    );
    setFilteredCompetencia(filtered);
  }, [ dataListCompetencia ]);
  console.log("datalistcompetencia", dataListCompetencia)

  const handleVerEstado = (competencia) => {
    console.log("Navegando a detalles con competencia:", competencia);
    navigate(`/home/estado_competencia/${competencia.id}`, { state: { competencia } });
  };
  const handleVerDetalle = (competencia) => {
    console.log("Navegando a detalles competencia:", competencia);
    navigate(`/home/editar_competencia/${competencia.id}`, { state: { competencia } });
  };

  const projectsPerPage = 10;

  const totalPages = Math.ceil(paginationCompetencia.count / projectsPerPage);

  const handlePageChange = (pageUrl) => {
    // Extrae el número de página de la URL
    console.log("page URL", pageUrl)
    const pageNumber = new URL(pageUrl, window.location.origin).searchParams.get('page');
    updatePage(pageNumber);
    console.log("filtered competencia al hacer click en flecha", filteredCompetencia)
  };


  // Modificar la función para renderizar botones de paginación
  const renderPaginationButtons = () => {
    if (!paginationCompetencia) {
      console.log("pagination competencia", paginationCompetencia)
      return null;
    }

    return (
      <div className="d-flex flex-column flex-md-row my-5">
        {/* Índice */}
        <p className="text-sans-h5 mx-5 text-center">
          {`${(currentPage - 1) * projectsPerPage + 1}- ${Math.min(currentPage * projectsPerPage, paginationCompetencia.count)} de ${paginationCompetencia.count} competencias`}
        </p>
        {/* Paginación */}
        <nav className="pagination-container mx-auto mx-md-0">
          <ul className="pagination ms-md-5">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                &lt;
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className="page-item">
                <button className={`custom-pagination-btn text-decoration-underline px-2 mx-2 ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className="container-fluid mt-2 mx-3" >
      <div className="text-sans-h2 mx-3">Listado de Competencias</div>
      {filteredCompetencia.length === 0 ? (
        <div className="container-home d-flex justify-content-center my-5 py-5 ">
          {userSubdere ? (
            <div className="flex-column my-5 py-5">
              <span className="text-sans-h2-tertiary"> Aún  no haz creado competencias</span>
              <div className="mx-5 px-5 my-2">
                <Link className="btn-primario-l py-3 link-underline link-underline-opacity-0" to='/home/crear_competencia'>
                  <u>Crear Competencia</u>
                  <span className="material-symbols-outlined mx-1">
                    post_add
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="align-self-center">
              <span className="text-sans-h2-tertiary" > Aún no hay competencias creadas</span>
            </div>
          )
          }
        </div>
      ) : (
        <><div className="d-flex flex-row mx-5">
          <div className="w-50 pl-2 text-sans-24 align-self-center">Todas las competencias</div>
          <InputSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar competencias"
            onSearch={handleSearch} />
          {userSubdere && (
            <div>
              <Link className="btn-primario-l mx-4 py-3 link-underline link-underline-opacity-0" to='/home/crear_usuario'>
                <u>Crear Competencia</u>
                <span className="material-symbols-outlined mx-1">
                  post_add
                </span>
              </Link>
            </div>
          )}
        </div><TableCheckbox
            columnTitles={columnTitleCompetencias}
            data={filteredCompetencia}
            sortableColumns={[ 'Etapa' ]}
            renderRow={(competencia, isChecked, handleCheckboxChange) => (
              <tr key={competencia.id}>
                <th scope="row">
                  <input
                    type="checkbox"
                    className="check my-3"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(competencia.id)} />
                </th>
                <td className="pt-3"><u className="text-sans-p my-4">{competencia.nombre}</u></td>
                <td className="text-primary pt-4">
                  {competencia.ambito}
                </td>
                <td>
                  <span className={`badge my-3 ${getBadgeClass(competencia.estado)}`}>
                    {competencia.estado}
                  </span>
                </td>
                <td className="pt-4">
                  <span className="badge-type">
                    {competencia.origen}
                  </span>
                </td>
                <td className="py-3 d-flex">
                  <button className="btn-secundario-s btn-sm align-self-center"
                    onClick={() => handleVerEstado(competencia)}>
                    <u>Ver estado</u>
                  </button>
                  <button className="btn-secundario-s btn-sm align-self-center ms-2"
                    onClick={() => handleVerDetalle(competencia)}>
                    <u>Ver detalle</u>
                  </button>
                </td>
              </tr>
            )}
            sortOptions={sortOptions} 
            />
            
            <div className="pagination-container d-flex justify-content-center border">
              {renderPaginationButtons()}
            </div>
        </>
      )}
    </div >
  );
};

export default GestionCompetencias;