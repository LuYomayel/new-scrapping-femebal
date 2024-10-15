// pages/estadisticas.js
import { FooterComponent } from "@/components/footer";
import { HeaderComponent } from "@/components/header";
import { StatisticsPageComponent } from "@/components/statistics-page";
import '../src/app/globals.css';
import { CafecitoPage } from "@/components/cafecito-page";
export default function CafecitoComponentPage() {
  return (
    <>
      <HeaderComponent />
      <div className="height">
        <CafecitoPage />
      </div>
      <FooterComponent  />
    </>
  );
}