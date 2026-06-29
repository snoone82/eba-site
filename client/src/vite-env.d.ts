/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAJABI_CHECKOUT_URL?: string;
  readonly VITE_FORM_ENDPOINT?: string;
  readonly VITE_STRIPE_OM_MANUAL?: string;
  readonly VITE_STRIPE_COMPLIANCE_CHATBOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Plausible custom-event API (present only once the script has loaded). */
  plausible?: (
    event: string,
    options?: { props?: Record<string, string | number>; callback?: () => void }
  ) => void;
}
