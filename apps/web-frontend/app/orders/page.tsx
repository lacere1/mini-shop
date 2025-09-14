"use client";
import { useEffect, useState } from "react";
import { getJSON } from "../../lib/api";
const gbp = new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"});
type Order = { id: string; total_cents:number; status:string; created_at:string; items:{ id:string; title:string; qty:number; price_cents:number; }[] };
export default function OrdersPage(){
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ const t = localStorage.getItem("minishop_token") || ""; getJSON("/orders/my", t).then(setOrders).finally(()=> setLoading(false)); },[]);
  if(loading) return <div>Loading...</div>;
  return (<div className="space-y-6">
    <h1 className="text-2xl font-bold">Your orders</h1>
    {orders.length===0 ? <p>You have no orders yet.</p> : (
      <div className="space-y-4">
        {orders.map(o => (<div key={o.id} className="card p-4">
          <div className="flex justify-between">
            <div><div className="font-medium">Order {o.id.slice(0,8)}</div><div className="text-sm text-gray-500">{new Date(o.created_at).toLocaleString("en-GB")}</div></div>
          </div>
          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">{o.items.map(i => <li key={i.id}>{i.title} ×{i.qty} @ {gbp.format(i.price_cents/100)}</li>)}</ul>
        </div>))}
      </div>
    )}
  </div>);
}
