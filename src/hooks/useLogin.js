import { useState, useContext } from "react";
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";
import { generateCodeVerifier, generateCodeChallenge, encrypt, decryptCodeVerifier } from '../config/authUtils';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useLogin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async ({ rut, password }) => {
    if (!rut || !password) {
      setError("RUT y contraseña son necesarios.");
      return; // Evitar la ejecución si los campos necesarios están vacíos
    }

    setLoading(true);
    setError(null); // Limpiar errores anteriores antes de una nueva solicitud
    try {
      const response = await apiTransferenciaCompentencia.post('login/', {
        rut,
        password
      });
      setData(response.data);
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('refreshToken', response.data['refresh-token']);
    } catch (error) {
      const errMsg = error.response ? error.response.data.error || "Error al conectar con el servidor" : "Error en la conexión con el servidor. Intenta de nuevo más tarde.";
      console.error('Error en login:', errMsg);
      setError(errMsg); 
    } finally {
      setLoading(false);
    }
  };

//=============================================================================KEY CLOAK CONFIGURATION=============================================================================

  const loginWithKeycloak = async () => {
    setLoading(true);
    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const encryptedCodeVerifier = encrypt(codeVerifier); 

      localStorage.setItem('codeVerifier', codeVerifier);

      const redirectUri = import.meta.env.VITE_KEYCLOAK_REDIRECT_URI;
      const clientId = import.meta.env.VITE_KEYCLOAK_RESOURCE;
      const keycloakAuthUrl = import.meta.env.VITE_KEYCLOAK_AUTH_URL;

      console.log(keycloakAuthUrl)

      const state = encodeURIComponent(encryptedCodeVerifier);

      const authUrl = `${keycloakAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;
      console.log(authUrl)
      window.location.href = authUrl;

      localStorage.setItem('isKeycloak', 'true');
    } catch (initError) {
      setError(`Error initializing login process: ${initError}`);
      console.error('Error during login initialization:', initError);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthentication = async (code, state) => {
    setLoading(true);
    try {
      const codeVerifier = decryptCodeVerifier(state);

      const response = await apiTransferenciaCompentencia.post('/callback/', {
        code,
        codeVerifier
      });

      if (response.data && response.data.access_token && response.data.refresh_token) {
        localStorage.setItem('userToken', response.data.access_token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        localStorage.setItem('refreshToken', response.data.refresh_token);
        console.log("refresh token handle: ", refreshToken)
        const expiresAt = new Date().getTime() + (response.data.expires_in * 1000);
        localStorage.setItem('tokenExpiry', expiresAt.toString());
        localStorage.setItem('authMethod', 'keycloak');
        setData(response.data);
        globalLogin(response.data.access_token, response.data.refresh_token, response.data.user);

        navigate('/home/');
      } else {
        throw new Error("La respuesta del servidor no incluye los tokens necesarios.");
      }
    } catch (error) {
      console.error('Error during the authentication process:', error);
      setError(`Error during the authentication process: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
      console.log("Pasó HandleAuthentication")
    }
  };

  const isTokenExpired = () => {
    const expiry = localStorage.getItem('tokenExpiry');
    console.log("¿Token expired?: ", expiry)
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  };

  const refreshAccessToken = async () => {
    setLoading(true);
    try {
      if (isTokenExpired()) {
        console.log("istoken expired? 2: ", isTokenExpired)
        const refreshToken = localStorage.getItem('refreshToken');
        console.log("Refresh token: ", refreshToken)
        if (!refreshToken) {
          console.error("Refresh token not found.");
          setError("Login required.");
          setLoading(false);
          return;
        }

        const response = await apiTransferenciaCompentencia.post('/refresh_token/', { refresh_token: refreshToken });

        if (response.data && response.data.access_token) {
          const { access_token, refresh_token, expires_in } = response.data;
          localStorage.setItem('userToken', access_token);
          localStorage.setItem('tokenExpiry', Date.now() + expires_in * 1000);
          if (refresh_token) {
            localStorage.setItem('refreshToken', refresh_token);
          }

          globalLogin(access_token, refresh_token, userData);
        } else {
          console.error('Failed to refresh access token.');
          setError('Failed to refresh access token.');
        }
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      setError('Error refreshing access token.');
    } finally {
      setLoading(false);
    }
  };

  const esFlujoKeycloak = () => {
    return localStorage.getItem('isKeycloak') === 'true';
  };

  return { data, loading, error, login, loginWithKeycloak, handleAuthentication, refreshAccessToken, esFlujoKeycloak };
};