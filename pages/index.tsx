// pages/index.js
import { TopScorersTableComponent } from "@/components/top-scorers-table";
import '../src/app/globals.css';
import { HeaderComponent } from "@/components/header";
import { FooterComponent } from "@/components/footer";

export default function Home() {
  return (
    <>
      <HeaderComponent />
      <div className="height">
        <TopScorersTableComponent />
      </div>
      <FooterComponent  />
    </>
  );
}