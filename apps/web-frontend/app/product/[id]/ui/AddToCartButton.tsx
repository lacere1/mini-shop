"use client";
import { useState } from "react";
import { useCart } from "../../../../components/cart/CartContext";
export default function AddToCartButton({ product, image }:{ product:any, image?:string }){
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const handle = ()=> { add({ id: product.id, title: product.title, price_cents: product.price_cents, qty: 1, image }); setAdded(true); setTimeout(()=>setAdded(false), 900); };
  return <button className="btn btn-primary" onClick={handle}>{added ? "Added" : "Add to basket"}</button>;
}
