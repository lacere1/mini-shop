import "./globals.css";
import Link from "next/link";
import { Store } from "lucide-react";
import { CartProvider } from "../components/cart/CartContext";
import ClientAuthBar from "./ui/ClientAuthBar";
export const metadata = { title: "MiniShop", description: "A tiny shop demo" };
export default function RootLayout({ children }:{ children:React.ReactNode }){
  return (<html lang="en"><body>
    <CartProvider>
      <header className="card" style={{borderRadius:0}}>
        <nav className="container" style={{height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <Link href="/" className="flex items-center gap-2" style={{fontWeight:600}}><Store size={20}/> MiniShop</Link>
          <ClientAuthBar />
        </nav>
      </header>
      <main className="container" style={{padding:'2rem 0'}}>{children}</main>
      <footer className="container" style={{padding:'3rem 0', color:'#6b7280', fontSize:14}}>© {new Date().getFullYear()} MiniShop</footer>
    </CartProvider>
  </body></html>);
}
