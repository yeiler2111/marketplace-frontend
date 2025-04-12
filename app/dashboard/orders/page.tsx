"use client";

import { OrderService } from "@/services/OrderService";
import useGlobalStore from "@/storge/cartStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Order {
  idpedido: string;
  fechaPedido: string;
  estado: string;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = useGlobalStore((state) => state.userId);
  const router = useRouter();
  
    const initializeFromToken = useGlobalStore(
      (state) => state.initializeFromToken
    );
    

  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get("token");
      await initializeFromToken(token ?? "");
      
      try {
        if (!userId) return; 

        const mockOrders: Order[] = await OrderService.getAllOrderUser(userId)

        setTimeout(() => {
          setOrders(mockOrders.reverse());
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        setError("Error al obtener los pedidos");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-center mb-4">Mis Pedidos</h2>
      <div className="row">
        {orders.map((order, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  📅 Fecha: {new Date(order.fechaPedido).toLocaleString()}
                </h5>
                <p className="card-text">📦 Estado: {order.estado}</p>
                <div className="d-flex justify-content-end">
                  <button
                    onClick={()=> router.push(`/dashboard/orders/${order.idpedido}`)}
                    className="btn btn-primary"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
