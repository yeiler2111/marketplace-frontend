"use client";

import { IProduct } from "@/app/dashboard/page";

interface ProductDetailModalProps {
  product: IProduct;
  onClose: () => void;
  onAddToCart: (guid: string, quantity?: number) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product.nombre}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {(product.image || product.imagen) && (
              <img
                src={product.image ?? product.imagen}
                alt={product.nombre}
                className="img-fluid mb-3"
              />
            )}
            <p>{product.descripcion}</p>
            <p className="fw-bold text-success">${product.precio}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onAddToCart(product.id, 1)}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
