import React from "react";

type LoaderModalProps = {
  open: boolean;
  type?: "loading" | "success" | "error";
  message?: string;
  onClose?: () => void;
};

const LoaderModal: React.FC<LoaderModalProps> = ({
  open,
  type = "loading",
  message = "Cargando...",
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-center p-4">
          {onClose && type != "loading" && (
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              onClick={onClose}
            />
          )}

          {type === "loading" && (
            <div className="flex-column justify-content-center align-items-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}
          {type === "success" && (
            <div className="text-success display-4 mb-3">✔</div>
          )}
          {type === "error" && (
            <div className="text-danger display-4 mb-3">✖</div>
          )}

          <p className="mb-0">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoaderModal;
