import apiInstance from "@/lib/axios/ApiInstance";
import SweetAlert from "./sweetAlert";

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
                SweetAlert.success("Se ha registrado exitosamente el producto.", "Bien!!")
            }
            return res
        } catch (error : any) {
            SweetAlert.error(error?.message as string, "ha ocurrido un error")
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
        } catch (error) {
            console.log(error)
        }
    }
}