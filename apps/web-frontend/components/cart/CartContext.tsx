"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
export type CartItem = { id: string; title: string; price_cents: number; qty: number; image?: string };
type CartState = { items: CartItem[]; add:(i:CartItem)=>void; remove:(id:string)=>void; setQty:(id:string,qty:number)=>void; clear:()=>void; totalCents:number };
const Ctx = createContext<CartState|null>(null);
export function CartProvider({ children }:{children:React.ReactNode}){
  const [items,setItems] = useState<CartItem[]>([]);
  useEffect(()=>{ const s = localStorage.getItem("minishop_cart"); if(s) setItems(JSON.parse(s)); },[]);
  useEffect(()=>{ localStorage.setItem("minishop_cart", JSON.stringify(items)); },[items]);
  const add = (item:CartItem)=> setItems(prev=> { const f = prev.find(i=>i.id===item.id); return f? prev.map(i=>i.id===item.id? {...i, qty:i.qty+item.qty}:i): [...prev,item]; });
  const remove = (id:string)=> setItems(prev=> prev.filter(i=> i.id!==id));
  const setQty = (id:string, qty:number)=> setItems(prev=> prev.map(i=> i.id===id? {...i, qty:Math.max(1,qty)}:i));
  const clear = ()=> setItems([]);
  const totalCents = useMemo(()=> items.reduce((s,i)=> s+i.price_cents*i.qty,0),[items]);
  return <Ctx.Provider value={{items,add,remove,setQty,clear,totalCents}}>{children}</Ctx.Provider>;
}
export function useCart(){ const ctx = useContext(Ctx); if(!ctx) throw new Error("useCart must be used within CartProvider"); return ctx; }
