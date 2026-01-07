// apps/web/app/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { Upload, Music, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | '', msg: string }>({ type: '', msg: '' });
  
  // Datos del Formulario
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [bpm, setBpm] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!audioFile || !title || !price || !bpm) {
      setStatus({ type: 'error', msg: 'Faltan campos obligatorios (Audio, Título, Precio, BPM)' });
      return;
    }

    setUploading(true);
    setStatus({ type: '', msg: 'Subiendo archivos al servidor...' });

    // Preparamos los datos para enviar
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('bpm', bpm);
    formData.append('audio', audioFile);
    if (coverFile) formData.append('cover', coverFile);

    try {
      // 🚀 Enviamos los datos al Backend
      const response = await axios.post('http://localhost:3000/beats', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log("Respuesta del servidor:", response.data);
      setStatus({ type: 'success', msg: `¡Beat creado! ID: ${response.data.id}` });
      
      // Limpiar formulario
      setTitle(''); setAudioFile(null); setCoverFile(null);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Error de conexión con el servidor';
      setStatus({ type: 'error', msg: `Error: ${errorMsg}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-lg border border-neutral-800 bg-neutral-900/50 p-8 rounded-xl shadow-[0_0_50px_rgba(100,0,255,0.1)] backdrop-blur-sm">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter flex items-center justify-center gap-3">
            <Music className="text-purple-500" size={32} /> 
            SOUND_VAULT
          </h1>
          <p className="text-neutral-500 text-sm mt-2">ADMIN UPLOAD TERMINAL</p>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          
          {/* Título */}
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">TÍTULO DEL TRACK</label>
            <input 
              type="text" 
              className="w-full bg-black border border-neutral-700 p-3 rounded focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Ej: Cyberpunk City"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio */}
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">PRECIO ($)</label>
              <input 
                type="number" 
                className="w-full bg-black border border-neutral-700 p-3 rounded focus:border-purple-500 focus:outline-none"
                placeholder="29.99"
                value={price} onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            {/* BPM */}
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">BPM</label>
              <input 
                type="number" 
                className="w-full bg-black border border-neutral-700 p-3 rounded focus:border-purple-500 focus:outline-none"
                placeholder="140"
                value={bpm} onChange={(e) => setBpm(e.target.value)}
              />
            </div>
          </div>

          {/* Upload Audio */}
          <div className="border border-dashed border-neutral-700 hover:border-purple-500/50 bg-black/50 p-6 rounded-lg cursor-pointer transition-colors group">
            <label className="cursor-pointer w-full h-full block text-center">
              <input type="file" accept="audio/*" className="hidden" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
              <div className="flex flex-col items-center gap-2">
                <Music className={`transition-colors ${audioFile ? 'text-green-400' : 'text-neutral-600 group-hover:text-purple-400'}`} />
                <span className="text-xs text-neutral-400">
                  {audioFile ? audioFile.name : "Click para subir Audio (MP3/WAV)"}
                </span>
              </div>
            </label>
          </div>

          {/* Upload Cover */}
          <div className="border border-dashed border-neutral-700 hover:border-purple-500/50 bg-black/50 p-6 rounded-lg cursor-pointer transition-colors group">
            <label className="cursor-pointer w-full h-full block text-center">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className={`transition-colors ${coverFile ? 'text-green-400' : 'text-neutral-600 group-hover:text-purple-400'}`} />
                <span className="text-xs text-neutral-400">
                  {coverFile ? coverFile.name : "Click para subir Portada (JPG/PNG)"}
                </span>
              </div>
            </label>
          </div>

          {/* Botón Submit */}
          <button 
            type="submit" 
            disabled={uploading}
            className={`w-full font-bold py-3 rounded flex justify-center items-center gap-2 transition-all
              ${uploading ? 'bg-neutral-800 text-neutral-500' : 'bg-white text-black hover:bg-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]'}
            `}
          >
            {uploading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
            {uploading ? "SUBIENDO..." : "UPLOAD BEAT"}
          </button>

          {/* Mensajes de Estado */}
          {status.msg && (
            <div className={`p-3 rounded text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {status.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
              {status.msg}
            </div>
          )}

        </form>
      </div>
    </main>
  );
}