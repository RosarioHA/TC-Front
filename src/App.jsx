import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './context/ProtectedRoute';
import { FormularioProvider } from "./context/FormSectorial";
import FormularioLayout from './layout/FormularioLayout';
const Muestrario = React.lazy(() => import('./views/muestrario'));
const MainLayout = React.lazy(() => import('./layout/mainLayout'));
const Home = React.lazy(() => import('./views/home'));
const Landing = React.lazy(() => import('./views/landing'));
const Login = React.lazy(() => import('./views/Login'));
const LoginLayout = React.lazy(() => import('./layout/LoginLayout'));
const GestionUsuarios = React.lazy(() => import('./views/gestion_usuarios/gestion_usuarios'));
const CrearUsuario = React.lazy(() => import('./views/gestion_usuarios/creacion_usuario'));
const EditarUsuario = React.lazy(() => import('./views/gestion_usuarios/edicion_usuario'));
const GestionCompetencias = React.lazy(() => import('./views/gestion_competencias/gestion_competencias'));
const CreacionCompetencia = React.lazy(() => import('./views/gestion_competencias/creacion_competencia'));
const EditarCompetencia = React.lazy(() => import('./views/gestion_competencias/edicion_competencia'));
const EstadoCompentencia = React.lazy(() => import('./views/gestion_competencias/Estado_compentencia'));
const Observaciones = React.lazy(() => import('./views/gestion_competencias/Observaciones'));
const Minuta = React.lazy(() => import('./views/gestion_competencias/Minuta'));
const Error404 = React.lazy(() => import('./views/Errors/Error404'));
const Error500 = React.lazy(() => import('./views/Errors/Error500'));
const Error503 = React.lazy(() => import('./views/Errors/Error503'));
const Success = React.lazy(() => import('./views/success'));
const PasoUno = React.lazy(() => import('./views/formularioSectorial/pasoUno'));
const PasoDos = React.lazy(() => import('./views/formularioSectorial/pasoDos'));
const PasoTres = React.lazy(() => import('./views/formularioSectorial/pasoTres'));
const PasoCuatro = React.lazy(() => import('./views/formularioSectorial/pasoCuatro'));
const PasoCinco = React.lazy(() => import('./views/formularioSectorial/pasoCinco'));
const Resumen = React.lazy(()=> import('./views/formularioSectorial/Resumen'));
const PasoUnoOS = React.lazy(() => import('./views/observacionesSUBDERE/pasoUnoOS'));


const createProtectedRoute = (path, Component, allowedProfiles) => (
  <Route
    path={path}
    element={
      <ProtectedRoute allowedProfiles={allowedProfiles}>
        <Component />
      </ProtectedRoute>
    }
  />
);

function App()
{
  return (
    <Suspense fallback={<div>Cargando página...</div>}>
      <Routes>
        <Route path="/muestrario" element={<Muestrario />} />
        <Route path="/" element={<LoginLayout />}>
          <Route index element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/home/*" element={<MainLayout />}>
          <Route index element={<Home />} />
          {createProtectedRoute("crear_usuario", CrearUsuario, [ 'SUBDERE' ])}
          {createProtectedRoute("administrar_usuarios", GestionUsuarios, [ 'SUBDERE', 'Usuario Observador' ])}
          {createProtectedRoute("editar_usuario/:id", EditarUsuario, [ 'SUBDERE', 'Usuario Observador' ])}
          {createProtectedRoute("listado_competencias", GestionCompetencias, [ 'SUBDERE', 'Usuario Observador' ])}
          <Route path="crear_competencia" element={<CreacionCompetencia />} />
          <Route path="estado_competencia/:id" element={<EstadoCompentencia />} />
          <Route path="editar_competencia/:id" element={<EditarCompetencia />} />
          <Route path="success" element={<Success />} />
          <Route
            path="formulario_sectorial/:id"
            element={
              <FormularioProvider>
                <ProtectedRoute allowedProfiles={[ 'Usuario Sectorial' ]}>
                  <FormularioLayout />
                </ProtectedRoute>
              </FormularioProvider>
            }
          >
            <Route index element={<PasoUno />} />
            <Route path="paso_1" element={<PasoUno />} />
            <Route path="paso_2" element={<PasoDos />} />
            <Route path="paso_3" element={<PasoTres />} />
            <Route path="paso_4" element={<PasoCuatro />} />
            <Route path="paso_5" element={<PasoCinco />} />
            <Route path="Resumen_formulario" element={<Resumen/>}/>
          </Route>
          <Route
            path="revision_formulario_sectorial/:id"
            element={
              <FormularioProvider>
                <ProtectedRoute allowedProfiles={[ 'SUBDERE','Usuario Observador','Usuario Sectorial' ]}>
                  <FormularioLayout />
                </ProtectedRoute>
              </FormularioProvider>
            }
          >
            <Route index element={<PasoUnoOS />} />
            <Route path="paso_1" element={<PasoUnoOS />} />
            <Route path="paso_2" element={<PasoDos />} />
            <Route path="paso_3" element={<PasoTres />} />
            <Route path="paso_4" element={<PasoCuatro />} />
            <Route path="paso_5" element={<PasoCinco />} />
            <Route path="Resumen_formulario" element={<Resumen/>}/>
          </Route>


          <Route path="ingresar_observaciones" element={<Observaciones />}></Route>
          <Route path="agregar_minuta" element={<Minuta />}></Route>
          <Route path="*" element={<Error404 />} />
          <Route path="404" element={<Error404 />} />
          <Route path="500" element={<Error500 />} />
          <Route path="503" element={<Error503 />} />
        </Route>
      </Routes>
    </Suspense >

  );
}

export default App;