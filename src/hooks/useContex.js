import { useContext } from 'react';
import { ApiContext } from '../context/ProjectContext';

export const useContextProject = () =>
{
  const context = useContext(ApiContext);
  if (!context)
  {
    throw new Error('useContexProject debe ser usado dentro de un ApiProvider');
  }
  return context;
};