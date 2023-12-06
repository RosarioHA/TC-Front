import { Avance } from "../../components/tables/Avance";


const PasoUno = () =>
{
  return (
    <div className="container vh-100">
      <div className="d-flex">
        <h3 className="mt-3">Descripción de la Institución</h3>
        <Avance />
      </div>
      <span className="text-sans-h6-primary">Texto de apoyo</span>
    </div>
  )
}
export default PasoUno; 