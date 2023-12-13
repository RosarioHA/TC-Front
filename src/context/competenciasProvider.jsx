import { useCompetencia } from "../hooks/competencias/useCompetencias";
import { CompetenciasContext } from "./competenciasContext";



export const CompetenciaProvider = ({ children }) =>
{
  const competencia = useCompetencia();

  return (
    <CompetenciasContext.Provider value={competencia}>
      {children}
    </CompetenciasContext.Provider>
  )
}; 