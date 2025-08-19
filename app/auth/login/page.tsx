"use client";

import { hideLoader, useLoaderModal } from "@/component/modal/LoaderModalProvider";
import authInstance from "@/lib/axios/AuthInstance";
import Cookies from "js-cookie";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { showLoader } from "@/component/modal/LoaderModalProvider";

export default function LoginPage() {
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    hideLoader();
  }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();
    try {
      const res = await authInstance.post("api/auth/login", {
        Email: email,
        Contrasena: password,
      });

      const inOneHour = new Date(Date.now() + 60 * 60 * 1000);
      Cookies.set("token", res.data.token, {
        expires: inOneHour,
        sameSite: "lax",
        secure: false,
      });

      // 👇 Espera un poco antes de redirigir para que se vea el modal
      setTimeout(() => {
        route.push("/dashboard");
      }, 1000);
    } catch (err: any) {}
  };
  const { show, hide } = useLoaderModal();

  const simulateProcess = async () => {
    show("loading", "Procesando...");
    setTimeout(() => {
      show("success", "¡Éxito!");
      setTimeout(() => hide(), 1500);
    }, 2000);
  };

  return (
    <main className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        {/* LOGO */}
        <div className="text-center mb-3">
          <img
            src="../imagenes/marketplace.svg"
            alt="Logo"
            width={100}
            height={100}
          />
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Contraseña"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Iniciar sesión
          </button>
        </form>

        <button
          onClick={() => signIn("google")}
          className="btn w-100 mt-3 border border-2 d-flex align-items-center justify-content-center gap-2 custom-hover"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            style={{ width: "20px", height: "20px" }}
          />
          <span>Continuar con Google</span>
        </button>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2 text-center">
          <div className="text-muted">
            ¿No tienes cuenta?{" "}
            <a
              onClick={() => route?.push("/auth/register")}
              className="text-decoration-none text-primary"
              role="button"
            >
              Regístrate
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
