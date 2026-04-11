export const getRelativeTime = (dateInput) => {
  if (!dateInput) return "N/A";

  const now = new Date();
  const past = new Date(dateInput);

  // Si la fecha no es válida, devolvemos el texto original
  if (isNaN(past.getTime())) return dateInput;

  const diffInSeconds = Math.floor((now - past) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  // Lógica de retorno profesional
  if (diffInSeconds < 60) return "Hace un momento";
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  if (diffInHours < 24) return `Hace ${diffInHours} horas`;
  if (diffInDays === 1) return "Ayer";
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  if (diffInWeeks < 4) return `Hace ${diffInWeeks} semanas`;

  // Para fechas muy antiguas, mejor el formato estándar
  return past.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};