"use client";
import { useEffect } from "react";
export default function InvoicePage({ params }:{ params:{ id:string }}){
  useEffect(()=>{ window.location.href = `/orders/${params.id}/invoice`; },[params.id]);
  return <p>Opening invoice...</p>;
}
