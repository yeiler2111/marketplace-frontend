"use client";

import { OrderService } from "@/services/OrderService";
import SweetAlert from "@/services/sweetAlert";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Producto {
  idProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
}

interface PedidoProducto {
  idProducto: string;
  cantidad: number;
  producto: Producto;
}

interface Pedido {
  idPedido: string;
  fechaPedido: string;
  estado: string;
  pedidoProductos: PedidoProducto[];
}

export default function OrderDetail() {
  const { idPedido } = useParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [update, setUpdate] = useState(1);
  const router = useRouter();

  const handlerCancel = async () => {
    try {
      const res = await OrderService.cancerOrderByidOrder(
        pedido?.idPedido ?? ""
      );
      if (!res.success) {
        await SweetAlert.error(res.message, "ERROR");
        return;
      }
      setUpdate((prev) => prev + 1);
      await SweetAlert.success(res.message, "exitoso");
    } catch (error) {
      console.log(error);
      await SweetAlert.error("algo ha fallado", "ERROR");
    }
  };

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const res = await OrderService.getOrderById(idPedido as string);
        setPedido(res?.data);
      } catch (err) {
        setError("No se pudo obtener el detalle del pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [idPedido, update]);

  const calcularTotal = () => {
    if (!pedido) return 0;
    return pedido.pedidoProductos.reduce(
      (acc, pp) => acc + pp.producto.precio * pp.cantidad,
      0
    );
  };

  if (loading) return <p className="text-center">Cargando pedido...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!pedido)
    return (
      <div className="container py-5">
        <button
          className="btn btn-outline-secondary mb-4"
          onClick={() => router.push("/dashboard/orders")}
        >
          ← Regresar a pedidos
        </button>
        <h2 className="mb-3">Pedidos</h2> <p>no hay pedidos disponibles</p>
      </div>
    );

  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => router.push("/dashboard/orders")}
      >
        ← Regresar a pedidos
      </button>
      <h2 className="mb-3">🧾 Detalle del Pedido</h2>
      <p className="text-muted">
        <strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleString()}{" "}
        | <strong>Estado:</strong> {pedido.estado}
      </p>

      <div className="row gy-3 my-4">
        {pedido.pedidoProductos.map((pp) => (
          <div key={pp.idProducto} className="col-12">
            <div className="card shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={pp.producto.imagen}
                    alt={pp.producto.nombre}
                    width={60}
                    height={60}
                    className="rounded"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <h5 className="card-title mb-1">{pp.producto.nombre}</h5>
                    <p className="text-muted mb-0">{pp.producto.descripcion}</p>
                    <p className="card-text mb-0 text-muted">
                      Cantidad: {pp.cantidad}
                    </p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="mb-1 fw-semibold">
                    ${pp.producto.precio.toFixed(2)}
                  </p>
                  <small className="text-muted">
                    Subtotal: {(pp.producto.precio * pp.cantidad).toFixed(2)}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">💰 Total:</h5>
        <h5 className="text-success mb-0">${calcularTotal().toFixed(2)}</h5>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-outline-danger" onClick={handlerCancel}>
          Cancelar pedido
        </button>
        <button className="btn btn-success">Pagar ahora</button>
      </div>
    </div>
  );
}
