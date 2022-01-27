/// <reference types="vite/client" />

type ImportMetaEnvModeType = 'test' | 'development' | 'release' | 'mock';

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_BUILD_EPOCH?: string;
  MODE: ImportMetaEnvModeType | string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
