import { useAppSettings } from '../../settings/AppSettingsProvider';

// Cuántas rondas tiene la partida, según el ajuste único `sessionRounds` (lo elegís en la
// pantalla de selección del juego o en Perfil). undefined = sin límite.
//
// Se lee del ajuste y no de un parámetro de ruta: Antónimos, Imágenes y Traducción no
// tienen pantalla de selección y siguen el mismo valor.
export function useSessionLength(): number | undefined {
  const {
    settings: { sessionRounds },
  } = useAppSettings();
  return sessionRounds > 0 ? sessionRounds : undefined;
}
