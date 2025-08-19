"use client";

import { createContext, useContext, useState } from "react";
import LoaderModal from "./modal";

type ModalType = "loading" | "success" | "error" | null;

interface LoaderModalContextType {
  show: (type: ModalType, message?: string) => void;
  hide: () => void;
}

const LoaderModalContext = createContext<LoaderModalContextType | null>(null);

export function useLoaderModal() {
  const ctx = useContext(LoaderModalContext);
  if (!ctx)
    throw new Error("useLoaderModal debe usarse dentro de LoaderModalProvider");
  return ctx;
}

// --- helpers globales (variables mutables) ---
let showFn: LoaderModalContextType["show"] | null = null;
let hideFn: LoaderModalContextType["hide"] | null = null;

export function showLoader(message = "Cargando...") {
  showFn?.("loading", message);
}

export function hideLoader() {
  hideFn?.();
}

export function showSuccess(message = "Operación exitosa") {
  showFn?.("success", message);
}

export function showError(message = "Ocurrió un error") {
  showFn?.("error", message);
}

export default function LoaderModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ModalType>("loading");
  const [message, setMessage] = useState("Cargando...");

  const show = (t: ModalType, msg?: string) => {
    setType(t);
    setMessage(msg || "");
    setOpen(true);
  };

  const hide = () => setOpen(false);

  // asignamos funciones globales
  showFn = show;
  hideFn = hide;

  return (
    <LoaderModalContext.Provider value={{ show, hide }}>
      {children}
      <LoaderModal
        open={open}
        type={type ?? "loading"}
        message={message}
        onClose={hide}
      />
    </LoaderModalContext.Provider>
  );
}
