import { useState, useEffect, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useUsers = () => {
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ metadata, setMetadata ] = useState({ count: 0, next: null, previous: null });
  const [ pagination, setPagination ] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiTransferenciaCompentencia.get(`/users/?page=${pagination}`);
      const { data } = response;

      setUsers(data.results);
      setMetadata({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [ pagination ]);

  useEffect(() => {
    fetchUsers();
  }, [ fetchUsers ]);

  // Función para actualizar la página actual
  const updatePage = (newPage) => {
    console.log("Updating page:", newPage);
    setPagination(newPage);
  };

  // Agregar la función updateUrl al objeto devuelto
  const updateUrl = (url) => {
    // Lógica para actualizar la URL si es necesario
    console.log("Updating URL:", url);
    setPagination(url);
  };

  return { users, loading, error, pagination, updatePage, updateUrl, setPagination, metadata, setMetadata };
};
