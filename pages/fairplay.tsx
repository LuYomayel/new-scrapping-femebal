// pages/fairplay.js
import { FairPlayComponent } from "@/components/fairplay-table";
import { FooterComponent } from "@/components/footer";
import { HeaderComponent } from "@/components/header";
import '../src/app/globals.css';
export default function FairPlayPage() {
  return (
    <>
      <HeaderComponent />
      <div className="height">
        <FairPlayComponent />
      </div>
      <FooterComponent  />
    </>
  );
}