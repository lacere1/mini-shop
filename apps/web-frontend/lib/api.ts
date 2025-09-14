export const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const AUTH_URL = process.env.AUTH_URL || process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000";
export async function getJSON(path: string, token?: string){
  const res = await fetch(API_URL + path, { cache: "no-store", headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if(!res.ok) throw new Error(`GET ${path} ${res.status}`);
  return res.json();
}
export async function postJSON(path: string, body: any, token?: string){
  const res = await fetch(API_URL + path, { method: "POST", headers: { "Content-Type":"application/json", ...(token? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
  if(!res.ok) throw new Error(`POST ${path} ${res.status}`);
  return res.json();
}
