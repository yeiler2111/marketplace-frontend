import apiInstance from "@/lib/axios/ApiInstance";
import Cookies from "js-cookie";
import { toast } from "sonner";


const url = "api/auth";

export interface GoogleLoginRequest {
    idToken: string;
}

export const AuthServices = {
    async googleLogin(idToken: string) {
        try {
            const res = await apiInstance.post(`${url}/google-login`, {
                idToken,
            } as GoogleLoginRequest);

            const { token } = res.data;

            if (token) {
                console.log("aviso...");
                Cookies.set("token", token);
                toast.success("Autenticado con Google");
            }

            return token;
        } catch (error: any) {
            console.error(error);
            toast.error("Error en autenticación con Google");
            return null;
        }
    },
};
