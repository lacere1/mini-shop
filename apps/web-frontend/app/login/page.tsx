"use client";
import { useState, useEffect } from "react";
import { AUTH_URL } from "../../lib/api";
export default function LoginPage(){
  const [email,setEmail] = useState(""); const [password,setPassword] = useState(""); const [mode,setMode]=useState<"login"|"register">("login"); const [msg,setMsg]=useState("");
  useEffect(()=>{ const t = localStorage.getItem("minishop_token"); if(t){ setMsg("Already logged in. Redirecting..."); setTimeout(()=>{ window.location.href = "/"; }, 900); } },[]);
  const submit = async (e:React.FormEvent)=> {
    e.preventDefault(); setMsg("");
    const url = `${AUTH_URL}/auth/${mode}`;
    const res = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if(res.ok){
      if(mode==="login"){ localStorage.setItem("minishop_token", data.access); setMsg("Logged in! Redirecting..."); setTimeout(()=>{ window.location.href = "/"; }, 900); }
      else { setMsg("Registered! Now switch to Login."); }
    } else { setMsg(data?.message || "Error"); }
  };
  return (<div className="max-w-md mx-auto space-y-6">
    <h1 className="text-2xl font-bold">{mode==="login"?"Log in":"Create account"}</h1>
    <form onSubmit={submit} className="card p-6 space-y-4">
      <input className="w-full border rounded-lg px-3 py-2" type="email" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
      <input className="w-full border rounded-lg px-3 py-2" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
      <button className="btn btn-primary w-full" type="submit">{mode==="login"?"Log in":"Register"}</button>
      <button type="button" className="btn btn-outline w-full" onClick={()=> setMode(mode==="login"?"register":"login")}>Switch to {mode==="login"?"Register":"Log in"}</button>
      {msg && <p style={{color:'#374151', fontSize:14}}>{msg}</p>}
    </form>
  </div>);
}
