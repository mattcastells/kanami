import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { File, Paths } from 'expo-file-system';

import { KanjiSkill } from '../../types/kanji';
import {
  KanjiProgressData,
  createEmptyKanjiProgress,
  markKanjiStudied,
  normalizeKanjiProgress,
  recordKanjiAnswer,
  unmarkKanjiStudied,
} from './kanjiProgressStore';

type KanjiProgressContextValue = {
  data: KanjiProgressData;
  // False hasta que terminó de leerse el archivo. Quien ARMA algo a partir del progreso
  // (Kanji Grind elige el lote según lo que ya sabés) tiene que esperar: si no, un usuario
  // que entra apenas abre la app recibe como "nuevos" kanji que ya domina.
  // Para solo mostrar números no hace falta: el re-render llega cuando llegan los datos.
  hydrated: boolean;
  recordAnswer: (char: string, skill: KanjiSkill, correct: boolean) => void;
  setStudied: (char: string, studied: boolean) => void;
  resetKanjiProgress: () => void;
};

const KanjiProgressContext = createContext<KanjiProgressContextValue | null>(null);

// Mismo patrón anti-race que los otros providers: `dirtyRef` antes del setState y
// persistencia recién después de hidratar. Ver `kanami-persistencia`.
export function KanjiProgressProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<KanjiProgressData>(createEmptyKanjiProgress);
  const [hydrated, setHydrated] = useState(false);
  const dirtyRef = useRef(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const file = getKanjiProgressFile();
        if (file.exists) {
          const parsed = JSON.parse(await file.text());
          if (!cancelled && !dirtyRef.current) {
            setData(normalizeKanjiProgress(parsed));
          }
        }
      } catch {
        // Defaults en memoria ante cualquier fallo de lectura o parseo.
      } finally {
        hydratedRef.current = true;
        // El ref manda para persistir; el state es para que la UI pueda esperar.
        // Un archivo que no existe o que falla al leerse también cuenta como hidratado:
        // si no, la pantalla quedaría trabada para siempre.
        if (!cancelled) setHydrated(true);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    void persistKanjiProgress(data);
  }, [data]);

  const recordAnswer = useCallback(
    (char: string, skill: KanjiSkill, correct: boolean) => {
      dirtyRef.current = true;
      // La fecha se calcula ACÁ, no dentro del updater: el updater tiene que ser puro.
      const timestamp = new Date().toISOString();
      setData((current) => recordKanjiAnswer(current, char, skill, correct, timestamp));
    },
    [],
  );

  const setStudied = useCallback((char: string, studied: boolean) => {
    dirtyRef.current = true;
    const timestamp = new Date().toISOString();
    setData((current) =>
      studied
        ? markKanjiStudied(current, char, timestamp)
        : unmarkKanjiStudied(current, char, timestamp),
    );
  }, []);

  const resetKanjiProgress = useCallback(() => {
    dirtyRef.current = true;
    hydratedRef.current = true;
    setData(createEmptyKanjiProgress());
  }, []);

  const value = useMemo(
    () => ({ data, hydrated, recordAnswer, setStudied, resetKanjiProgress }),
    [data, hydrated, recordAnswer, setStudied, resetKanjiProgress],
  );

  return (
    <KanjiProgressContext.Provider value={value}>{children}</KanjiProgressContext.Provider>
  );
}

export function useKanjiProgress() {
  const context = useContext(KanjiProgressContext);
  if (!context) {
    throw new Error('useKanjiProgress must be used within KanjiProgressProvider');
  }
  return context;
}

function getKanjiProgressFile() {
  return new File(Paths.document, 'kanji-progress.json');
}

async function persistKanjiProgress(data: KanjiProgressData) {
  try {
    const file = getKanjiProgressFile();
    file.create({ intermediates: true, overwrite: true });
    file.write(JSON.stringify(data), { encoding: 'utf8' });
  } catch {
    // Ignorar fallos de disco: la app nunca se rompe por persistencia.
  }
}
