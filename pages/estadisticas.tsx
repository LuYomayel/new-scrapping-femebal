// pages/estadisticas.js
import { FooterComponent } from "@/components/footer";
import { HeaderComponent } from "@/components/header";
import { StatisticsPageComponent } from "@/components/statistics-page";
import '../src/app/globals.css';
export default function StatisticsPage() {
  return (
    <>
      <HeaderComponent />
      <div className="height">
        <StatisticsPageComponent />
      </div>
      <FooterComponent  />
    </>
  );
}