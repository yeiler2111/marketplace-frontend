"use client";
import authInstance from "@/lib/axios/AuthInstance";
import SweetAlert from "@/services/sweetAlert";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterFormData {
  nombre: string;
  email: string;
  contrasena: string;
  confirmarContrasena: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: "",
    email: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.contrasena !== formData.confirmarContrasena) {
      SweetAlert.error("Las contraseñas no coinciden.", "Error");
      return;
    }

    try {
      const res = await authInstance.post("/api/test/create-user", {
        email: formData.email,
        nombre: formData.nombre,
        contrasena: formData.contrasena,
      });

      SweetAlert.success(
        "✅ Usuario registrado con éxito.",
        "¡Registro exitoso!"
      );

      setFormData({
        nombre: "",
        email: "",
        contrasena: "",
        confirmarContrasena: "",
      });
    router.push('/auth/login')
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Error al conectar con el servidor.";
      SweetAlert.error(errorMsg, "Error");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmar Contraseña</label>
          <input
            type="password"
            name="confirmarContrasena"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Registrarse
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </form>
    </div>
  );
}
