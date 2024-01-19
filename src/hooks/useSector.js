import { useEffect, useState } from "react"
import { apiTransferenciaCompentencia } from "../services/transferenciaCompetencia";


export const useSector = () => {
  
  const [ dataSector, setdataSector] =  useState([]);
  const [ loadingSector , setLoadingSector] = useState(true);
  const [ errorSector , setErrorSector ] = useState(null); 

  useEffect(()=> {
    const fetchData = async () => {
      try {
        const response = await apiTransferenciaCompentencia.get('sector-gubernamental/v1/');
        setdataSector(response.data);
        setLoadingSector(false);
      }catch(error){
        setErrorSector(error);
        setLoadingSector(false); 
      }
  }
  fetchData();
  },[]);

  return { dataSector, loadingSector, errorSector}; 
}
