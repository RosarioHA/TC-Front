import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from './AuthContext';
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";
export const AuthProvider = ({children}) => {
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  const [userData , setUserData] = useState(null); 
  const navigate = useNavigate();

  useEffect(()=> {
    const token = localStorage.getItem('userToken');
    const userDataFromLocalStorage = localStorage.getItem('userData'); 
    if (token && userDataFromLocalStorage) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(userDataFromLocalStorage));
    }  
  }, []); 


  const login = (token, refreshToken, user) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userData', JSON.stringify(user));
    setIsLoggedIn(true);
    setUserData(user); 
  }


  const logout = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await apiTransferenciaCompentencia.post('logout/', null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error al intentar cerrar sesión:', error);
    } finally {
      // Limpia el localStorage y el estado de la aplicación
      localStorage.removeItem('userToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      setIsLoggedIn(false);
      setUserData(null);
      navigate('/');
    }
  };

  const data={
    userData,
    isLoggedIn,
    login, 
    logout
  }; 

  return (
    <AuthContext.Provider value={data}>
      {children}
      </AuthContext.Provider>
  )

}
