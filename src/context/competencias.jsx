import { useCompetencia } from "../hooks/competencias/useCompetencias";
import { createContext } from "react";


export const CompetenciasContext = createContext(); 

export const CompetenciaProvider = ({ children }) =>
{
  const competencia = useCompetencia();

  return (
    <CompetenciasContext.Provider value={competencia}>
      {children}
    </CompetenciasContext.Provider>
  )
}; 