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
  const initializeFromToken = useGlobalStore((a) => a.initializeFromToken);
  const cardId = useGlobalStore((data) => data.cartId);

  useEffect(() => {
    const fetchProducts = async () => {
      await initializeFromToken(Cookies.get("token") ?? "");
      try {
        const result = await ProductServices.getAllProduct();
        const data: IProduct[] = result ?? [];
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProducts();
  }, []);
  const addCar = async (guid: string, quantity: number | undefined) => {
    const body: CreateProductInCar = {
      Idcar: cardId,
      IdProduct: guid,
      stock: quantity ?? 1,
    };
    await CarProductServices.createCarProduct(body);
  };
  return (
    <div className="container mt-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8">
        🛒 Explora Nuestros Productos
      </h1>
      <div className="row">
        {products.map((p) => (
          <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4" key={p.id}>
            <ProductCard product={p} addAction={addCar}  />
          </div>
        ))}
      </div>
    </div>
  );
}
