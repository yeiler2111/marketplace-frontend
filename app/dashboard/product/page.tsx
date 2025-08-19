"use client";

import ProductCard from "@/component/Card";
import { hideLoader, showLoader } from "@/component/modal/LoaderModalProvider";
import ProductDetailModal from "@/component/products/ProductDetailModal";
import { CarProductServices, CreateProductInCar } from "@/services/CarServices";
import { ProductServices } from "@/services/ProductServices";
import useGlobalStore from "@/storge/cartStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { IProduct } from "../page";

export default function ProductPage() {
  const initializeFromToken = useGlobalStore((s) => s.initializeFromToken);
  const cartId = useGlobalStore((s) => s.cartId);
  const queryClient = useQueryClient();

  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) initializeFromToken(token);
  }, [initializeFromToken]);

  const {
    data: products = [],
    isError,
    isFetching,
  } = useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: async () => {
      showLoader("Cargando productos...");
      try {
        return (await ProductServices.getAllProduct()) ?? [];
      } finally {
        hideLoader();
      }
    },
    staleTime: 1000 * 60,
  });

  const { data: cartProducts = [] } = useQuery({
    queryKey: ["cartProducts", cartId],
    queryFn: async () => {
      if (!cartId) return [];
      return await CarProductServices.getAllProductForIdCar(cartId);
    },
    enabled: !!cartId,
  });

  const addCarMutation = useMutation({
    mutationFn: (body: CreateProductInCar) =>
      CarProductServices.createCarProduct(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartProducts", cartId] });
    },
  });

  const addCar = async (guid: string, quantity = 1) => {
    if (!cartId) return;
    const body: CreateProductInCar = {
      Idcar: cartId,
      IdProduct: guid,
      stock: quantity,
    };
    addCarMutation.mutate(body);
  };

  const cartCount = cartProducts?.length ?? 0;

  return (
    <div className="container mt-5 position-relative text-dark">
      <h1 className="display-6 fw-bold text-center mb-4">
        Explora Nuestros Productos
      </h1>

      {isError && (
        <p className="text-danger text-center">
          Error al cargar productos. Intenta de nuevo.
        </p>
      )}

      <div className="row" style={{ opacity: isFetching ? 0.5 : 1 }}>
        {products.map((p) => (
          <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4" key={p.id}>
            <ProductCard
              product={p}
              addAction={addCar}
              onViewDetail={() => setSelectedProduct(p)} // 🔹 nuevo evento
            />
          </div>
        ))}
      </div>

      {/* Modal de detalle */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addCar}
        />
      )}

      {/* Botón carrito */}
      <button
        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center position-fixed"
        style={{
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          zIndex: 1050,
        }}
        onClick={() => (window.location.href = "/dashboard/car")}
      >
        <ShoppingCart size={28} />
        {cartCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
