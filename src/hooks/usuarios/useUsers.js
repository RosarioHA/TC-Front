import { useState, useEffect, useCallback } from 'react';
import { apiTransferenciaCompentencia } from '../../services/transferenciaCompetencia';

export const useUsers = () =>
{
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ pagination, setPagination ] = useState({ count: 0, next: null, previous: null });
  const [ currentPage, setCurrentPage ] = useState(1);

  const fetchUsers = useCallback(async () =>
  {
    setLoading(true);
    try
    {
      const response = await apiTransferenciaCompentencia.get(`/users/?page=${currentPage}`);
      const { data, count, next, previous } = response;
      setUsers(data.results);
      setPagination({ count, next, previous });
    } catch (err)
    {
      console.error(err);
      setError(err);
    } finally
    {
      setLoading(false);
    }
  }, [ currentPage ]);

  useEffect(() =>
  {
    fetchUsers();
  }, [ fetchUsers ]);

  // Función para actualizar la página actual
  const updatePage = (newPage) =>
  {
    setCurrentPage(newPage);
  };
  return { users, loading, error, pagination, updatePage };
};
