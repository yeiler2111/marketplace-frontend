"use client";

import { IProduct } from "@/app/dashboard/page";
import { useState } from "react";

interface ProductCardProps {
  product: IProduct;
  showActions?: boolean;
  addAction: (guid: string, quantity?: number) => void;
  deleteCard?: boolean;
  disabledCont?: boolean;
  cantidad?: number;
  onViewDetail?: () => void;
  onDelete?: (id: string) => void; // 🔹 callback para eliminar
}

export default function ProductCard({
  product,
  showActions = false,
  addAction,
  deleteCard = false,
  disabledCont = false,
  cantidad = 0,
  onViewDetail,
  onDelete,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = async () => {
    if (product.stock > 0 && quantity > 0) {
      await addAction(product?.idProducto ?? product?.id ?? "", quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product?.idProducto ?? product?.id ?? "");
    }
  };

  return (
    <div className="card h-100 shadow-sm">
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

          {/* 🔹 Controles de cantidad (ocultos si es deleteCard) */}
          {!deleteCard && (
            <div className="d-flex align-items-center gap-2 mb-2">
              <button
                disabled={disabledCont}
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="fw-bold">
                {!disabledCont ? quantity : cantidad}
              </span>
              <button
                disabled={disabledCont}
                className="btn btn-outline-secondary"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
              >
                +
              </button>
            </div>
          )}

          {/* 🔹 Si deleteCard=true → muestro botón Eliminar */}
          {/* 🔹 Si deleteCard=true → muestro botón Eliminar */}
          {deleteCard ? (
            <button
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleDelete}
            >
              <i className="bi bi-trash"></i> {/* Bootstrap Icons */}
              Eliminar
            </button>
          ) : (
            !showActions && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary w-50"
                  onClick={onViewDetail}
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
            )
          )}

          {added && (
            <div className="alert alert-success mt-2 p-1 text-center">
              ¡Agregado al carrito!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
