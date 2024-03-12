import { useCompetencia } from "../hooks/competencias/useCompetencias";
import { createContext } from "react";


export const CompetenciasContext = createContext(); 

export const CompetenciaProvider = ({ children }) =>
{
  const {dataCompetencia, dataListCompetencia, competenciaDetails }  = useCompetencia();


  const value ={
    dataCompetencia,
    dataListCompetencia,
    competenciaDetails
  }

  return (
    <CompetenciasContext.Provider value={value}>
      {children}
    </CompetenciasContext.Provider>
  )
}; 