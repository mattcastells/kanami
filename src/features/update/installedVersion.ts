import * as Application from 'expo-application';

import appConfig from '../../../app.json';

// La versión instalada: la del binario nativo (la que puso el tag al compilar). En web o en
// dev, la de app.json.
export function getInstalledVersion(): string {
  return Application.nativeApplicationVersion ?? appConfig.expo.version;
}
