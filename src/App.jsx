import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './context/ProtectedRoute';
import { FormularioProvider } from "./context/FormSectorial";
import FormularioLayout from './layout/FormularioLayout';
import { FormGoreProvider } from './context/FormGore';
import { CompetenciaProvider } from './context/competencias';
import { FormSubdereProvider } from './context/RevisionFinalSubdere.jsx';
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
const SubirOficioDipres = React.lazy(() => import('./views/fase1/minutaDIPRES/oficio_dipres.jsx'));
const SubirOficioGore = React.lazy(() => import('./views/fase1/formularioGore/oficio_gore.jsx'));
const PrimeraMinutaDipres = React.lazy(() => import('./views/fase1/minutaDIPRES/primera_minuta_dipres'));
const SegundaMinutaDipres = React.lazy(() => import('./views/fase1/minutaDIPRES/segunda_minuta_dipres'));
const ObservacionesSubdereDipres = React.lazy(() => import('./views/fase1/minutaDIPRES/observaciones_subdere.jsx'));
const ObservacionesSubdereGore = React.lazy(() => import('./views/fase1/formularioGore/observaciones_subdere_gore.jsx'));
const Error404 = React.lazy(() => import('./views/Errors/Error404'));
const Error500 = React.lazy(() => import('./views/Errors/Error500'));
const Error503 = React.lazy(() => import('./views/Errors/Error503'));
const SuccessEdicion = React.lazy(() => import('./views/success/success_edicion'));
const SuccessCreacion = React.lazy(() => import('./views/success/success_creacion'));
const SuccessFormSectorial = React.lazy(() => import('./views/success/success_formularioSectorial'));
const SuccessFormGore = React.lazy(() => import('./views/success/success_formularioGore'));
const SuccessCierreOS = React.lazy(() => import('./views/success/success_cierreObservaciones'));
const SuccessOS_Gore = React.lazy(() => import('./views/success/success_OS_formGore.jsx'));
const SuccessOS = React.lazy(() => import('./views/success/success_os'));
const PasoUno = React.lazy(() => import('./views/fase1/formularioSectorial/pasoUno'));
const PasoDos = React.lazy(() => import('./views/fase1/formularioSectorial/pasoDos'));
const PasoTres = React.lazy(() => import('./views/fase1/formularioSectorial/pasoTres'));
const PasoCuatro = React.lazy(() => import('./views/fase1/formularioSectorial/pasoCuatro'));
const PasoCinco = React.lazy(() => import('./views/fase1/formularioSectorial/pasoCinco'));
const Resumen = React.lazy(() => import('./views/fase1/formularioSectorial/Resumen'));
const ResumenGore = React.lazy(() => import('./views/fase1/formularioGore/ResumenGore'));
const FormGoreLayout = React.lazy(() => import('./layout/FormGore'));
const RevisionSubdere = React.lazy(() => import('./layout/RevisionSubdereLayout'));
const PasoUnoGore = React.lazy(() => import('./views/fase1/formularioGore/pasoUno'));
const PasoDosGore = React.lazy(() => import('./views/fase1/formularioGore/pasoDos'));
const PasoTresGore = React.lazy(() => import('./views/fase1/formularioGore/pasoTres'));
const ResumenOS = React.lazy(() => import('./views/fase1/observacionesSUBDERE/ResumenOS'));
const ResumenOS_Gore = React.lazy(() => import('./views/fase1/formularioGore/ResumenGore.jsx'));
const ObservacionesSubdere = React.lazy(() => import('./views/fase1/observacionesSUBDERE/ObservacionesSubdere'));
const Paso_1_Revision = React.lazy(() => import("./views/fase1/revisionSubdere/Paso_1_revision"));
const Paso_2_Revision = React.lazy(() => import("./views/fase1/revisionSubdere/Paso_2_revision"));
const ResumenFinal = React.lazy(() => import('./views/fase1/revisionSubdere/Resumen'));
const SuccessRevisionFinal = React.lazy(() => import('./views/success/success_revision_final'));
const OficioDipres2 = React.lazy(() => import("./views/fase1/minutaDIPRES/segundo_oficio"));
const RecomendacionPostCIDLayout = React.lazy(() => import('./layout/RecomendacionPostCIDLayout'));
const EstadoSeguimiento = React.lazy(() => import('./views/fase2/Estado_seguimiento.jsx'));
const Recomendacion_paso1 = React.lazy(() => import('./views/fase2/recomendacionPostCID/pasoUno.jsx'));
const Recomendacion_paso2 = React.lazy(() => import('./views/fase2/recomendacionPostCID/pasoDos.jsx'));
const FormularioPlazosLayout = React.lazy(() => import('./layout/FormularioPlazosLayout.jsx'))
const FormularioDDR = React.lazy (() => import ('./views/fase2/formularioDDR/formularioDDR.jsx'))

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
    <Suspense fallback={<div className="container">
      <div className="d-flex align-items-center flex-column my-5 px-5 ">
        <div className="text-center text-sans-h5-medium-blue ">Cargando Página</div>
        <span className="placeholder col-10 bg-primary"></span>
      </div>
    </div >}>
      <Routes>
        <Route path="/" element={<LoginLayout />}>
          <Route index element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/home/*" element={
          <CompetenciaProvider>
            <MainLayout />
          </CompetenciaProvider>
        }>
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
          {createProtectedRoute("estado_competencia/:id/subir_oficio_sectorial", SubirOficio, [ 'SUBDERE', 'Usuario Observador' ])}
          {createProtectedRoute("estado_competencia/:id/subir_oficio_dipres", SubirOficioDipres, [ 'SUBDERE', 'Usuario Observador' ])}
          {createProtectedRoute("estado_competencia/:id/subir_segundo_oficio_dipres", OficioDipres2, [ 'SUBDERE', 'Usuario Observador' ])}
          {createProtectedRoute("estado_competencia/:id/subir_oficio_gore", SubirOficioGore, [ 'SUBDERE', 'Usuario Observador' ])}
          <Route path="estado_competencia/:id/" element={<EstadoCompentencia />} />
          <Route path="estado_seguimiento/:id/" element={<EstadoSeguimiento />} />
          <Route path="success_edicion" element={<SuccessEdicion />} />
          <Route path="success_creacion" element={<SuccessCreacion />} />
          <Route path="success_formulario_sectorial/:id/" element={<FormularioProvider> <SuccessFormSectorial /> </FormularioProvider>} />
          <Route path="success_observaciones_subdere/:id/" element={<FormularioProvider> <SuccessOS /> </FormularioProvider>} />
          <Route path="success_cierre_observaciones/:id/" element={<FormularioProvider> <SuccessCierreOS /> </FormularioProvider>} />
          <Route path="success_cierre_observaciones_gore/:id/" element={<FormGoreProvider> <SuccessOS_Gore /> </FormGoreProvider>} />
          <Route path="success_formulario_gore/:id/" element={<FormGoreProvider> <SuccessFormGore /> </FormGoreProvider>} />
          <Route path="success_revision_final/:id/" element={<FormSubdereProvider> <SuccessRevisionFinal /> </FormSubdereProvider>} />
          <Route
            path="observaciones_subdere/:id/"
            element={
              <FormularioProvider>
                  <ProtectedRoute allowedProfiles={[ 'Usuario Sectorial', 'SUBDERE','DIPRES' ]}>
                <ObservacionesSubdere />
                </ProtectedRoute>
              </FormularioProvider>
            } />
          <Route
            path="formulario_sectorial/:id"
            element={
              <FormularioProvider>
                <ProtectedRoute allowedProfiles={[ 'Usuario Sectorial', 'SUBDERE', 'Usuario Observador', 'DIPRES', 'GORE' ]}>
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
                <ProtectedRoute allowedProfiles={[ 'Usuario Sectorial', 'SUBDERE', 'Usuario Observador', 'GORE', 'DIPRES' ]}>
                  <FormGoreLayout />
                </ProtectedRoute>
              </FormGoreProvider>
            }
          >
            <Route index element={<PasoUno />} />
            <Route path="paso_1" element={<PasoUnoGore />} />
            <Route path="paso_2" element={<PasoDosGore />} />
            <Route path="paso_3" element={<PasoTresGore />} />
            <Route path="resumen_observaciones_gore" element={<ResumenOS_Gore />} />
            <Route path="resumen_formulario_gore" element={<ResumenGore />} />
          </Route>

          <Route
            path="formulario_gore/:id/observaciones_subdere"
            element={
              <FormGoreProvider>
                <ProtectedRoute allowedProfiles={[ 'Usuario Sectorial', 'SUBDERE', 'Usuario Observador', 'GORE' ,'DIPRES']}>
                  <ObservacionesSubdereGore />
                </ProtectedRoute>
              </FormGoreProvider>

            } />

          <Route
            path="revision_subdere/:id"
            element={
              <FormSubdereProvider>
                <ProtectedRoute allowedProfiles={[ 'Usuario Sectorial', 'SUBDERE', 'Usuario Observador', 'GORE' ]}>
                  <RevisionSubdere />
                </ProtectedRoute>
              </FormSubdereProvider>
            }
          >
            <Route path="paso_1" element={<Paso_1_Revision />} />
            <Route path="paso_2" element={<Paso_2_Revision />} />
            <Route path="resumen_revision_final" element={<ResumenFinal />} />
          </Route>

          <Route path="minuta_dipres/:id">
            {createProtectedRoute("", PrimeraMinutaDipres, [ 'SUBDERE', 'Usuario Observador', 'DIPRES','Usuario Sectorial'])}
            {createProtectedRoute("segunda_minuta_dipres", SegundaMinutaDipres, [ 'SUBDERE', 'Usuario Observador', 'DIPRES','Usuario Sectorial' ])}
            {createProtectedRoute("observaciones_subdere", ObservacionesSubdereDipres, [ 'SUBDERE', 'Usuario Observador','Usuario Sectorial','DIPRES' ])}
          </Route>

          <Route
            path="recomendacion_post_cid/:id"
            element={
              <FormSubdereProvider>
                <ProtectedRoute allowedProfiles={[ 'SUBDERE', 'GORE' ]}>
                  <RecomendacionPostCIDLayout />
                </ProtectedRoute>
              </FormSubdereProvider>
            }
          >
            <Route path="estado_seguimiento" element={<EstadoSeguimiento />} />
            <Route path="paso_1" element={<Recomendacion_paso1 />} />
            <Route path="paso_2" element={<Recomendacion_paso2 />} />
            <Route path="resumen_revision_final" element={<ResumenFinal />} />
          </Route>

          <Route
            path="definicion_plazos/:id"
            element={
              <FormSubdereProvider>
                <ProtectedRoute allowedProfiles={[ 'SUBDERE', 'GORE' ]}>
                  <FormularioPlazosLayout />
                </ProtectedRoute>
              </FormSubdereProvider>
            }
          >
            <Route path="formulario" element={<FormularioDDR />} />
          </Route>

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