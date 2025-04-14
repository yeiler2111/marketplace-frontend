// components/BootstrapClientOnly.tsx
"use client";
import { useEffect } from "react";

export default function BootstrapClientOnly() {
  useEffect(() => {
      // @ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
