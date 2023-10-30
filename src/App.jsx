import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
const MainLayout = React.lazy(() => import('./layout/mainLayout'));
const Landing = React.lazy(() => import('./views/landing'));
const Login = React.lazy(() => import('./views/login'));
const GestionUsuarios = React.lazy(() => import('./views/gestion_usuarios/gestion_usuarios'))
const GestionCompetencias = React.lazy(() => import('./views/gestion_competencias/gestion_competencias'))


function App()
{
  return (
      <Suspense fallback={<div>Cargando página...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Landing />} />
            <Route path="gestion_usuarios" element={<GestionUsuarios />}></Route>
            <Route path="gestion_competencias" element={<GestionCompetencias />}></Route>
          </Route> 
        </Routes>
      </Suspense>
  );
}

export default App;