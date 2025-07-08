"use client";

import ProductCard from "@/component/Card";
import { CarProductServices, CreateProductInCar } from "@/services/CarServices";
import { ProductServices } from "@/services/ProductServices";
import useGlobalStore from "@/storge/cartStore";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { IProduct } from "../page";

export default function ProductPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const initializeFromToken = useGlobalStore((a) => a.initializeFromToken);
  const cardId = useGlobalStore((data) => data.cartId);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const token = Cookies.get("token");
      if (token) {
        try {
          await initializeFromToken(token);
        } catch (err) {
          console.error("Error inicializando token:", err);
        }
      }
      try {
        const result = await ProductServices.getAllProduct();
        setProducts(result ?? []);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [initializeFromToken]);

  const addCar = async (guid: string, quantity?: number) => {
    const body: CreateProductInCar = {
      Idcar: cardId,
      IdProduct: guid,
      stock: quantity ?? 1,
    };
    await CarProductServices.createCarProduct(body);
  };

  return (
    <div className="container mt-6 relative">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8">
        🛒 Explora Nuestros Productos
      </h1>

      {/* Spinner overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-600"></div>
        </div>
      )}

      <div className="row opacity-90">
        {products.map((p) => (
          <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4" key={p.id}>
            <ProductCard product={p} addAction={addCar} />
          </div>
        ))}
      </div>
    </div>
  );
}
