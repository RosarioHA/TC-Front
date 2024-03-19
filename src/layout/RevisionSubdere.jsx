import { Outlet} from 'react-router-dom'; 
import { Timmer } from "../components/layout/Timmer"
import { FormTitle } from "../components/layout/FormTitle"
import { HorizontalRevision} from "../components/stepers/HorizontalRevision";


const dataRevision ={
  "id": 101,
  "competencia_nombre": "nueva competencia gore",
  "competencia_id": 76,
  "region_nombre": "Los Lagos",
  "plazo_dias": null,
  "calcular_tiempo_transcurrido": {
      "dias": 0,
      "horas": 0,
      "minutos": 0
  },
  "ultimo_editor": {
      "nombre_completo": "Veronica Caro",
      "perfil": "SUBDERE"
  },
  "fecha_ultima_modificacion": "16/03/2024 - 17:45",
  "fecha_envio": null,
  "formulario_enviado": false
}
const RevisionSubdere = () => {

  const baseUrl = `/home/revision_subdere/${dataRevision.id}`;

  return (
    <div className="container-fluid col-11">
    <div className="row">
      <div className="col mb-2">
        <FormTitle data={dataRevision} title="Revision Final SUBDERE" id={dataRevision.id} />
        <div className="mx-5">
          {dataRevision && <HorizontalRevision baseUrl={baseUrl} />}
          <Timmer data={dataRevision} id={dataRevision.id} />
        </div>
      </div>
    </div>
    <div className="row">
      <Outlet key={dataRevision.id} context={{ id: dataRevision.id, ...dataRevision }}  />
    </div>
  </div>
  )
}

export default RevisionSubdere