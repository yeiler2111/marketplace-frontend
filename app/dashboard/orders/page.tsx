"use client";

import {
  hideLoader,
  showError,
  showLoader,
} from "@/component/modal/LoaderModalProvider";
import { OrderService } from "@/services/OrderService";
import useGlobalStore from "@/storge/cartStore";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Order {
  idpedido: string;
  fechaPedido: string;
  estado: string;
}

export default function OrdersList() {
  const userId = useGlobalStore((state) => state.userId);
  const initializeFromToken = useGlobalStore(
    (state) => state.initializeFromToken
  );
  const router = useRouter();

  // 🔹 función fetcher
  const fetchOrders = async (): Promise<Order[]> => {
    const token = Cookies.get("token");
    await initializeFromToken(token ?? "");

    if (!userId) {
      return []; // 👈 si no hay userId, devolvemos vacío
    }

    const orders = await OrderService.getAllOrderUser(userId);
    return orders.reverse();
  };

  // 🔹 hook TanStack Query
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders", userId], // 👈 cache por usuario
    queryFn: fetchOrders,
    enabled: !!userId, // 👈 solo corre si hay userId
  });

  // 🔹 Loader global (se dispara según estado de la query)
  useEffect(() => {
    if (isLoading) {
      showLoader("Cargando pedidos...");
    } else {
      hideLoader();
    }
  }, [isLoading]);

  // 🔹 Manejo de errores
  useEffect(() => {
    if (isError) {
      console.error(error);
      showError("No se pudieron cargar los pedidos ❌");
    }
  }, [isError, error]);

  return (
    <div>
      <h2 className="text-center mb-4">Mis Pedidos</h2>
      <div className="row">
        {orders.length
          ? orders.map((order, index) => (
              <div key={index} className="col-12 col-sm-6 col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      📅 Fecha: {new Date(order.fechaPedido).toLocaleString()}
                    </h5>
                    <p className="card-text">📦 Estado: {order.estado}</p>
                    <div className="d-flex justify-content-end">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/orders/${order.idpedido}`)
                        }
                        className="btn btn-primary"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : !isLoading && (
              <div className="col-12 text-start mt-4">
                No hay pedidos aún 😔
              </div>
            )}
      </div>
    </div>
  );
}
