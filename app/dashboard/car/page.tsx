// app/carrito/page.tsx
"use client";

import ProductCard from "@/component/Card";
import { CarProductServices } from "@/services/CarServices";
import { OrderService } from "@/services/OrderService";
import SweetAlert from "@/services/sweetAlert";
import useGlobalStore from "@/storge/cartStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [carrito, setCarrito] = useState<ICarritoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const cartId = useGlobalStore((state) => state.cartId);
  const userId = useGlobalStore((state) => state.userId);
  const [updateCount, setupdateCount] = useState<number>(1);
  const router = useRouter();

  const initializeFromToken = useGlobalStore(
    (state) => state.initializeFromToken
  );

  useEffect(() => {
    const fetchCarrito = async () => {
      const token = Cookies.get("token");
      await initializeFromToken(token ?? "");

      try {
        if (!cartId) return; // esperar a que esté listo

        const response = await CarProductServices.getAllProductForIdCar(cartId);
        setCarrito(response);
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarrito();
  }, [updateCount, cartId]);

  const deleteProductCar = async (IdProduct: string) => {
    const res = await CarProductServices.deleteCarProduct(cartId, IdProduct);
    setupdateCount((prev) => prev + 1);
  };

  const generateOrder = async () => {
    try {
      const res =await OrderService.generateOrderUser(userId);
      if(res?.status != 200){
        throw "error"
      }
      SweetAlert.success(`el pedido se ha creado exitosamente!. id:${res.data}`,"exitoso" )
      router.push("/dashboard/orders")
      console.log(res);
    } catch (error) {
      console.log(error);
      SweetAlert.error(`algo ha salido mal!. error:${error}`,"Error" );
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">🛍️ Mi Carrito</h2>

      {loading ? (
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
                  addAction={deleteProductCar}
                  deleteCard={true}
                  disabledCont={true}
                  cantidad={item.cantidad}
                />
              </div>
            ))}
          </div>

          <div className="text-end mt-4">
            <button onClick={generateOrder} className="btn btn-primary mt-2">
              Proceder al Pago
            </button>
          </div>
        </>
      )}
    </div>
  );
}
