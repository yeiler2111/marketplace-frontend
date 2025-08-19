"use client";

import {
    hideLoader,
    showError,
    showLoader,
    showSuccess,
} from "@/component/modal/LoaderModalProvider";

export default function PaginaEjemplo() {
  const handleClick = async () => {
    showLoader("Enviando datos...");

    try {
      await new Promise((res) => setTimeout(res, 2000)); // simulación petición
      showSuccess("Datos guardados correctamente ✅");

      setTimeout(() => hideLoader(), 2000);
    } catch {
      showError("Error al procesar ❌");
      setTimeout(() => hideLoader(), 3000);
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleClick}>
      Probar Loader
    </button>
  );
}
