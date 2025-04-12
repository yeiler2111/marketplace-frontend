
import apiInstance from "@/lib/axios/ApiInstance";

const url:string = "api/order"
export const OrderService = {
    async generateOrderUser(userId:string){
        try {
            const res = await apiInstance.post(`${url}/CreateOrderForIdUser`,{IdUser:userId});
            return res
        } catch (error) {
            console.log(error);
        }
    },
    async getAllOrderUser(userId:string){

        try {
            const orders = await apiInstance.get(`${url}/getOrdersByUser/${userId}`);
            return orders.data;
        } catch (error) {
            console.log(error);
        }

    },
    async getOrderById(orderId:string){
        try {
            const res = await apiInstance.get(`${url}/getOrderById/${orderId}`);
            console.log(res)
            return res
        } catch (error) {
            console.log(error);
        }
    },
    async cancerOrderByidOrder(idOrder:string){
        try {
            debugger;
            const res =await apiInstance.delete(`${url}/cancelOrder/${idOrder}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }
}