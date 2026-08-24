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

import {
  WeakData,
  WeakSeed,
  createEmptyWeak,
  normalizeWeak,
  recordHit,
  recordMiss,
} from './weakStore';

type WeakContextValue = {
  data: WeakData;
  reportMiss: (seed: WeakSeed) => void;
  reportHit: (modeKey: string, itemId: string) => void;
  resetWeak: () => void;
};

const WeakContext = createContext<WeakContextValue | null>(null);

// Mismo patrón anti-race que los otros providers: dirtyRef evita que la lectura tardía
// del disco pise lo que el usuario ya generó; hydratedRef evita persistir antes de leer.
export function WeakProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<WeakData>(createEmptyWeak);
  const dirtyRef = useRef(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const file = getWeakFile();
        if (file.exists) {
          const parsed = JSON.parse(await file.text());
          if (!cancelled && !dirtyRef.current) {
            setData(normalizeWeak(parsed));
          }
        }
      } catch {
        // Defaults en memoria ante cualquier fallo de lectura/parseo.
      } finally {
        hydratedRef.current = true;
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    void persistWeak(data);
  }, [data]);

  const reportMiss = useCallback((seed: WeakSeed) => {
    dirtyRef.current = true;
    const timestamp = new Date().toISOString();
    setData((current) => recordMiss(current, seed, timestamp));
  }, []);

  const reportHit = useCallback((modeKey: string, itemId: string) => {
    dirtyRef.current = true;
    setData((current) => recordHit(current, modeKey, itemId));
  }, []);

  const resetWeak = useCallback(() => {
    dirtyRef.current = true;
    hydratedRef.current = true;
    setData(createEmptyWeak());
  }, []);

  const value = useMemo(
    () => ({ data, reportMiss, reportHit, resetWeak }),
    [data, reportMiss, reportHit, resetWeak],
  );

  return <WeakContext.Provider value={value}>{children}</WeakContext.Provider>;
}

export function useWeak() {
  const context = useContext(WeakContext);
  if (!context) {
    throw new Error('useWeak must be used within WeakProvider');
  }
  return context;
}

function getWeakFile() {
  return new File(Paths.document, 'weak-items.json');
}

async function persistWeak(data: WeakData) {
  try {
    const file = getWeakFile();
    file.create({ intermediates: true, overwrite: true });
    file.write(JSON.stringify(data), { encoding: 'utf8' });
  } catch {
    // Ignorar fallos de persistencia y conservar el estado en memoria.
  }
}
