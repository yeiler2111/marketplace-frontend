"use client";

import { IProduct } from "@/app/dashboard/page";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductCardProps {
  product: IProduct;
  showActions?: boolean;
  addAction: (guid: string, quantity?: number) => void;
  deleteCard?: boolean;
  disabledCont?: boolean;
  cantidad?:number;
}

export default function ProductCard({
  product,
  showActions = false,
  addAction,
  deleteCard,
  disabledCont = false,
  cantidad=0
}: ProductCardProps) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const handleAddToCart = async () => {
    if (product.stock > 0 && quantity > 0) {
     await addAction(product.idProducto ?? product.id ?? "", quantity);
    }
  };

  const goToDetail = () => {
    router.push(`/productos/${product.id}`);
  };

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="card h-100 shadow-sm">
      {deleteCard && (
        <div className="d-flex gap-2 mt-2 position-absolute">
          <button
            className="btn btn-danger"
            onClick={async () =>
              await addAction(product.idProducto ?? product.id ?? "")
            }
          >
            🗑️
          </button>
        </div>
      )}

      {(product.image || product.imagen) && (
        <img
          src={product.image ?? product.imagen}
          className="card-img-top"
          alt={product.nombre}
          style={{ objectFit: "cover", height: "200px" }}
        />
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.nombre}</h5>
        <p className="card-text text-muted">{product.descripcion}</p>
        <div className="mt-auto">
          <p className="fw-bold text-success mb-1">${product.precio}</p>
          <span
            className={`badge mb-2 ${
              product.stock <= 5 ? "bg-danger" : "bg-success"
            }`}
          >
            Stock: {product.stock}
          </span>
          <div className="d-flex align-items-center gap-2 mb-2">

            <button
              disabled={disabledCont}
              className="btn btn-outline-secondary"
              onClick={decreaseQty}
            >
              -
            </button>
            <span className="fw-bold">{(!disabledCont ? quantity : cantidad )}</span>
            <button
              disabled={disabledCont}
              className="btn btn-outline-secondary"
              onClick={increaseQty}
            >
              +
            </button>
          </div>

          {!showActions && (
            <>
              {/* Botones */}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary w-50"
                  onClick={goToDetail}
                >
                  Ver detalle
                </button>
                <button
                  className="btn btn-primary w-50"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Sin stock" : "Agregar"}
                </button>
              </div>

              {added && (
                <div className="alert alert-success mt-2 p-1 text-center">
                  ¡Agregado al carrito!
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
