import { useContext } from 'react';
import { AuthContext } from "./AuthContext";

export const ProtectedRoute = ({ children, allowedProfiles }) =>
{
  const user = useContext(AuthContext);

  // Comprobación de permisos
  if (!user || !allowedProfiles.includes(user.userData.perfil))
  {
    return (
      <div className="m-5">
        <h2>Acceso Denegado</h2>
        <p>No tienes permiso para acceder a esta página.</p>
      </div>
    );
  }
  return children;
}
