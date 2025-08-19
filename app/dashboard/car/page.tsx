// app/carrito/page.tsx
"use client";

import ProductCard from "@/component/Card";
import {
  hideLoader,
  showError,
  showLoader,
} from "@/component/modal/LoaderModalProvider";
import { CarProductServices } from "@/services/CarServices";
import { OrderService } from "@/services/OrderService";
import SweetAlert from "@/services/sweetAlert";
import useGlobalStore from "@/storge/cartStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IProduct } from "../page";

interface ICarritoItem {
  id: string;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
  producto: IProduct;
}

export default function CarritoPage() {
  const cartId = useGlobalStore((state) => state.cartId);
  const userId = useGlobalStore((state) => state.userId);
  const initializeFromToken = useGlobalStore(
    (state) => state.initializeFromToken
  );
  const router = useRouter();
  const queryClient = useQueryClient();

  // 🔹 Fetch carrito
  const fetchCarrito = async (): Promise<ICarritoItem[]> => {
    const token = Cookies.get("token");
    await initializeFromToken(token ?? "");

    if (!cartId) return [];
    const response = await CarProductServices.getAllProductForIdCar(cartId);
    return response;
  };

  const {
    data: carrito = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["carrito", cartId],
    queryFn: fetchCarrito,
    enabled: !!cartId, // solo cuando exista cartId
  });

  // 🔹 Loader global
  useEffect(() => {
    if (isLoading) showLoader("Cargando carrito...");
    else hideLoader();
  }, [isLoading]);

  // 🔹 Error global
  useEffect(() => {
    if (isError) {
      console.error(error);
      showError("No se pudo cargar el carrito ❌");
    }
  }, [isError, error]);

  // 🔹 Mutación: eliminar producto del carrito
  const deleteMutation = useMutation({
    mutationFn: (idProduct: string) =>
      CarProductServices.deleteCarProduct(cartId!, idProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrito", cartId] });
    },
    onError: () => {
      showError("No se pudo eliminar el producto ❌");
    },
  });

  // 🔹 Mutación: generar pedido
  const generateOrderMutation = useMutation({
    mutationFn: () => OrderService.generateOrderUser(userId!),
    onSuccess: (res) => {
      if (res?.status === 200) {
        SweetAlert.success(
          `El pedido se ha creado exitosamente! 🛒 ID: ${res.data}`,
          "Exitoso"
        );
        queryClient.invalidateQueries({ queryKey: ["carrito", cartId] });
        router.push("/dashboard/orders");
      } else {
        throw new Error("Respuesta inválida");
      }
    },
    onError: (err) => {
      console.error(err);
      SweetAlert.error(`Algo salió mal! ❌`, "Error");
    },
  });

  return (
    <div className="container">
      <h2 className="mb-4">Mi Carrito</h2>

      {isLoading ? (
        <p>Cargando carrito...</p>
      ) : carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <div className="row">
            {carrito.map((item, index) => (
              <div
                key={item.producto?.id ?? `fallback-${index}`}
                className="col-md-6 col-lg-4 mb-4"
              >
                <ProductCard
                  product={item.producto}
                  showActions={true}
                  deleteCard={true}
                  onDelete={() => deleteMutation.mutate(item.producto.id!)}
                  disabledCont={true}
                  cantidad={item.cantidad}
                />
              </div>
            ))}
          </div>

          <div className="text-end mt-4">
            <button
              onClick={() => generateOrderMutation.mutate()}
              className="btn btn-primary mt-2"
              disabled={generateOrderMutation.isPending}
            >
              {generateOrderMutation.isPending
                ? "Procesando..."
                : "Proceder al Pago"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
