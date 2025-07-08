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
      await initializeFromToken(Cookies.get("token") ?? "");
      try {
        const result = await ProductServices.getAllProduct();
        const data: IProduct[] = result ?? [];
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [initializeFromToken]);

  const addCar = async (guid: string, quantity: number | undefined) => {
    const body: CreateProductInCar = {
      Idcar: cardId,
      IdProduct: guid,
      stock: quantity ?? 1,
    };
    await CarProductServices.createCarProduct(body);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <svg
          className="w-12 h-12 mb-4 animate-spin text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span className="text-lg text-gray-700">Cargando productos…</span>
      </div>
    );
  }

  return (
    <div className="container mt-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8">
        🛒 Explora Nuestros Productos
      </h1>
      <div className="row">
        {products.map((p) => (
          <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4" key={p.id}>
            <ProductCard product={p} addAction={addCar} />
          </div>
        ))}
      </div>
    </div>
  );
}
