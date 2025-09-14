"use client";
import { useCart } from "./cart/CartContext";
import { useState } from "react";
const gbp = new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"});
export default function ProductCard({ product }:{ product:any }){
  const { add } = useCart();
  const [added,setAdded] = useState(false);
  const img = product.image || `https://picsum.photos/seed/${product.id}/600/400`;
  const handleAdd = ()=> { add({ id: product.id, title: product.title, price_cents: product.price_cents, qty: 1, image: img }); setAdded(true); setTimeout(()=>setAdded(false), 900); };
  return (<div className="card overflow-hidden">
    <img src={img} alt={product.title} className="w-full h-44 object-cover" />
    <div className="p-4 space-y-2">
      <div className="font-semibold">{product.title}</div>
      <div style={{color:'#4b5563'}}>{gbp.format(product.price_cents/100)}</div>
      <div className="flex gap-2">
        <a href={`/product/${product.id}`} className="btn btn-outline">View</a>
        <button className="btn btn-primary" onClick={handleAdd}>{added?"Added":"Add to basket"}</button>
      </div>
    </div>
  </div>);
}
