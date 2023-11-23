import { useLocation } from "react-router-dom";

const DetalleUsuario = () =>
{
  const location = useLocation();
  const user = location.state.user;

  console.log(user)

  return (
    <div className="m-5">
      <h3>Detalle del Usuario</h3>
      <p>Nombre: {user.nombre_completo}</p>
      <p>Rut:{user.rut}</p>
      <p>Estado: {user.is_active}</p>
      <p>Perfil: {user.perfil}</p>
      <p>emial: {user.email}</p>
      <p>region:{user.region}</p>
    </div>
  );
};

export default DetalleUsuario;