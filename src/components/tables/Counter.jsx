export const Counter = ({ plazoDias, tiempoTranscurrido }) => {

  return (
    <div className="d-flex my-3">
      <div className="text-sans-p me-4">Plazo para completar formulario: <strong>{plazoDias} días corridos</strong></div>
      <div className="text-sans-p ms-4 ps-5">
        Tiempo transcurrido: <strong>{tiempoTranscurrido.dias} días {tiempoTranscurrido.horas} horas {tiempoTranscurrido.minutos} minutos</strong>
      </div>
    </div>
  );
}