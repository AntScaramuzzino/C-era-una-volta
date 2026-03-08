import React, { useState } from 'react';
import { 
  ArrowLeft, Shuffle, MousePointer2, Check, PlusCircle, 
  Play, Sparkles, RefreshCw, Eye, Flag, Settings, Layout, BrainCircuit, Dices, Heart, Scale, Layers, FileText
} from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { 
  CATEGORIES, REAL_DECK, STORY_TONES, 
  LANGUAGE_STYLES, STORY_LENGTHS, ILLUSTRATION_STYLES 
} from './constants';
import { CardData, Category } from './types';
import { generateStory, generateThematicDeck, generateCardImage, generateRandomSituation } from './services/ai';
import { CardUI } from './components/CardUI';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ZoomModal } from './components/ZoomModal';
import { Header } from './components/Header';

const App = () => {
  const [activeTab, setActiveTab] = useState('DECK'); 
  const [baseDeck] = useState<CardData[]>(REAL_DECK);
  const [thematicDeck, setThematicDeck] = useState<CardData[] | null>(null); 
  const [isThematicMode, setIsThematicMode] = useState(false);
  const [filter, setFilter] = useState('ALL');

  // Impostazioni
  const [thematicCardCount, setThematicCardCount] = useState(20);
  const [selectedStyle, setSelectedStyle] = useState(ILLUSTRATION_STYLES[0]);
  const [gameHandLimit, setGameHandLimit] = useState(5);
  const [gameFinalLimit, setGameFinalLimit] = useState(1);
  const [storyTone, setStoryTone] = useState(STORY_TONES[0]);
  const [languageStyle, setLanguageStyle] = useState(LANGUAGE_STYLES[0]);
  const [storyLength, setStoryLength] = useState(STORY_LENGTHS[1]);

  // Selezione & Zoom
  const [manualMode, setManualMode] = useState(false);
  const [selectedHand, setSelectedHand] = useState<CardData[]>([]);
  const [selectedFinals, setSelectedFinals] = useState<CardData[]>([]);
  const [zoomedCard, setZoomedCard] = useState<{card: CardData, cat: Category, img?: string | null, loading?: boolean} | null>(null);

  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [loadingCards, setLoadingCards] = useState<Record<string, boolean>>({});
  const [newDeckInput, setNewDeckInput] = useState("");
  const [aiAssistant, setAiAssistant] = useState({ open: false, loading: false, content: null as string | null, title: "Assistente AI" });
  const [diceAnimating, setDiceAnimating] = useState(false);
  
  const [gameHand, setGameHand] = useState<CardData[]>([]);
  const [gameFinals, setGameFinals] = useState<CardData[]>([]);
  const [revealedFinals, setRevealedFinals] = useState<number[]>([]);

  const downloadPDF = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const opt = {
      margin:       10,
      filename:     filename,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleGenerateImage = async (card: CardData, uniqueId: string, force = false) => {
    if (!force && generatedImages[uniqueId]) return;
    setLoadingCards(prev => ({ ...prev, [uniqueId]: true }));
    try {
      const imgData = await generateCardImage(card, selectedStyle.prompt);
      if (imgData) {
        setGeneratedImages(prev => ({ ...prev, [uniqueId]: imgData }));
      }
    } catch (e) { 
      console.error("Img error", e); 
    }
    setLoadingCards(prev => ({ ...prev, [uniqueId]: false }));
  };

  const generateAllImages = async () => {
    const currentDeck = isThematicMode && thematicDeck ? thematicDeck : baseDeck;
    const cardsToGenerate = filter === 'ALL' ? currentDeck : currentDeck.filter(c => c.cat === filter);
    
    // Generate images in batches of 5 to avoid rate limits while being faster
    const batchSize = 5;
    for (let i = 0; i < cardsToGenerate.length; i += batchSize) {
      const batch = cardsToGenerate.slice(i, i + batchSize);
      const promises = batch.map(async (card) => {
        const originalIndex = currentDeck.findIndex(c => c.title === card.title && c.desc === card.desc);
        if (originalIndex === -1) return;
        
        const uniqueId = isThematicMode ? `thematic-${originalIndex}` : `base-${originalIndex}`;
        
        if (!generatedImages[uniqueId] && !loadingCards[uniqueId]) {
          await handleGenerateImage(card, uniqueId);
        }
      });
      
      await Promise.all(promises);
      
      // Small delay between batches
      if (i + batchSize < cardsToGenerate.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const handleRandomSituation = async () => {
    setDiceAnimating(true);
    try {
      const situation = await generateRandomSituation();
      setNewDeckInput(situation);
    } catch (error) {
      console.error("Failed to generate random situation", error);
    } finally {
      setDiceAnimating(false);
    }
  };

  const startGame = () => {
    setGeneratedImages({});
    const currentPool = isThematicMode && thematicDeck ? thematicDeck : baseDeck;
    const poolNarr = currentPool.filter(c => c.cat !== 'FINALE');
    const poolFin = currentPool.filter(c => c.cat === 'FINALE');

    let finalHand = [...selectedHand];
    if (finalHand.length < gameHandLimit) {
      const remaining = poolNarr.filter(c => !finalHand.some(s => s.title === c.title)).sort(() => Math.random() - 0.5);
      finalHand = [...finalHand, ...remaining.slice(0, gameHandLimit - finalHand.length)];
    }

    let finalTargets = [...selectedFinals];
    if (finalTargets.length < gameFinalLimit) {
      const remaining = poolFin.filter(c => !finalTargets.some(s => s.title === c.title)).sort(() => Math.random() - 0.5);
      finalTargets = [...finalTargets, ...remaining.slice(0, gameFinalLimit - finalTargets.length)];
    }

    const newHand = finalHand.slice(0, gameHandLimit);
    const newFinals = finalTargets.slice(0, gameFinalLimit);

    setGameHand(newHand);
    setGameFinals(newFinals);
    setRevealedFinals([]);
    setActiveTab('PLAY');
    
    // Generate images sequentially to avoid rate limits
    setTimeout(() => {
      generateAllImagesForHand(newHand, newFinals);
    }, 100);
  };

  const generateAllImagesForHand = async (handParam?: CardData[], finalsParam?: CardData[]) => {
    const hand = Array.isArray(handParam) ? handParam : gameHand;
    const finals = Array.isArray(finalsParam) ? finalsParam : gameFinals;
    
    const allCards = [
      ...hand.map((card, i) => ({ card, uniqueId: `play-hand-${i}` })),
      ...finals.map((card, i) => ({ card, uniqueId: `play-final-${i}` }))
    ];

    // Generate images in batches of 5
    const batchSize = 5;
    for (let i = 0; i < allCards.length; i += batchSize) {
      const batch = allCards.slice(i, i + batchSize);
      const promises = batch.map(async ({ card, uniqueId }) => {
        if (!generatedImages[uniqueId] && !loadingCards[uniqueId]) {
          await handleGenerateImage(card, uniqueId, true);
        }
      });
      
      await Promise.all(promises);
      
      if (i + batchSize < allCards.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };
  const generateStoryFromHand = async () => {
    if (!gameHand.length) return;
    setAiAssistant({ open: true, loading: true, content: null, title: "Narratore AI" });
    const prompt = `Crea una storia sul cyberbullismo.\nLUNGHEZZA: ${storyLength.label}.\nTONO: ${storyTone}.\nSTILE: ${languageStyle}.\nCARTE: ${gameHand.map(c => c.title).join(", ")}.\nFINALE: ${gameFinals.map(c => c.title).join(", ")}.\nUsa il formato Markdown (# Titolo, ## Capitoli, **Grassetto**). Lingua: Italiano.`;
    const sysPrompt = "Sei un narratore esperto per ragazzi. Usa un linguaggio adatto per raccontare una storia educativa.";
    try {
      const text = await generateStory(prompt, sysPrompt);
      setAiAssistant(prev => ({ ...prev, loading: false, content: text }));
    } catch (e) { 
      setAiAssistant(prev => ({ ...prev, loading: false, content: "Errore di connessione." })); 
    }
  };

  const toggleManualCard = (card: CardData) => {
    if (!manualMode) return;
    if (card.cat === 'FINALE') {
      if (selectedFinals.some(c => c.title === card.title)) {
        setSelectedFinals(selectedFinals.filter(c => c.title !== card.title));
      } else if (selectedFinals.length < gameFinalLimit) {
        setSelectedFinals([...selectedFinals, card]);
      }
    } else {
      if (selectedHand.some(c => c.title === card.title)) {
        setSelectedHand(selectedHand.filter(c => c.title !== card.title));
      } else if (selectedHand.length < gameHandLimit) {
        setSelectedHand([...selectedHand, card]);
      }
    }
  };

  const createMiniDeckFromAI = async () => {
    if (!newDeckInput.trim()) return;
    setAiAssistant({ open: true, loading: true, content: null, title: "Generazione Tematica" });
    try {
      const cards = await generateThematicDeck(newDeckInput, thematicCardCount);
      if (cards && cards.length > 0) {
        setThematicDeck(cards);
        setIsThematicMode(true);
        setAiAssistant({ open: false, loading: false, content: null, title: "" });
        setNewDeckInput("");
        setFilter('ALL');
        setSelectedHand([]);
        setSelectedFinals([]);
      } else {
        setAiAssistant({ open: true, loading: false, content: "Errore nella generazione delle carte.", title: "Errore" });
      }
    } catch (e) { 
      setAiAssistant({ open: true, loading: false, content: "Errore di connessione.", title: "Errore" }); 
    }
  };

  const resetToFullDeck = () => {
    setIsThematicMode(false);
    setThematicDeck(null);
    setFilter('ALL');
    setSelectedHand([]);
    setSelectedFinals([]);
  };

  const currentDeck = isThematicMode && thematicDeck ? thematicDeck : baseDeck;
  const filteredCards = filter === 'ALL' ? currentDeck : currentDeck.filter(c => c.cat === filter);

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-20 overflow-x-hidden">
      
      <ZoomModal zoomedCard={zoomedCard} onClose={() => setZoomedCard(null)} />
      
      <AiAssistantModal 
        open={aiAssistant.open}
        loading={aiAssistant.loading}
        content={aiAssistant.content}
        title={aiAssistant.title}
        onClose={() => setAiAssistant({ ...aiAssistant, open: false })}
      />

      <Header activeTab={activeTab} setActiveTab={setActiveTab} onStartGame={startGame} />

      <main className="max-w-7xl mx-auto px-4 py-8 overflow-visible">
        
        {activeTab === 'SETTINGS' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 overflow-visible">
             <div className="bg-white rounded-[3rem] p-10 border shadow-xl">
                <div className="mb-10">
                  <h2 className="text-3xl font-black uppercase text-slate-900 flex items-center gap-3 mb-2">
                    <Settings className="text-indigo-600" size={32}/> Configurazione
                  </h2>
                  <p className="text-slate-500 font-medium text-lg">Personalizza le regole del gioco e il comportamento dell'Intelligenza Artificiale.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <section className="space-y-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 font-medium">
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                      <Layout size={14}/> Struttura Partita
                    </h4>
                    <div className="space-y-6">
                       <div>
                         <label className="block text-xs font-black text-slate-400 uppercase tracking-tighter mb-3">
                           Carte Narrazione: <span className="text-indigo-600 font-black">{gameHandLimit}</span>
                         </label>
                         <input type="range" min="3" max="10" value={gameHandLimit} onChange={(e) => setGameHandLimit(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-full appearance-none accent-indigo-600" />
                       </div>
                       <div>
                         <label className="block text-xs font-black text-slate-400 uppercase tracking-tighter mb-3">
                           Obiettivi Finali: <span className="text-indigo-600 font-black">{gameFinalLimit}</span>
                         </label>
                         <input type="range" min="1" max="2" value={gameFinalLimit} onChange={(e) => setGameFinalLimit(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-indigo-600" />
                       </div>
                    </div>
                  </section>
                  <section className="space-y-8 p-6 bg-purple-50/30 rounded-3xl border border-purple-100 font-medium">
                    <h4 className="text-xs font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                      <BrainCircuit size={14}/> Narratore AI
                    </h4>
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Tono</label>
                            <select value={storyTone} onChange={(e) => setStoryTone(e.target.value)} className="w-full p-3 rounded-xl bg-white border font-bold text-sm outline-none focus:border-purple-200">
                              {STORY_TONES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Linguaggio</label>
                            <select value={languageStyle} onChange={(e) => setLanguageStyle(e.target.value)} className="w-full p-3 rounded-xl bg-white border font-bold text-sm outline-none focus:border-purple-200">
                              {LANGUAGE_STYLES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                          </div>
                       </div>
                       <div>
                         <label className="block text-xs font-black text-slate-400 uppercase mb-3">Lunghezza Storia</label>
                         <div className="flex gap-2">
                           {STORY_LENGTHS.map(l => (
                             <button key={l.id} onClick={() => setStoryLength(l)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${storyLength.id === l.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-100 bg-white text-slate-400'}`}>
                               {l.label}
                             </button>
                           ))}
                         </div>
                       </div>
                    </div>
                  </section>
                </div>
                <div className="mt-8 p-6 bg-amber-50/50 rounded-3xl border border-amber-100 font-medium">
                    <h4 className="text-xs font-black uppercase tracking-widest text-amber-600 mb-6 flex items-center gap-2">
                      <Dices size={14}/> Settaggi Generatore Tematico
                    </h4>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-tighter mb-3">
                      Carte da generare: <span className="text-amber-600 font-black">{thematicCardCount}</span>
                    </label>
                    <input type="range" min="10" max="40" value={thematicCardCount} onChange={(e) => setThematicCardCount(parseInt(e.target.value))} className="w-full h-2 bg-amber-100 rounded-full appearance-none accent-amber-600" />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'DECK' && (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8 no-print font-medium">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border-4 border-indigo-50 flex flex-col items-center text-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter z-10 mb-2">Generatore Tematico</h3>
                <p className="text-slate-500 font-medium text-lg mb-2 z-10 max-w-2xl mx-auto">Scrivi un argomento (es. "Cyberbullismo", "Avventura nello Spazio") e l'IA creerà un mazzo di carte unico per la tua storia.</p>
                <div className="flex gap-4 w-full max-w-2xl relative z-10">
                  <div className="flex-grow relative">
                    <input 
                      type="text" 
                      placeholder="Descrivi lo scenario (es. Sicurezza su Minecraft)..." 
                      className={`w-full px-6 py-5 bg-slate-50 rounded-2xl border-2 border-slate-100 text-lg outline-none font-bold shadow-inner transition-all ${diceAnimating ? 'opacity-50 scale-95' : ''}`} 
                      value={newDeckInput} 
                      onChange={(e) => setNewDeckInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && createMiniDeckFromAI()} 
                    />
                    <button 
                      onClick={handleRandomSituation} 
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-indigo-400 hover:text-indigo-600 transition-all hover:bg-white rounded-xl shadow-sm ${diceAnimating ? 'rotate-180 scale-125' : ''}`}
                      title="Suggerisci un tema casuale"
                    >
                      <Shuffle size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={createMiniDeckFromAI} 
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:bg-indigo-700 active:scale-95 group transition-all font-bold flex items-center justify-center gap-2"
                  >
                    <Sparkles size={24} className="group-hover:rotate-12 transition-all"/> <span className="hidden sm:inline">Genera</span>
                  </button>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-4 z-10 mt-2">
                  {isThematicMode && (
                    <button onClick={resetToFullDeck} className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-xs transition-colors">
                      <ArrowLeft size={14}/> Torna al Mazzo Originale
                    </button>
                  )}
                  <button 
                    onClick={() => setManualMode(!manualMode)} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase border-2 transition-all ${manualMode ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md' : 'bg-white border-slate-100 text-slate-400 font-medium hover:border-slate-300'}`}
                  >
                    <MousePointer2 size={16}/> {manualMode ? `Componi la tua Mano Manualmente (${selectedHand.length}/${gameHandLimit})` : 'Scegli tu le carte da giocare (Modalità Manuale)'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 no-print sticky top-24 z-30 py-3 bg-slate-100/80 backdrop-blur-md border-b font-black justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilter('ALL')} 
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase border-2 transition ${filter === 'ALL' ? 'bg-slate-900 text-white shadow-xl border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
                >
                  Tutte ({filteredCards.length})
                </button>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button 
                    key={key} 
                    onClick={() => setFilter(key)} 
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border-2 flex items-center gap-2 transition ${filter === key ? `${cat.color} shadow-xl border-current` : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={generateAllImages}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-black uppercase text-[10px] hover:bg-indigo-700 transition shadow-sm"
                  title="Genera le illustrazioni per tutte le carte visibili (potrebbe richiedere tempo)"
                >
                  <Sparkles size={14}/> Genera Tutte
                </button>
                <button 
                  onClick={() => downloadPDF('print-area', 'Mazzo_Carte.pdf')}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-black uppercase text-[10px] hover:bg-red-700 transition shadow-sm"
                  title="Scarica tutte le carte visibili in formato PDF"
                >
                  <FileText size={14}/> Scarica PDF Mazzo
                </button>
              </div>
            </div>

            <div id="print-area" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-3">
              {filteredCards.map((card) => {
                const currentDeck = isThematicMode && thematicDeck ? thematicDeck : baseDeck;
                const originalIndex = currentDeck.findIndex(c => c.title === card.title && c.desc === card.desc);
                const uniqueId = isThematicMode ? `thematic-${originalIndex}` : `base-${originalIndex}`;
                const isSelected = selectedHand.some(c => c.title === card.title && c.desc === card.desc) || selectedFinals.some(c => c.title === card.title);
                return (
                  <div key={uniqueId} className="relative group cursor-pointer" onClick={() => toggleManualCard(card)}>
                    <CardUI 
                      card={card} 
                      cat={CATEGORIES[card.cat] || CATEGORIES.SITUAZIONE} 
                      img={generatedImages[uniqueId]} 
                      loading={loadingCards[uniqueId]} 
                      onGenerate={() => handleGenerateImage(card, uniqueId)} 
                      isMedium
                    />
                    {manualMode && (
                      <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-xl z-20 transition-all ${isSelected ? 'bg-green-500 text-white scale-110' : 'bg-slate-200 text-slate-400 scale-100'}`}>
                        {isSelected ? <Check size={16} strokeWidth={4}/> : <PlusCircle size={16}/>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'PLAY' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 font-medium">
            {!gameHand.length ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-200 text-center shadow-inner px-4">
                <Play size={64} className="text-indigo-100 mb-6"/>
                <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Inizia la tua avventura</h2>
                <p className="text-slate-500 font-medium mb-8 text-center max-w-md">Estrai una mano casuale dal mazzo per iniziare a raccontare la tua storia. Usa le carte per superare gli ostacoli e raggiungere il tuo Finale Segreto.</p>
                <button onClick={startGame} className="bg-indigo-600 text-white px-10 py-4 rounded-[2rem] font-black uppercase shadow-2xl hover:scale-105 transition-all tracking-widest text-sm">
                  Estrai la tua Mano
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10 border-b border-slate-200 pb-6">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase mt-3 tracking-tighter">La Tua Mano</h2>
                    <p className="text-slate-500 font-medium mt-2 text-lg max-w-2xl">Racconta la tua storia usando queste carte. Clicca su una carta per ingrandirla o per generare la sua illustrazione con l'IA.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={generateAllImagesForHand}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-indigo-700 transition shadow-sm active:scale-95"
                      title="Genera le illustrazioni per tutte le carte della tua mano"
                    >
                      <Sparkles size={18}/> Genera Illustrazioni
                    </button>
                    <button 
                      onClick={() => downloadPDF('hand-print-area', 'La_Tua_Mano.pdf')}
                      className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-red-700 transition shadow-sm active:scale-95"
                      title="Scarica le carte della tua mano in formato PDF"
                    >
                      <FileText size={18}/> Scarica PDF Mano
                    </button>
                    <button onClick={generateStoryFromHand} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border-2 border-indigo-100 px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-indigo-100 transition shadow-sm active:scale-95" title="Crea una storia basata sulle carte che hai estratto">
                      <Sparkles size={18}/> Genera Storia AI
                    </button>
                    <button onClick={startGame} className="flex items-center gap-2 bg-white text-slate-600 border-2 px-6 py-3 rounded-2xl font-black text-xs uppercase active:scale-95 transition-all shadow-sm" title="Scarta queste carte ed estrai una nuova mano">
                      <RefreshCw size={18}/> Nuova Mano
                    </button>
                  </div>
                </div>
                <div id="hand-print-area" className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {gameHand.map((card, i) => (
                    <div key={`play-hand-${i}`} className="cursor-zoom-in group font-medium" onClick={() => setZoomedCard({ card, cat: CATEGORIES[card.cat], img: generatedImages[`play-hand-${i}`], loading: loadingCards[`play-hand-${i}`] })}>
                       <CardUI card={card} cat={CATEGORIES[card.cat] || CATEGORIES.SITUAZIONE} img={generatedImages[`play-hand-${i}`]} loading={loadingCards[`play-hand-${i}`]} isMedium />
                    </div>
                  ))}
                  {gameFinals.map((card, i) => (
                    <div key={`final-${i}`} className="w-full aspect-[2.5/3.5] perspective-1000">
                      <div className={`relative w-full h-full transition-transform duration-1000 transform-style-3d cursor-pointer ${revealedFinals.includes(i) ? 'rotate-y-180' : ''}`} onClick={() => setRevealedFinals(prev => prev.includes(i) ? prev.filter(f => f !== i) : [...prev, i])}>
                        <div className="absolute inset-0 backface-hidden bg-indigo-950 rounded-[2.5rem] flex flex-col items-center justify-center text-white border-[8px] border-white/5 shadow-xl overflow-hidden group">
                          <div className="absolute inset-0 opacity-90 rounded-[2.5rem]" style={{ background: 'linear-gradient(to bottom right, #3730a3, #000000)' }}></div>
                          <div className="relative z-10 flex flex-col items-center text-center p-6">
                            <Flag size={40} className="opacity-40 mb-4 animate-pulse"/>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 text-indigo-300 opacity-60 whitespace-nowrap">Segreto</span>
                            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter whitespace-nowrap">Obiettivo</h3>
                            <div className="bg-white/10 px-6 py-2.5 rounded-full border border-white/20 flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-md whitespace-nowrap">
                              <Eye size={16}/> <span className="text-[10px] font-black uppercase">Svela</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl cursor-zoom-in" onClick={(e) => { e.stopPropagation(); setZoomedCard({ card, cat: CATEGORIES.FINALE, img: generatedImages[`play-final-${i}`], loading: loadingCards[`play-final-${i}`] }); }}>
                          <CardUI card={card} cat={CATEGORIES.FINALE} img={generatedImages[`play-final-${i}`]} loading={loadingCards[`play-final-${i}`]} isMedium />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'RULES' && (
          <div className="max-w-4xl mx-auto bg-white rounded-[4rem] p-10 md:p-16 shadow-xl border border-slate-100 animate-in slide-in-from-bottom duration-500 font-medium">
             <div className="prose prose-slate max-w-none text-left">
                <div className="flex flex-col items-center text-center mb-12">
                   <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter whitespace-pre-wrap">Guida all'App: "C’era una volta… online"</h1>
                   <p className="text-slate-500 text-lg">Benvenuto nel laboratorio digitale di storytelling. Questa app è uno strumento educativo progettato per affrontare il tema del cyberbullismo attraverso la narrazione collaborativa. Esplora le carte, componi il tuo mazzo e usa l'IA per generare storie uniche.</p>
                   
                   <div className="bg-amber-50 p-8 rounded-3xl border-2 border-amber-100 text-sm text-amber-900 mt-8 shadow-inner leading-relaxed">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <Scale size={24} className="text-amber-600" />
                        <span className="font-black uppercase tracking-widest text-xs">Nota Legale e Creativa</span>
                      </div>
                      Il gioco è liberamente ispirato al classico <strong>"C’era una volta"</strong> (Once Upon a Time, 1994) di Richard Lambert, Andrew Rilstone e James Wallis, edito da <strong>Atlas Games</strong>.
                   </div>
                </div>

                <div className="space-y-16">
                  <section>
                    <h2 className="text-2xl font-black text-indigo-900 border-b-4 border-indigo-100 pb-2 mb-8 flex items-center gap-2 uppercase tracking-tighter"><Settings size={24}/> Configurazione Iniziale (Impostazioni)</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 text-sm">
                       <li className="bg-slate-50 p-6 rounded-3xl border border-slate-100"><strong className="text-indigo-600 block mb-2 uppercase text-xs whitespace-nowrap">Mazzo Tematico</strong> Scegli quante carte generare quando utilizzi il "Generatore Tematico" (default 20).</li>
                       <li className="bg-slate-50 p-6 rounded-3xl border border-slate-100"><strong className="text-indigo-600 block mb-2 uppercase text-xs whitespace-nowrap">Stile Illustrazioni</strong> Seleziona l'estetica delle immagini generate dall'IA (Retrò, Gotici, Sci-Fi o <strong>Icone Infanzia</strong>).</li>
                       <li className="bg-slate-50 p-6 rounded-3xl border border-slate-100"><strong className="text-indigo-600 block mb-2 uppercase text-xs whitespace-nowrap">Gestione Mano</strong> Imposta quante carte narrazione (da 5 a 10) e quante carte Finale (1 o 2) ricevere.</li>
                    </ul>
                  </section>
                  <section>
                    <h2 className="text-2xl font-black text-indigo-900 border-b-4 border-indigo-100 pb-2 mb-8 flex items-center gap-2 uppercase tracking-tighter"><Layers size={24}/> Le Categorie di Carte</h2>
                    <div className="overflow-hidden rounded-[2rem] border-2 shadow-sm mb-10 text-[11px]">
                      <table className="min-w-full divide-y divide-slate-200 text-left">
                        <thead className="bg-slate-50 font-black uppercase text-slate-400"><tr><th className="px-6 py-4">Categoria</th><th className="px-6 py-4">Colore</th><th className="px-6 py-4">Funzione</th><th className="px-6 py-4 text-center">Qtà</th></tr></thead>
                        <tbody className="divide-y bg-white font-medium text-slate-600">
                          <tr><td className="px-6 py-4 font-black text-blue-600 uppercase">Personaggio</td><td className="px-6 py-4">Blu</td><td className="px-6 py-4">Protagonisti (bullo, vittima, moderatore).</td><td className="px-6 py-4 text-center">20</td></tr>
                          <tr><td className="px-6 py-4 font-black text-red-600 uppercase">Situazione</td><td className="px-6 py-4">Rosso</td><td className="px-6 py-4">Eventi digitali (post virale, profilo falso).</td><td className="px-6 py-4 text-center">25</td></tr>
                          <tr><td className="px-6 py-4 font-black text-green-600 uppercase">Azione</td><td className="px-6 py-4">Verde</td><td className="px-6 py-4">Cosa viene fatto per reagire o attaccare.</td><td className="px-6 py-4 text-center">25</td></tr>
                          <tr><td className="px-6 py-4 font-black text-yellow-600 uppercase">Emozione</td><td className="px-6 py-4">Giallo</td><td className="px-6 py-4">Il vissuto interiore dei ragazzi.</td><td className="px-6 py-4 text-center">20</td></tr>
                          <tr><td className="px-6 py-4 font-black text-purple-600 uppercase">Aiuto</td><td className="px-6 py-4">Viola</td><td className="px-6 py-4">Strategie positive e soluzioni reali.</td><td className="px-6 py-4 text-center">15</td></tr>
                          <tr><td className="px-6 py-4 font-black text-amber-600 uppercase">Finale</td><td className="px-6 py-4">Oro</td><td className="px-6 py-4">La conclusione obbligatoria del racconto.</td><td className="px-6 py-4 text-center">15</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                  <section className="bg-indigo-950 text-white rounded-[3rem] p-10 md:p-14 shadow-2xl">
                    <h2 className="text-3xl font-black text-white mb-10 uppercase tracking-tighter"><Heart size={32} className="inline-block mr-3 mb-1 text-indigo-400"/> 🏫 Uso Didattico</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
                       <div className="space-y-4">
                          <h5 className="text-indigo-400 font-black uppercase border-b border-white/10 pb-2">Analisi delle scelte</h5>
                          <p className="font-medium leading-relaxed opacity-80 text-justify">Perché è stata giocata la carta "Segnala" invece di "Ignora"? Analizzare le conseguenze digitali.</p>
                       </div>
                       <div className="space-y-4">
                          <h5 className="text-indigo-400 font-black uppercase border-b border-white/10 pb-2">Empatia</h5>
                          <p className="font-medium leading-relaxed opacity-80 text-justify">Come si sentiva il personaggio rappresentato dalla carta "Emozione"? Provare a sentire quello che provano gli altri.</p>
                       </div>
                       <div className="space-y-4">
                          <h5 className="text-indigo-400 font-black uppercase border-b border-white/10 pb-2">Realtà</h5>
                          <p className="font-medium leading-relaxed opacity-80 text-justify">Questa storia potrebbe accadere nella nostra classe? Trasferire l'esperienza alla vita quotidiana.</p>
                       </div>
                    </div>
                  </section>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t py-4 no-print shadow-2xl z-50 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
          <span className="flex items-center gap-2 font-bold">
            <Sparkles size={14} className="text-amber-500"/> Stile: {selectedStyle.name}
          </span>
          <div className="hidden sm:block tracking-normal">© 2026 Education Lab - Rispetto Digitale</div>
        </div>
      </footer>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @media print { 
          .no-print { display: none !important; } 
          body { background: white !important; margin: 0; padding: 0; } 
          #print-area { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 20px !important; } 
          .story-render { padding: 0 !important; color: black !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
