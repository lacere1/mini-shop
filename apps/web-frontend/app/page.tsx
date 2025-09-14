import ProductCard from "../components/ProductCard";
import { getJSON } from "../lib/api";
async function getProducts(){ return await getJSON("/api/products"); }
export default async function Home(){
  const products = await getProducts();
  return (<div className="space-y-6">
    <section className="flex items-end justify-between"><div><h1 className="text-3xl font-bold">New arrivals</h1><p style={{color:'#6b7280'}}>Browse our latest items.</p></div></section>
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{products.map((p:any)=> <ProductCard key={p.id} product={p}/>)}</section>
  </div>);
}
