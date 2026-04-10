import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "@/utils/api";

function hasValidId(id: any) { if (isNaN(id)) return false; return id && id !== "" && id !== "undefined" && id !== "null"; }

export default function CarroselFormPage() {
  const navigate = useNavigate(); const { id } = useParams();
  const [form, setForm] = useState<{ imagem: string }>({ imagem: "" });

  useEffect(() => {
    const loadData = async () => { if (hasValidId(id)) { const result = await apiGet<any>(`/carrosel/${id}`); setForm({ imagem: result.imagem || "" }); } };
    loadData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setForm({ ...form, imagem: reader.result as string }); reader.readAsDataURL(file); } };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { if (hasValidId(id)) { await apiPut<any>(`/carrosel/${id}`, form); } else { await apiPost<any>("/carrosel", form); } navigate("/dashboard/carrosel"); } catch (err) { console.error(err); } };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">{hasValidId(id) ? "Editar Imagem" : "Upload de Imagem"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block font-semibold mb-1">Selecione a Imagem</label><input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />{form.imagem && (<div className="mt-2"><img src={form.imagem} alt="Preview" className="w-full h-32 object-cover rounded border" /></div>)}</div>
        <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded font-bold text-lg hover:bg-blue-800 transition" disabled={!form.imagem}>{hasValidId(id) ? "Salvar alterações" : "Salvar Imagem"}</button>
      </form>
    </div>
  );
}
