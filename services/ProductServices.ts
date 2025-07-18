import { IProduct } from "@/app/dashboard/page";
import apiInstance from "@/lib/axios/ApiInstance";

const url:string = "api/product"
export const ProductServices = {
    async getAllProduct(){
        try {
            const res = await apiInstance.get<IProduct[]>(`api/product/getAllProducts`)
            return res.data
        } catch (error) {
            console.log(error);
        }
    }
}