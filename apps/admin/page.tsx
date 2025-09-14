"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  slug: string;
  price_cents: number;
  currency: string;
  description: string;
  image: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Product>>({});
  const token = typeof window !== "undefined" ? localStorage.getItem("minishop_token") : null;

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const saveProduct = async () => {
    if (!token) return alert("You must be logged in as admin");
    const method = form.id ? "PUT" : "POST";
    const url = form.id 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${form.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Saved!");
      setForm({});
      fetchProducts();
    } else {
      alert("Failed to save");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!token) return alert("You must be logged in as admin");
    if (!confirm("Delete product?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Product form */}
      <div className="card p-4 mb-6 space-y-3">
        <h2 className="font-semibold">{form.id ? "Edit Product" : "New Product"}</h2>
        <input
          type="text"
          placeholder="Title"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Slug"
          value={form.slug || ""}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Price (in cents)"
          value={form.price_cents || ""}
          onChange={(e) => setForm({ ...form, price_cents: Number(e.target.value) })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Currency"
          value={form.currency || "GBP"}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image || ""}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="border p-2 w-full"
        />
        <button onClick={saveProduct} className="btn btn-primary">{form.id ? "Update" : "Create"}</button>
        {form.id && <button onClick={() => setForm({})} className="btn btn-outline">Cancel</button>}
      </div>

      {/* Product list */}
      {loading ? <p>Loading...</p> : (
        <div className="grid gap-4">
          {products.map((p) => (
            <div key={p.id} className="card p-4 flex justify-between items-center">
              <div>
                <div className="font-bold">{p.title}</div>
                <div className="text-sm text-gray-600">£{(p.price_cents / 100).toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline" onClick={() => setForm(p)}>Edit</button>
                <button className="btn btn-error" onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
