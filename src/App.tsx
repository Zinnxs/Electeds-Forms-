import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Rocket, 
  Gamepad2, 
  Users, 
  Music, 
  Video, 
  Zap, 
  Check, 
  Send,
  MessageCircle,
  Brain,
  Wrench,
  Camera,
  Mic,
  MonitorPlay,
  HeartHandshake,
  Settings,
  X,
  Link2,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MinisterioType = 'Mídia & Comunicação' | 'Palavra & Ensino' | 'Backstage & Admin' | 'Louvor' | '';

interface FormData {
  nome: string;
  whatsapp: string;
  idade: string;
  ministerios: MinisterioType[];
  funcoes: string[];
  instrumento?: string;
  experiencia: string;
}

const INITIAL_DATA: FormData = {
  nome: '',
  whatsapp: '',
  idade: '',
  ministerios: [],
  funcoes: [],
  instrumento: '',
  experiencia: ''
};

const MINISTERIOS = [
  { id: 'Mídia & Comunicação', icon: Video, color: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-500/50', border: 'border-pink-500', ring: 'ring-pink-500/50', text: 'text-pink-400', description: 'Audiovisual, fotografia, redes sociais e telão' },
  { id: 'Palavra & Ensino', icon: Brain, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/50', border: 'border-blue-500', ring: 'ring-blue-500/50', text: 'text-blue-400', description: 'Dar aulas, montar estudos, pregar' },
  { id: 'Backstage & Admin', icon: Wrench, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/50', border: 'border-emerald-500', ring: 'ring-emerald-500/50', text: 'text-emerald-400', description: 'Cuidar da sala, recepção, cabos, microfones' },
  { id: 'Louvor', icon: Music, color: 'from-purple-500 to-violet-500', shadow: 'shadow-purple-500/50', border: 'border-purple-500', ring: 'ring-purple-500/50', text: 'text-purple-400', description: 'Música, cantar, tocar instrumentos' },
] as const;

const FUNCOES_POR_MINISTERIO = {
  'Mídia & Comunicação': [
    { id: 'Captura (Fotos/Vídeos)', icon: Camera, tooltip: 'Tirar fotos e gravar os momentos mais irados.' },
    { id: 'Projeção (Telão e Letras)', icon: MonitorPlay, tooltip: 'Controlar as letras das músicas e slides no telão.' },
    { id: 'Engajamento (Ideias e Redes)', icon: MessageCircle, tooltip: 'Pensar em conteúdos criativos pro Instagram e TikTok.' },
  ],
  'Palavra & Ensino': [
    { id: 'Professor Auxiliar', icon: Users, tooltip: 'Ajudar os professores oficiais durante as aulas.' },
    { id: 'Arquiteto de Aulas (Pesquisa)', icon: Brain, tooltip: 'Pesquisar e montar o conteúdo e a estrutura dos estudos.' },
    { id: 'Voz (Pregação)', icon: Mic, tooltip: 'Falar na frente, dar recados ou pregar a Palavra.' },
  ],
  'Backstage & Admin': [
    { id: 'Stage Manager (Cabos, mic, BOs)', icon: Zap, tooltip: 'Manter o palco organizado e resolver os imprevistos (BOs).' },
    { id: 'Host & Admin (Recepção)', icon: HeartHandshake, tooltip: 'Recepcionar a galera, organizar listas e a sala.' },
  ],
  'Louvor': [
    { id: 'Voz', icon: Mic, tooltip: 'Cantar no time de louvor (backing vocal ou principal).' },
    { id: 'Instrumento', icon: Music, tooltip: 'Tocar violão, guitarra, baixo, bateria, teclado...' },
  ]
};

const EXPERIENCIAS = [
  { id: 'Sou nível zero, quero aprender do zero!', emoji: '👶', label: 'Nível 0' },
  { id: 'Já brinquei um pouco com isso.', emoji: '🎮', label: 'Level 10' },
  { id: 'Já domino e posso ajudar a ensinar.', emoji: '👑', label: 'Pro Player' },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localWebhookUrl, setLocalWebhookUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('webhook_url');
    if (saved) setLocalWebhookUrl(saved);
  }, []);

  const updateFields = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
    setErrorMsg("");
  };

  const validateStep1 = () => {
    if (!formData.nome.trim()) return "Como a gente te chama?";
    if (!formData.whatsapp.trim()) return "Precisamos do seu zap pra te chamar pro time!";
    if (!formData.idade || isNaN(Number(formData.idade)) || Number(formData.idade) < 1) return "Qual sua idade mesmo?";
    return "";
  };

  const nextStep = () => {
    let err = "";
    if (step === 1) err = validateStep1();
    if (step === 2 && formData.ministerios.length === 0) err = "Escolha pelo menos um Ministério pra continuar!";
    if (step === 3 && formData.funcoes.length === 0) err = "Escolha pelo menos uma habilidade!";
    if (step === 3 && formData.funcoes.includes('Instrumento') && !formData.instrumento?.trim()) err = "Qual instrumento você toca?";
    if (step === 4 && !formData.experiencia) err = "Selecione seu nível de XP!";
    
    if (err) {
      setErrorMsg(err);
      return;
    }
    
    setErrorMsg("");
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const webhookUrl = localWebhookUrl || import.meta.env.VITE_WEBHOOK_URL;
      
      const payload = {
        Nome: formData.nome,
        WhatsApp: formData.whatsapp,
        Idade: formData.idade,
        Ministerios: formData.ministerios.join(", "),
        Funcao: formData.funcoes.join(", ") + (formData.instrumento ? ` (${formData.instrumento})` : ""),
        NivelExperiencia: formData.experiencia,
        DataEnvio: new Date().toISOString()
      };

      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Simulando envio se não houver webhook configurado
        console.log("Simulando envio para webhook...", payload);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setStep(5); // Success step
      triggerConfetti();
    } catch (err) {
      console.error(err);
      setErrorMsg("Opa, deu um lag na rede! Tenta de novo?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ['#fde047', '#0f172a', '#ffffff', '#ef4444', '#3b82f6'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Variantes de Animação
  const pageVariants = {
    initial: { opacity: 0, x: 20, scale: 0.95 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 0, x: -20, scale: 0.95 }
  };

  const pageTransition = { type: "spring", stiffness: 300, damping: 30 };

  return (
    <div className="min-h-screen bg-grid-pattern flex flex-col font-sans overflow-x-hidden relative">
      
      {/* Header Logo */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-3 font-display font-bold text-xl tracking-tight bg-white brutal-border py-2 px-4 rounded-full brutal-shadow-sm select-none">
        <span className="text-xl">🚀</span> ELECTEDS / 26
      </div>

      {/* Settings Button */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white brutal-border brutal-shadow-sm rounded-full font-bold text-xs hover:bg-[#fde047] transition-colors uppercase tracking-wider select-none hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
      >
        <Settings size={16} /> Admin
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-4 border-slate-900 rounded-3xl w-full max-w-xl brutal-shadow overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b-4 border-slate-900 bg-[#fde047]">
                <h3 className="font-display font-bold text-2xl flex items-center gap-2">
                  <Link2 className="text-slate-900" />
                  Integração Sheets
                </h3>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-slate-900 hover:scale-110 transition-transform"
                >
                  <X size={28} strokeWidth={3} />
                </button>
              </div>
              
              <div className="p-8 space-y-6 text-slate-700 font-medium">
                <p>
                  Para salvar os dados no Google Sheets, insira uma URL de Webhook. Recomendamos usar o <a href="https://sheetmonkey.io/" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">SheetMonkey</a>.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-[#f8f9fa] rounded-2xl brutal-border text-sm space-y-2">
                    <strong className="text-slate-900 block mb-2 text-base">Passo a passo com SheetMonkey:</strong>
                    <ol className="list-decimal pl-5 space-y-1 text-slate-800">
                      <li>Crie uma nova planilha no Google Sheets.</li>
                      <li>Entre no SheetMonkey.io e conecte sua conta.</li>
                      <li>Crie um novo form, selecione sua planilha.</li>
                      <li>Copie a URL gerada e cole no campo abaixo.</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Webhook URL (Opcional)</label>
                  <input
                    type="url"
                    value={localWebhookUrl}
                    onChange={(e) => {
                      setLocalWebhookUrl(e.target.value);
                      localStorage.setItem('webhook_url', e.target.value);
                    }}
                    placeholder="https://submit-form.com/..."
                    className="w-full bg-white brutal-border rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-shadow text-slate-900 placeholder-slate-400 font-medium"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t-4 border-slate-900 flex justify-end bg-slate-50">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="brutal-btn"
                >
                  SALVAR E FECHAR
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header/Progress */}
      {step > 0 && step < 5 && (
        <div className="w-full max-w-3xl mx-auto pt-24 px-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={prevStep}
              className="p-2 rounded-xl border-2 border-slate-900 hover:bg-[#fde047] transition-colors text-slate-900 font-bold flex items-center gap-2 uppercase text-sm brutal-shadow-hover bg-white"
            >
              <ChevronLeft size={20} strokeWidth={3} /> Voltar
            </button>
            <div className="text-sm font-bold tracking-widest text-slate-900 uppercase bg-white brutal-border px-4 py-1.5 rounded-full brutal-shadow-sm">
              Fase 0{step} / 04
            </div>
          </div>
          
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden border-2 border-slate-900 shadow-inner">
            <motion.div 
              className="h-full bg-[#fde047] border-r-2 border-slate-900"
              initial={{ width: `${((step - 1) / 4) * 100}%` }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ ease: "circOut", duration: 0.6 }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center p-6 relative z-10">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 0: WELCOME */}
            {step === 0 && (
              <motion.div
                key="step0"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="w-full bg-white brutal-border brutal-shadow rounded-[2rem] p-8 md:p-14 text-left relative mt-16 lg:mt-0"
              >
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider brutal-border rounded-full bg-white">FORM 2026</span>
                  <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider brutal-border rounded-full bg-white">+1MIN PRA PREENCHER</span>
                </div>
                
                <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
                  <span className="inline-block mr-2 md:mr-4 origin-bottom-left rotate-12 drop-shadow-md">🚀</span> 
                  ELECTEDS<br/>FORMS 2026
                </h1>
                
                <p className="text-lg md:text-xl text-slate-700 mb-10 leading-relaxed font-medium max-w-2xl">
                  O EG é construído por você. Todo mundo tem algo pra somar aqui. Preenche rapidinho e conta pra gente onde você quer colocar a mão na massa — mesmo que seja pra aprender do zero!
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  <span className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider brutal-border rounded-full bg-[#f8f9fa]"><Camera size={14} strokeWidth={2.5}/> Mídia & Comunicação</span>
                  <span className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider brutal-border rounded-full bg-[#f8f9fa]"><Brain size={14} strokeWidth={2.5}/> Ensino & Palavra</span>
                  <span className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider brutal-border rounded-full bg-[#f8f9fa]"><Wrench size={14} strokeWidth={2.5}/> Backstage & Organização</span>
                  <span className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider brutal-border rounded-full bg-[#f8f9fa]"><Music size={14} strokeWidth={2.5}/> Louvor</span>
                </div>

                <button
                  onClick={nextStep}
                  className="brutal-btn w-full md:w-auto text-xl"
                >
                  COMEÇAR AGORA →
                </button>
              </motion.div>
            )}

            {/* STEP 1: PERSONAL DATA */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="w-full bg-white brutal-border brutal-shadow rounded-[2rem] p-8 md:p-12 text-left"
              >
                <div className="mb-10">
                  <h2 className="font-display text-4xl md:text-5xl font-black mb-4">Seu Player ID 🪪</h2>
                  <p className="text-xl text-slate-600 font-medium">Antes de escolher sua classe, precisamos saber quem é você.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold tracking-wider text-slate-900 uppercase">Como a gente te chama?</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={e => updateFields({ nome: e.target.value })}
                      placeholder="Seu nome ou apelido maneiro"
                      className="w-full bg-[#f8f9fa] brutal-border rounded-xl px-5 py-4 text-xl focus:bg-white focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all text-slate-900 placeholder-slate-400 font-bold"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-bold tracking-wider text-slate-900 uppercase">WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={e => updateFields({ whatsapp: e.target.value })}
                        placeholder="(DDD) 9XXXX-XXXX"
                        className="w-full bg-[#f8f9fa] brutal-border rounded-xl px-5 py-4 text-xl focus:bg-white focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all text-slate-900 placeholder-slate-400 font-bold"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-bold tracking-wider text-slate-900 uppercase">Idade</label>
                      <input
                        type="number"
                        value={formData.idade}
                        onChange={e => updateFields({ idade: e.target.value })}
                        placeholder="Sua idade"
                        min="10" max="99"
                        className="w-full bg-[#f8f9fa] brutal-border rounded-xl px-5 py-4 text-xl focus:bg-white focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all text-slate-900 placeholder-slate-400 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <p className="mt-6 text-rose-600 bg-rose-100 p-4 rounded-xl border-2 border-rose-600 font-bold text-center">⚠️ {errorMsg}</p>
                )}

                <div className="flex justify-end mt-10">
                  <button onClick={nextStep} className="brutal-btn">
                    Avançar <span className="text-2xl leading-none">&rarr;</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SQUAD SELECTION */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="w-full bg-white brutal-border brutal-shadow rounded-[2rem] p-8 md:p-12 text-left"
              >
                <div className="mb-10">
                  <h2 className="font-display text-4xl md:text-5xl font-black mb-4">Escolha os Ministérios 🛡️</h2>
                  <p className="text-xl text-slate-600 font-medium">Pode escolher mais de um! Onde você quer colocar a mão na massa?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MINISTERIOS.map((min) => {
                    const isSelected = formData.ministerios.includes(min.id as MinisterioType);
                    const Icon = min.icon;
                    return (
                      <button
                        key={min.id}
                        onClick={() => {
                          if (isSelected) {
                            const remaining = formData.ministerios.filter(m => m !== min.id);
                            // Remove unselected ministry configurations
                            const funcoesToRemove = (FUNCOES_POR_MINISTERIO as any)[min.id].map((f: any) => f.id);
                            const remainingFuncoes = formData.funcoes.filter(f => !funcoesToRemove.includes(f));
                            updateFields({ 
                              ministerios: remaining,
                              funcoes: remainingFuncoes
                            });
                          } else {
                            updateFields({ ministerios: [...formData.ministerios, min.id as MinisterioType] });
                          }
                        }}
                        className={cn(
                          "relative text-left p-6 flex flex-col items-start border-2 rounded-2xl transition-all duration-200 overflow-hidden",
                          isSelected 
                            ? "border-slate-900 bg-[#fde047] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] scale-[1.02] z-10" 
                            : "border-slate-900 bg-[#f8f9fa] hover:bg-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
                        )}
                      >
                        <div className="flex flex-col relative z-10 h-full justify-center w-full">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "p-3 rounded-xl border-2 border-slate-900 transition-all duration-300",
                              isSelected ? "bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] scale-110" : "bg-white"
                            )}>
                              <Icon size={28} className="text-slate-900" strokeWidth={2.5} />
                            </div>
                            <span className={cn(
                              "font-display font-bold text-xl transition-colors", 
                              isSelected ? "text-slate-900" : "text-slate-700"
                            )}>{min.id}</span>
                          </div>
                          
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="text-sm border-t-2 border-slate-900 pt-4 text-slate-900 font-bold"
                              >
                                {min.description}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {errorMsg && (
                  <p className="mt-6 text-rose-600 bg-rose-100 p-4 rounded-xl border-2 border-rose-600 font-bold text-center">⚠️ {errorMsg}</p>
                )}

                <div className="flex justify-end pt-4 mt-6">
                  <button 
                    onClick={nextStep} 
                    className={cn(
                      "brutal-btn",
                      formData.ministerios.length === 0 ? "opacity-50 grayscale cursor-not-allowed mx-auto" : ""
                    )}
                    disabled={formData.ministerios.length === 0}
                  >
                    Avançar <span className="text-2xl leading-none">&rarr;</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SUB-ROLE */}
            {step === 3 && formData.ministerios.length > 0 && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="w-full bg-white brutal-border brutal-shadow rounded-[2rem] p-8 md:p-12 text-left"
              >
                <div className="mb-10">
                  <h2 className="font-display text-4xl md:text-5xl font-black mb-4">Especialização ⚔️</h2>
                  <p className="text-xl text-slate-600 font-medium">
                    O que você quer fazer nas áreas que escolheu?
                  </p>
                </div>

                <div className="space-y-8">
                  {formData.ministerios.map(min => {
                    return (
                      <div key={min} className="space-y-4">
                        <h3 className="font-display text-2xl font-black bg-[#f8f9fa] inline-[px] px-4 py-2 brutal-border brutal-shadow-sm rounded-xl uppercase">{min}</h3>
                        <div className="space-y-3">
                          {(FUNCOES_POR_MINISTERIO as any)[min].map((func: any) => {
                            const isSelected = formData.funcoes.includes(func.id);
                            const FunctIcon = func.icon;
                            return (
                              <label
                                key={func.id}
                                className={cn(
                                  "group relative cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all border-slate-900",
                                  isSelected
                                    ? "bg-[#fde047] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                                    : "bg-[#f8f9fa] hover:bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                                )}
                              >
                                <div className={cn(
                                  "flex items-center justify-center w-6 h-6 rounded border-2 border-slate-900 flex-shrink-0 transition-colors bg-white"
                                )}>
                                  {isSelected && <Check size={18} className="text-slate-900 font-bold" strokeWidth={3} />}
                                </div>
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      updateFields({ funcoes: [...formData.funcoes, func.id] });
                                    } else {
                                      updateFields({ funcoes: formData.funcoes.filter(f => f !== func.id) });
                                    }
                                  }}
                                />
                                <div className="flex items-center gap-3 w-full">
                                  <FunctIcon size={24} className="text-slate-900" strokeWidth={2.5} />
                                  <span className={cn("text-xl font-bold", isSelected ? "text-slate-900" : "text-slate-700")}>
                                    {func.id}
                                  </span>
                                  <div className="group/tooltip relative ml-auto flex items-center justify-center">
                                    <Info size={20} className="text-slate-500 hover:text-slate-900 transition-colors relative z-10" strokeWidth={2.5} />
                                    <div className="absolute right-0 bottom-full mb-2 w-max max-w-[250px] sm:max-w-xs pointer-events-none opacity-0 group-hover/tooltip:opacity-100 group-hover:opacity-100 transition-all duration-300 z-50 text-left">
                                      <div className="bg-white text-slate-900 text-sm py-3 px-4 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                                        {func.tooltip}
                                      </div>
                                      <div className="w-3 h-3 bg-white border-b-2 border-r-2 border-slate-900 rotate-45 absolute -bottom-[7px] right-3"></div>
                                    </div>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {formData.funcoes.includes('Instrumento') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2">
                        <input
                          type="text"
                          value={formData.instrumento}
                          onChange={e => updateFields({ instrumento: e.target.value })}
                          placeholder="Qual instrumento? Ex: Bateria, Violão..."
                          className="w-full bg-[#f8f9fa] brutal-border rounded-xl px-5 py-4 text-xl focus:bg-white focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all text-slate-900 placeholder-slate-400 font-bold"
                          autoFocus
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {errorMsg && (
                  <p className="text-rose-500 font-medium text-center animate-pulse">{errorMsg}</p>
                )}

                <div className="flex justify-end mt-6">
                  <button onClick={nextStep} className="brutal-btn">
                    Avançar <span className="text-2xl leading-none">&rarr;</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: EXPERIENCE */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="w-full bg-white brutal-border brutal-shadow rounded-[2rem] p-8 md:p-12 text-left"
              >
                <div className="mb-10">
                  <h2 className="font-display text-4xl md:text-5xl font-black mb-4">XP Atual 🌟</h2>
                  <p className="text-xl text-slate-600 font-medium">Você já manja disso?</p>
                </div>

                <div className="space-y-4">
                  {EXPERIENCIAS.map(exp => (
                    <button
                      key={exp.id}
                      onClick={() => updateFields({ experiencia: exp.id })}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left",
                        formData.experiencia === exp.id
                          ? "border-slate-900 bg-[#fde047] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] scale-[1.02] z-10"
                          : "border-slate-900 bg-[#f8f9fa] hover:bg-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
                      )}
                    >
                      <div className="text-4xl md:text-5xl">{exp.emoji}</div>
                      <div>
                        <div className={cn("font-bold text-sm uppercase tracking-wider mb-1", 
                          formData.experiencia === exp.id ? "text-slate-900" : "text-slate-600"
                        )}>
                          {exp.label}
                        </div>
                        <div className="text-xl font-bold text-slate-900">{exp.id}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {errorMsg && (
                  <p className="mt-6 text-rose-600 bg-rose-100 p-4 rounded-xl border-2 border-rose-600 font-bold text-center">⚠️ {errorMsg}</p>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-6">
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Última etapa!
                  </div>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="brutal-btn w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"/>
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        FINALIZAR DRAFT <Send size={20} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && (
              <motion.div
                key="step5"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="w-full bg-white brutal-border brutal-shadow rounded-[2rem] p-8 md:p-14 text-center relative mt-16 md:mt-0 flex flex-col items-center gap-8"
              >
                <div className="inline-flex justify-center items-center w-28 h-28 rounded-full bg-[#fde047] brutal-border brutal-shadow mb-4 -rotate-12 transition-transform hover:rotate-12 duration-500">
                  <span className="text-6xl">🎯</span>
                </div>
                
                <h2 className="font-display text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tight">
                  Draft Confirmado!
                </h2>
                
                <div className="bg-[#f8f9fa] brutal-border brutal-shadow-sm p-8 rounded-2xl w-full max-w-sm mx-auto space-y-4">
                  <div className="text-slate-500 font-bold text-sm uppercase tracking-wider">Seu Perfil</div>
                  <div className="font-display text-3xl font-black text-slate-900">{formData.nome}</div>
                  <div className="flex flex-wrap gap-2 justify-center py-2">
                    {formData.ministerios.map(m => (
                      <span key={m} className="px-4 py-1.5 bg-white brutal-border brutal-shadow-sm rounded-full text-xs font-bold text-slate-900 uppercase">
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-slate-700 leading-relaxed">
                    {formData.funcoes.join(' • ')} 
                    {formData.instrumento ? ` (${formData.instrumento})` : ''}
                  </div>
                </div>

                <p className="text-lg md:text-xl text-slate-700 font-medium max-w-sm mt-4">
                  Os líderes entrarão em contato em breve pelo WhatsApp. 🚀
                </p>

                <button
                  onClick={() => {
                    setFormData(INITIAL_DATA);
                    setStep(0);
                  }}
                  className="font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest mt-4 text-sm hover:underline underline-offset-4"
                >
                  FAZER NOVO CADASTRO
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

