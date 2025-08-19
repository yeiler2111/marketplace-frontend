"use client";

import DashboardCharts from "@/component/DashboardCharts";
import { hideLoader, showLoader } from "@/component/modal/LoaderModalProvider";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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

async function fetchDashboardData() {
  // 🔹 Aquí iría tu API real
  return {
    salesData: [
      { month: "Enero", ventas: 400 },
      { month: "Febrero", ventas: 300 },
      { month: "Marzo", ventas: 500 },
    ],
    spendingData: [
      { month: "Enero", gastos: 100 },
      { month: "Febrero", gastos: 450 },
      { month: "Marzo", gastos: 200 },
    ],
    pieData: [
      { name: "Electrónica", value: 400 },
      { name: "Ropa", value: 300 },
      { name: "Libros", value: 300 },
    ],
  };
}

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
  });

  // 🔹 Manejo del loader global
  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading]);

  if (isError) {
    return <div className="p-6 text-danger">❌ Error cargando datos</div>;
  }

  return (
    <div className="p-6 text-dark">
      <h1 className="text-2xl font-bold mb-4">📊 Resumen de Actividad</h1>
      {data && (
        <DashboardCharts
          salesData={data.salesData}
          spendingData={data.spendingData}
          pieData={data.pieData}
        />
      )}
    </div>
  );
}
