"use client";
import Link from "next/link";
import { useCart } from "../../components/cart/CartContext";
import { ShoppingCart, Clock } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
type Jwt = { sub: string; email?: string; role?: string; exp?: number };
export default function ClientAuthBar(){
  const { items } = useCart();
  const [user, setUser] = useState<Jwt | null>(null);
  useEffect(() => {
    const t = localStorage.getItem("minishop_token");
    if (t) { try { setUser(jwtDecode<Jwt>(t)); } catch { setUser(null); } } else setUser(null);
  }, []);
  const count = useMemo(()=> items.reduce((s,i)=> s + i.qty, 0), [items]);
  const logout = () => { localStorage.removeItem("minishop_token"); window.location.href = "/"; };
  return (
    <div className="flex items-center gap-3">
      {user ? (<>
        <span className="badge">Signed in</span>
        {user.role === "admin" && (
          <Link href="/admin" className="btn btn-outline">
            Admin
          </Link>
        )}
        <Link href="/orders" className="btn btn-outline"><Clock size={16} style={{marginRight:6}}/> Orders</Link>
        <Link href="/basket" className="btn btn-primary"><ShoppingCart size={16} style={{marginRight:6}}/> Basket {count>0 && <span className="badge" style={{marginLeft:8}}>{count}</span>}</Link>
        <button onClick={logout} className="btn btn-outline">Log out</button>
      </>) : (<>
        <Link href="/login" className="btn btn-outline">Log in</Link>
        <Link href="/basket" className="btn btn-primary"><ShoppingCart size={16} style={{marginRight:6}}/> Basket {count>0 && <span className="badge" style={{marginLeft:8}}>{count}</span>}</Link>
      </>)}
    </div>
  );
}
