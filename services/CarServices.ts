import apiInstance from "@/lib/axios/ApiInstance";
import { toast } from "sonner";

export interface CreateProductInCar {
    Idcar: string
    IdProduct: string
    stock: number
}
const url: string = "api/CarProduct"
export const CarProductServices = {
    async createCarProduct(bodyRequest: CreateProductInCar) {
        try {
            const res = await apiInstance.post(`${url}/createCarProduct`, bodyRequest)
            if (res.data.success) {
                toast.success("Producto agregado al carrito");
            }
            return res
        } catch (error: any) {
            toast.error("Error al agregar al carrito");
        }
    },
    async getAllProductForIdCar(guid: string) {
        try {
            const products = await apiInstance.get(`${url}/getCarProduct/${guid}`);
            console.log(products);
            return products.data;
        } catch (error) {
            console.log(error);
            return error
        }
    },
    async deleteCarProduct(idcar: string, IdProduct: string) {
        try {
            const res = await apiInstance.post(`${url}/delete`, { IdCar: idcar, "IdProduct": IdProduct })
            toast.success("Eliminado con exito");
        } catch (error) {
            console.log(error)
            toast.error("algo salio mal");

        }
    }
}