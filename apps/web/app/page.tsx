'use client';

import { useState } from 'react';
import axios from 'axios';
import { Upload, Music, Image as ImageIcon, Loader2, Disc, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | '', msg: string }>({ type: '', msg: '' });
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [bpm, setBpm] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !title || !price || !bpm) {
      setStatus({ type: 'error', msg: 'Faltan campos obligatorios.' });
      return;
    }

    setUploading(true);
    setStatus({ type: '', msg: 'Subiendo...' });

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('bpm', bpm);
    formData.append('audio', audioFile);
    if (coverFile) formData.append('cover', coverFile);

    try {
      const response = await axios.post('http://localhost:3000/beats', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus({ type: 'success', msg: 'Beat publicado correctamente.' });
      setTitle(''); setPrice(''); setBpm(''); setAudioFile(null); setCoverFile(null);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error de conexión.';
      setStatus({ type: 'error', msg });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-black text-gray-200 font-sans flex items-center justify-center p-4">
      
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        <div className="p-8 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Disc className="text-purple-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">SoundVault Upload</h1>
          </div>
          <p className="text-neutral-400 text-sm ml-11">Panel de administración para productores</p>
        </div>

        <form onSubmit={handleUpload} className="p-8 space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Título del Track</label>
            <input 
              type="text" 
              placeholder="Ej. Midnight Tokyo Drive"
              className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Precio ($)</label>
              <input 
                type="number" 
                placeholder="29.99"
                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                value={price} onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">BPM</label>
              <input 
                type="number" 
                placeholder="140"
                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                value={bpm} onChange={(e) => setBpm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            
            <label className="cursor-pointer border border-dashed border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 hover:border-purple-500 rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all">
              <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileChange(e, setAudioFile)} />
              <Music className={audioFile ? "text-purple-400" : "text-neutral-500"} size={24} />
              <span className="text-xs text-neutral-400 text-center">{audioFile ? audioFile.name : "Subir Audio (MP3)"}</span>
            </label>

            <label className="cursor-pointer border border-dashed border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 hover:border-pink-500 rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, setCoverFile)} />
              <ImageIcon className={coverFile ? "text-pink-400" : "text-neutral-500"} size={24} />
              <span className="text-xs text-neutral-400 text-center">{coverFile ? coverFile.name : "Subir Portada"}</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors flex justify-center items-center gap-2 mt-4"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            {uploading ? "SUBIENDO..." : "PUBLICAR BEAT"}
          </button>

          {status.msg && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-red-900/20 text-red-400 border border-red-900/50'}`}>
              {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
              {status.msg}
            </div>
          )}

        </form>
      </div>
    </main>
  );
}