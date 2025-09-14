"use client";
import { useCart } from "../../components/cart/CartContext";
import Link from "next/link";
import { useState } from "react";
import { postJSON } from "../../lib/api";
const gbp = new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"});
export default function CartPage(){
  const { items, setQty, remove, totalCents, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const placeOrder = async () => {
  if (items.length === 0) return;

  // Require login
  const token = typeof window !== 'undefined' ? localStorage.getItem('minishop_token') || '' : '';
  if (!token) {
    alert('Please log in to checkout.');
    window.location.href = '/login';
    return;
  }

  setPlacing(true);
  try {
    // 1) Create payment intent (mock or Stripe test)
    await postJSON('/payments/intents', { amount_cents: totalCents, currency: 'GBP' }, token);

    // 2) Place order: map id -> product_id for the API
    const orderItems = items.map(i => ({
      product_id: i.id,
      title: i.title,
      price_cents: i.price_cents,
      qty: i.qty,
    }));

    await postJSON('/orders', { items: orderItems, total_cents: totalCents }, token);

    clear();
    window.location.href = '/orders';
  } catch (err: any) {
    console.error(err);
    alert(`Checkout failed: ${err?.message || err}`);
  } finally {
    setPlacing(false);
  }
};
  return (<div className="grid lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-4">
      <h1 className="text-2xl font-bold">Your basket</h1>
      {items.length===0? (<div className="card p-8 text-center"><p className="mb-4">Your basket is empty.</p><Link href="/" className="btn btn-primary">Continue shopping</Link></div>)
      : items.map(i=> (<div key={i.id} className="card p-4 flex items-center gap-4">
          <img src={i.image || `https://picsum.photos/seed/${i.id}/100/100`} className="w-20 h-20 rounded-lg object-cover"/>
          <div className="flex-1"><div className="font-medium">{i.title}</div><div className="text-gray-600">{gbp.format(i.price_cents/100)}</div></div>
          <div className="flex items-center gap-2">
            <input type="number" min={1} className="w-20 border rounded-lg px-2 py-1" value={i.qty} onChange={e=> setQty(i.id, Math.max(1, parseInt(e.target.value||'1')))} />
            <button className="btn btn-outline" onClick={()=> remove(i.id)}>Remove</button>
          </div>
        </div>))}
    </div>
    <aside className="space-y-4">
      <div className="card p-6 space-y-3">
        <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{gbp.format(totalCents/100)}</span></div>
        <div className="text-xs text-gray-500">Shipping and taxes are calculated at checkout (demo).</div>
        <button className="btn btn-primary w-full disabled:opacity-60" disabled={items.length===0 || placing} onClick={placeOrder}>
          {placing? "Placing...":"Checkout"}
        </button>
      </div>
      {items.length>0 && <button className="btn btn-outline w-full" onClick={clear}>Clear basket</button>}
    </aside>
  </div>);
}
