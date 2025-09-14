import { getJSON } from "../../../lib/api";
import { notFound } from "next/navigation";
import AddToCartButton from "./ui/AddToCartButton";
const gbp = new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"});
async function getProduct(id:string){ try{ return await getJSON(`/api/products/${id}`);}catch{return null;} }
export default async function ProductPage({ params }:{ params:{ id:string }}){
  const product = await getProduct(params.id); if(!product) return notFound();
  const img = product.image || `https://picsum.photos/seed/${product.id}/1200/800`;
  return (<div className="grid md:grid-cols-2 gap-8">
    <div className="card overflow-hidden"><img src={img} alt={product.title} className="w-full h-auto" /></div>
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <div className="text-2xl font-semibold">{gbp.format(product.price_cents/100)}</div>
      <p style={{color:'#6b7280'}}>{product.description || ""}</p>
      <AddToCartButton product={product} image={img} />
    </div>
  </div>);
}
