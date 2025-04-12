import Swal from "sweetalert2";

export default class SweetAlert {
  static success(message: string, title: string = "Éxito") {
    Swal.fire({
      icon: "success",
      title,
      text: message,
      confirmButtonColor: "#3085d6",
    });
  }

  static error(message: string, title: string = "Error") {
    Swal.fire({
      icon: "error",
      title,
      text: message,
      confirmButtonColor: "#d33",
    });
  }

  static info(message: string, title: string = "Información") {
    Swal.fire({
      icon: "info",
      title,
      text: message,
      confirmButtonColor: "#3085d6",
    });
  }

  static warning(message: string, title: string = "Advertencia") {
    Swal.fire({
      icon: "warning",
      title,
      text: message,
      confirmButtonColor: "#f0ad4e",
    });
  }

  static confirm(
    message: string,
    title: string = "¿Estás seguro?",
    confirmText: string = "Sí",
    cancelText: string = "Cancelar"
  ): Promise<boolean> {
    return Swal.fire({
      title,
      text: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    }).then((result) => result.isConfirmed);
  }
}
