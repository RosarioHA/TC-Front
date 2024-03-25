import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './context/ProtectedRoute';
import { FormularioProvider } from "./context/FormSectorial";
import FormularioLayout from './layout/FormularioLayout';
import { FormGoreProvider } from './context/FormGore';
import { CompetenciaProvider } from './context/competencias';
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
const SubirOficio = React.lazy(() => import('./views/gestion_competencias/Subir_oficio'));
const Minuta = React.lazy(() => import('./views/gestion_competencias/Minuta'));
const PrimeraMinutaDipres = React.lazy(() => import('./views/minutaDIPRES/primera_minuta_dipres'));
const SegundaMinutaDipres = React.lazy(() => import('./views/minutaDIPRES/segunda_minuta_dipres'));
const Error404 = React.lazy(() => import('./views/Errors/Error404'));
const Error500 = React.lazy(() => import('./views/Errors/Error500'));
const Error503 = React.lazy(() => import('./views/Errors/Error503'));
const SuccessEdicion = React.lazy(() => import('./views/success/success_edicion'));
const SuccessCreacion = React.lazy(() => import('./views/success/success_creacion'));
const SuccessFormSectorial = React.lazy(() => import('./views/success/success_formularioSectorial'));
const SuccessCierreOS = React.lazy(() => import('./views/success/success_cierreObservaciones'));
const SuccessOS = React.lazy(() => import('./views/success/success_os'));
const PasoUno = React.lazy(() => import('./views/formularioSectorial/pasoUno'));
const PasoDos = React.lazy(() => import('./views/formularioSectorial/pasoDos'));
const PasoTres = React.lazy(() => import('./views/formularioSectorial/pasoTres'));
const PasoCuatro = React.lazy(() => import('./views/formularioSectorial/pasoCuatro'));
const PasoCinco = React.lazy(() => import('./views/formularioSectorial/pasoCinco'));
const Resumen = React.lazy(() => import('./views/formularioSectorial/Resumen'));
const FormGoreLayout = React.lazy(() => import('./layout/FormGore'));
const RevisionSubdere = React.lazy(() => import('./layout/RevisionSubdereLayout'));
const PasoUnoGore = React.lazy(() => import('./views/formularioGore/pasoUno'));
const PasoDosGore = React.lazy(() => import('./views/formularioGore/pasoDos'));
const PasoTresGore = React.lazy(() => import('./views/formularioGore/pasoTres'));
const ResumenOS = React.lazy(() => import('./views/observacionesSUBDERE/ResumenOS'));
const ObservacionesSubdere = React.lazy(() => import('./views/observacionesSUBDERE/ObservacionesSubdere'));
const Paso_1_Revision = React.lazy(() => import("./views/revisionSubdere/Paso_1_revision"));
const Paso_2_Revision = React.lazy(() => import("./views/revisionSubdere/Paso_2_revision.jsx"));

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
      <CompetenciaProvider>
        <Routes>
          <Route path="/" element={<LoginLayout />}>
            <Route index element={<Landing />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/home/*" element={<MainLayout />}>
            <Route index element={<Home />} />
            {createProtectedRoute("crear_usuario", CrearUsuario, [ 'SUBDERE' ])}
            {createProtectedRoute("administrar_usuarios", GestionUsuarios, [ 'SUBDERE', 'Usuario Observador' ])}
            {createProtectedRoute("editar_usuario/:id", EditarUsuario, [ 'SUBDERE', 'Usuario Observador' ])}
            {createProtectedRoute("success_edicion", SuccessEdicion, [ 'SUBDERE', 'Usuario Observador' ])}
            {createProtectedRoute("success_creacion", SuccessCreacion, [ 'SUBDERE', 'Usuario Observador' ])}
            {createProtectedRoute("success_creacion", SuccessOS, SuccessCierreOS, [ 'SUBDERE' ])}
            {createProtectedRoute("listado_competencias", GestionCompetencias, [ 'SUBDERE', 'Usuario Observador' ])}
            {createProtectedRoute("editar_competencia/:id", EditarCompetencia, [ 'SUBDERE', 'Usuario Observador' ])}
            {createProtectedRoute("crear_competencia", CreacionCompetencia, [ 'SUBDERE', 'Usuario Observador' ])}
            {createProtectedRoute("estado_competencia/:id/subir_oficio/:etapaNum/:subetapaId", SubirOficio, [ 'SUBDERE', 'Usuario Observador' ])}
            <Route path="estado_competencia/:id/" element={<EstadoCompentencia />} />
            <Route path="success_edicion" element={<SuccessEdicion />} />
            <Route path="success_creacion" element={<SuccessCreacion />} />
            <Route path="success_formulario_sectorial/:id/" element={<FormularioProvider> <SuccessFormSectorial /> </FormularioProvider>} />
            <Route path="success_observaciones_subdere/:id/" element={<FormularioProvider> <SuccessOS /> </FormularioProvider>} />
            <Route path="success_cierre_observaciones/:id/" element={<FormularioProvider> <SuccessCierreOS /> </FormularioProvider>} />
            <Route
              path="observaciones_subdere/:id/"
              element={
                <FormularioProvider>
                  <ObservacionesSubdere />
                </FormularioProvider>
              } />
            <Route
              path="formulario_sectorial/:id"
              element={
                <FormularioProvider>
                  <ProtectedRoute allowedProfiles={[ 'Usuario Sectorial', 'SUBDERE', 'Usuario Observador' ]}>
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
              <Route path="resumen_formulario" element={<Resumen />} />
              <Route path="resumen_os" element={<ResumenOS />} />
            </Route>
            <Route
              path="formulario_gore/:id"
              element={
                <FormGoreProvider>
                  <ProtectedRoute allowedProfiles={[ 'Usuario Sectorial', 'SUBDERE', 'Usuario Observador', 'GORE' ]}>
                    <FormGoreLayout />
                  </ProtectedRoute>
                </FormGoreProvider>
              }
            >
              <Route index element={<PasoUno />} />
              <Route path="paso_1" element={<PasoUnoGore />} />
              <Route path="paso_2" element={<PasoDosGore />} />
              <Route path="paso_3" element={<PasoTresGore />} />
              <Route path="Resumen_formulario_gore" element={<Resumen />} />
            </Route>
            <Route
              path="revision_subdere/:id"
              element={
                // <FormGoreProvider>
                <ProtectedRoute allowedProfiles={[ 'Usuario Sectorial', 'SUBDERE', 'Usuario Observador', 'GORE' ]}>
                  <RevisionSubdere />
                </ProtectedRoute>
                // </FormGoreProvider>
              }
            >
              <Route index element={<PasoUno />} />
              <Route path="paso_1" element={<Paso_1_Revision />} />
              <Route path="paso_2" element={<Paso_2_Revision />} />
              <Route path="resumen_revision_final" element={<Resumen />} />
            </Route>


            {/* <Route path="minuta_dipres/:id" >
              <Route index element={<PrimeraMinutaDipres />} />
              <Route path="segunda_minuta_dipres" element={<SegundaMinutaDipres />} />
            </Route> */}
            <Route path="minuta_dipres/:id">
              {createProtectedRoute("", PrimeraMinutaDipres, ['SUBDERE', 'Usuario Observador', 'DIPRES'])}
              {createProtectedRoute("segunda_minuta_dipres", SegundaMinutaDipres, ['SUBDERE', 'Usuario Observador', 'DIPRES'])}
            </Route>

            <Route path="agregar_minuta" element={<Minuta />}></Route>
            <Route path="*" element={<Error404 />} />
            <Route path="404" element={<Error404 />} />
            <Route path="500" element={<Error500 />} />
            <Route path="503" element={<Error503 />} />
          </Route>
        </Routes>
      </CompetenciaProvider>
    </Suspense >

  );
}

export default App;