"use client";

import DashboardCharts from "@/component/DashboardCharts";
import authInstance from "@/lib/axios/AuthInstance";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export interface IProduct {
  id?: string;
  idProducto?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  idVendedor: string;
  image?: string;
  imagen?: string;
}

type SalesItem = { month: string; ventas: number };
type SpendingItem = { month: string; gastos: number };
type PieItem = { name: string; value: number };

export default function Dashboard() {
  const [salesData, setSalesData] = useState<SalesItem[]>([]);
  const [spendingData, setSpendingData] = useState<SpendingItem[]>([]);
  const [pieData, setPieData] = useState<PieItem[]>([]);
  const { data: session, status } = useSession();

  const GetCredentialGoogle = async () => {
    if (session && "idToken" in session && session.idToken) {
      try {
        console.log("Session data:", session);
        console.log("ID Token:", session.idToken);

        const res = await authInstance.post("api/auth/google-login", {
          idToken: session.idToken,
        });
        const token = res.data.token;

        Cookies.set("token", token, {
          sameSite: "lax",
          secure: false,
        });
      } catch (error) {
        console.error("Error authenticating with backend:", error);
      }
    } else {
      console.warn("No idToken found in session");
    }
  };

  useEffect(() => {
    setSalesData([
      { month: "Enero", ventas: 400 },
      { month: "Febrero", ventas: 300 },
      { month: "Marzo", ventas: 500 },
    ]);
    setSpendingData([
      { month: "Enero", gastos: 100 },
      { month: "Febrero", gastos: 450 },
      { month: "Marzo", gastos: 200 },
    ]);
    setPieData([
      { name: "Electrónica", value: 400 },
      { name: "Ropa", value: 300 },
      { name: "Libros", value: 300 },
    ]);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      GetCredentialGoogle();
    }
  }, [status]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Resumen de Actividad</h1>
      <DashboardCharts
        salesData={salesData}
        spendingData={spendingData}
        pieData={pieData}
      />
    </div>
  );
}
