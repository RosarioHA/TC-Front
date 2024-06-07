import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { useAuth } from "../../context/AuthContext";
import InputSearch from "../../components/forms/Input_search";
import { TableCheckbox } from "../../components/tables/TableCheck";
import { columnTitleCompetencias } from "../../Data/Usuarios";

const GestionCompetencias = () => {
  const { userData } = useAuth();
  const {
    dataListCompetencia,
    paginationCompetencia,
    currentPageCompetencia,
    setCurrentPageCompetencia,
    updateSearchTerm,
  } = useCompetencia();
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ filteredCompetencia, setFilteredCompetencia ] = useState([]);
  const navigate = useNavigate();
  const [ hasSearched, setHasSearched ] = useState(false);

  const userSubdere = userData?.perfil?.includes('SUBDERE');
  const projectsPerPage = 10;
  const totalPages = Math.ceil(paginationCompetencia.count / projectsPerPage);

  useEffect(() => {
    if (dataListCompetencia) {
      // Si hay información de paginación, filtra los usuarios según la página actual
      if (currentPageCompetencia && currentPageCompetencia.results) {
        const startIndex = (currentPageCompetencia.current_page - 1) * currentPageCompetencia.page_size;
        const endIndex = startIndex + currentPageCompetencia.results.length;
        setFilteredCompetencia(dataListCompetencia.slice(startIndex, endIndex));
      } else {
        // Si no hay información de paginación, muestra todos los usuarios
        setFilteredCompetencia(dataListCompetencia);
      }
    }
  }, [ dataListCompetencia, currentPageCompetencia ]);

  useEffect(() => {
    // Actualiza los datos filtrados cuando cambian los datos de competencia o la página actual
    if (dataListCompetencia && paginationCompetencia) {
      setFilteredCompetencia(dataListCompetencia);
    }
  }, [ dataListCompetencia, paginationCompetencia ])

  useEffect(() => {
    // Asegúrate de que dataListCompetencia tenga la estructura esperada
    if (dataListCompetencia && Array.isArray(dataListCompetencia.results)) {
      setFilteredCompetencia(dataListCompetencia.results);
    }
  }, [ dataListCompetencia ]);

  const handlePageChange = (newPage) => {
    setCurrentPageCompetencia(newPage);
  };

  const sortOptions = {
    Estado: (direction) => (a, b) => {
      // Asegurándose de que los estados existen para evitar errores
      const estadoA = a.estado || '';
      const estadoB = b.estado || '';

      if (direction === 'asc') {
        return estadoA.localeCompare(estadoB);
      }
      // Orden descendente
      return estadoB.localeCompare(estadoA);
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
    setSearchQuery(query);
    updateSearchTerm(query);
    setHasSearched(true);
  }, [ updateSearchTerm ]);

  const handleVerEstado = (competencia) => {
    navigate(`/home/estado_competencia/${competencia.id}`, { state: { competencia } });
  };
  const handleVerDetalle = (competencia) => {
    navigate(`/home/editar_competencia/${competencia.id}`, { state: { competencia } });
  };

  // Modificar la función para renderizar botones de paginación
  const renderPaginationButtons = () => {
    if (!paginationCompetencia || totalPages <= 1) {
      return null;
    }

    return (
      <div className="d-flex flex-column flex-md-row my-5">
        <p className="text-sans-h5 mx-5 text-center">
          {`${Math.max((parseInt(currentPageCompetencia) - 1) * projectsPerPage + 1, 1)}- ${Math.min(parseInt(currentPageCompetencia) * projectsPerPage, paginationCompetencia.count)} de ${paginationCompetencia.count} competencias`}
        </p>
        <nav className="pagination-container mx-auto mx-md-0">
          <ul className="pagination ms-md-5">
            <li className={`page-item ${currentPageCompetencia === 1 ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(currentPageCompetencia - 1)} disabled={currentPageCompetencia === 1}>

                &lt;
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${currentPageCompetencia === i + 1 ? 'active' : ''}`}>
                <button className="custom-pagination-btn px-2 mx-2" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPageCompetencia === totalPages ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(currentPageCompetencia + 1)} disabled={currentPageCompetencia === totalPages}>
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className="container col-10 container-xxl-11 container-xxl-fluid mt-2">
      <div className="text-sans-h2 mx-3">Listado de Competencias</div>

      <div className="d-flex flex-row me-5 ms-2 my-4">
        <div className="w-50 pl-2 text-sans-24 align-self-center">Todas las competencias</div>
        <InputSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar competencias"
          onSearch={handleSearch}
        />
        {userSubdere && (
          <div>
            <Link className="btn-primario-l mx-4 py-3 link-underline link-underline-opacity-0" to='/home/crear_competencia'>
              <u>Crear Competencia</u>
              <span className="material-symbols-outlined mx-1">
                post_add
              </span>
            </Link>
          </div>
        )}
      </div>

      {filteredCompetencia.length === 0 && hasSearched && (
        <div className="text-center">
          <span>No se han encontrado resultados para su búsqueda</span>
        </div>
      )}

      {filteredCompetencia.length > 0 && (
        <div className="px-2">
          <TableCheckbox
            columnTitles={columnTitleCompetencias}
            data={filteredCompetencia}
            sortableColumns={[]}
            renderRow={(competencia) => (
              <tr key={competencia.id}>
                <td className="ps-3 col-4">
                  <u className="text-sans-p my-4">{competencia.nombre}</u>
                </td>
                <td className="text-primary pt-4 col-2">{competencia.ambito}</td>
                <td className="col-1">
                  <span className={`badge my-3 ${getBadgeClass(competencia.estado)}`}>
                    {competencia.estado}
                  </span>
                </td>
                <td className="col-2 pt-4">
                  <span className="badge-type">{competencia.origen}</span>
                </td>
                <td className="py-4 flex-grow ">
                  <div className="d-flex">
                    <button
                      className="btn-secundario-s btn-sm align-self-center"
                      onClick={() => handleVerEstado(competencia)}
                    >
                      <u>Ver estado</u>
                    </button>
                    <button
                      className="btn-secundario-s btn-sm align-self-center ms-2"
                      onClick={() => handleVerDetalle(competencia)}
                    >
                      <u>Ver detalle</u>
                    </button>
                  </div>
                </td>
              </tr>
            )}
            sortOptions={sortOptions}
          />
        </div>
      )}
      {paginationCompetencia && paginationCompetencia.count > 0 && (
        <div className="pagination-container d-flex justify-content-center">
          {renderPaginationButtons()}
        </div>
      )}

    </div>
  );
};

export default GestionCompetencias;