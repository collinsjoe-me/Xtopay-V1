// types/sendexa.d.ts
declare global {
  interface Window {
    Sendexa?: {
      init: (config: { publicKey: string }) => void;
      open: (params: { uuid: string }) => void;
    };
  }
}

export {};