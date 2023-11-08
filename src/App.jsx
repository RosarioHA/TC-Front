import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
const Muestrario = React.lazy(() => import('./views/muestrario'));
const MainLayout = React.lazy(() => import('./layout/mainLayout'));
const Home = React.lazy(() => import('./views/home'));
const Landing = React.lazy(() => import('./views/landing'));
const GestionUsuarios = React.lazy(() => import('./views/gestion_usuarios/gestion_usuarios'))
const CrearUsuario = React.lazy(() => import('./views/gestion_usuarios/creacion_usuario'))
const EditarUsuario = React.lazy(() => import('./views/gestion_usuarios/edicion_usuario'))
const GestionCompetencias = React.lazy(() => import('./views/gestion_competencias/gestion_competencias'))
const CrearCompetencia = React.lazy(() => import('./views/gestion_competencias/creacion_competencia'))
const EditarCompetencia = React.lazy(() => import('./views/gestion_competencias/edicion_competencia'))


function App()
{
  return (
      <Suspense fallback={<div>Cargando página...</div>}>
        <Routes>
          <Route path="/muestrario" element={<Muestrario />} />
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="administrar_usuarios" element={<GestionUsuarios />}></Route>
            <Route path="crear_usuario" element={<CrearUsuario />}></Route>
            <Route path="editar_usuario" element={<EditarUsuario />}></Route>
            <Route path="gestion_competencias" element={<GestionCompetencias />}></Route>
            <Route path="crear_competencia" element={<CrearCompetencia />}></Route>
            <Route path="editar_competencia" element={<EditarCompetencia />}></Route>
          </Route> 
        </Routes>
      </Suspense>
  );
}

export default App;