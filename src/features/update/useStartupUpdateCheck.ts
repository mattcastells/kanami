import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { downloadAndInstallRelease } from './androidUpdater';
import { getInstalledVersion } from './installedVersion';
import { AppRelease, compareVersions, fetchLatestRelease } from './releaseClient';

export type StartupUpdate =
  | { kind: 'none' }
  | { kind: 'available'; release: AppRelease; currentVersion: string }
  | { kind: 'installing'; release: AppRelease; currentVersion: string }
  | { kind: 'error'; release: AppRelease; currentVersion: string; message: string };

// Al abrir la app (solo Android, que es donde hay APK que instalar) se fija si hay una release
// más nueva que la instalada. Si la hay, la ofrece; "más tarde" la esconde hasta la próxima
// vez que se abra la app. Sin red o con GitHub caído no dice nada: no es un error del usuario.
export function useStartupUpdateCheck() {
  const [update, setUpdate] = useState<StartupUpdate>({ kind: 'none' });

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    let cancelled = false;
    const currentVersion = getInstalledVersion();
    fetchLatestRelease()
      .then((release) => {
        if (!cancelled && compareVersions(release.version, currentVersion) > 0) {
          setUpdate({ kind: 'available', release, currentVersion });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => setUpdate({ kind: 'none' });

  const install = async () => {
    if (update.kind === 'none' || update.kind === 'installing') return;
    const { release, currentVersion } = update;
    setUpdate({ kind: 'installing', release, currentVersion });
    try {
      await downloadAndInstallRelease(release);
      // El instalador del sistema toma el control; si el usuario lo cancela, vuelve a ofrecerse.
      setUpdate({ kind: 'available', release, currentVersion });
    } catch (error) {
      setUpdate({
        kind: 'error',
        release,
        currentVersion,
        message: error instanceof Error ? error.message : 'No se pudo descargar la actualización.',
      });
    }
  };

  return { update, dismiss, install };
}
