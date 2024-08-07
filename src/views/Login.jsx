import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../context/AuthContext";



const Login = () =>
{
  const [ formData, setFormData ] = useState({
    rut: '',
    password: '',
  });

  const [ errorMessage, setErrorMessage ] = useState('');

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { login, loading, error, data } = useLogin();

  const handleChange = (e) =>
  {
    setFormData({ ...formData, [ e.target.name ]: e.target.value });
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    setErrorMessage(''); // Limpiar mensajes de error anteriores
    await login(formData);
  };

  useEffect(() =>
  {
    if (data)
    {
      authLogin(data.token, data[ 'refresh-token' ], data.user);
      navigate('/home');
    }
    if (error)
    {
      console.error('Error en el inicio de sesión:', error);
      setErrorMessage(error); // Usar directamente el error proporcionado por el hook
    }
  }, [ data, error, navigate, authLogin ]);


  return (
    <div className="container p-0">
      <div className="d-flex align-items-center">

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item "><a className="breadcrumbs" href="/">Inicio</a></li>
            <li className="breadcrumb-item active" aria-current="page">Inicio de sesión</li>
          </ol>
        </nav>
      </div>

      <div className="d-flex justify-content-center p-4">
        <div className="col-lg-5 px-sm-5 px-lg-5 login-container">
          <div className="row ms-0 d-none d-md-flex">
            <div id="lineBlue" />
            <div id="lineRed" />
          </div>
          <p className="logo-subdere mt-1 ms-0 d-none d-md-block">Subsecretaría de Desarrollo Administrativo y Regional</p>

          <div className="px-3">
            <h2 className="text-serif-h2 text-center mb-2">Plataforma de Gestión de Transferencia de Competencias</h2>
            <h3 className="text-sans-p text-center">Requiere credenciales otorgadas por la Subdere</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor='rut'></label>
              <input
                className="my-3 col-12 p-2"
                placeholder='Ingresa tu RUT'
                type='text'
                id='rut'
                name='rut'
                value={formData.rut}
                onChange={handleChange}
              />
              <label htmlFor='password'></label>
              <input
                className="my-4 col-12 p-2"
                placeholder='Ingresa tu contraseña'
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
              />
              <div className="d-flex justify-content-end">
                <button className="btn-primario-s mt-3 mb-2 px-5 text-decoration-underline" type="submit">
                  Ingresar al portal 
                </button>
              </div>
            </form>
            {loading && (
              <>
                <span className="placeholder col-12 bg-primary"></span>
                <div className="text-sans-h5-medium text-center"><p>Verificando usuario...</p>
                </div>
              </>
            )}
            {/* Muestra el mensaje de error si existe */}
            {errorMessage && <p className="text-sans-h6-darkred">{errorMessage}</p>}


            <h3 className="text-sans-p mt-2">¿No tienes credenciales para ingresar? <br /></h3>
          </div>

        </div>
      </div>

    </div>


  )
}

export default Login