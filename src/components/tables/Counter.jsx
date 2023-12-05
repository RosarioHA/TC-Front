export const Counter = ({ plazoDias, tiempoTranscurrido }) => {
  // Calcular el tiempo total transcurrido en minutos
  const minutosTotalesTranscurridos = (tiempoTranscurrido.dias * 24 * 60) + (tiempoTranscurrido.horas * 60) + tiempoTranscurrido.minutos;

  // Convertir el plazo total (días) a minutos
  const plazoTotalMinutos = plazoDias * 24 * 60;

  // Calcular el tiempo restante en minutos
  const tiempoRestanteMinutos = plazoTotalMinutos - minutosTotalesTranscurridos;

  // Convertir el tiempo restante en minutos a días, horas y minutos
  const tiempoRestante = {
    dias: Math.floor(tiempoRestanteMinutos / (24 * 60)),
    horas: Math.floor((tiempoRestanteMinutos % (24 * 60)) / 60),
    minutos: tiempoRestanteMinutos % 60
  };

  return (
    <div className="d-flex my-3">
      <div className="text-sans-p me-4">Plazo para completar formulario:<strong>{plazoDias} días corridos</strong></div>
      <div className="text-sans-p ms-4 ps-5">
        Tiempo restante:<strong>{tiempoRestante.dias} días {tiempoRestante.horas} horas {tiempoRestante.minutos} minutos</strong>
      </div>
    </div>
  );
}