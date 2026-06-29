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
