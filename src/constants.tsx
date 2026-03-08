import React from 'react';
import { 
  User, AlertCircle, Zap, Heart, 
  ShieldCheck, Flag
} from 'lucide-react';
import { Category, IllustrationStyle, StoryLength, CardData } from './types';

export const CATEGORIES: Record<string, Category> = {
  PERSONAGGIO: { color: 'bg-blue-50 border-blue-500 text-blue-900', printColor: '#dbeafe', icon: <User size={18}/>, label: 'Personaggio' },
  SITUAZIONE: { color: 'bg-red-50 border-red-500 text-red-900', printColor: '#fee2e2', icon: <AlertCircle size={18}/>, label: 'Situazione' },
  AZIONE: { color: 'bg-green-50 border-green-500 text-green-900', printColor: '#dcfce7', icon: <Zap size={18}/>, label: 'Azione' },
  EMOZIONE: { color: 'bg-yellow-50 border-yellow-500 text-yellow-900', printColor: '#fef9c3', icon: <Heart size={18}/>, label: 'Emozione' },
  AIUTO: { color: 'bg-purple-50 border-purple-500 text-purple-900', printColor: '#f3e8ff', icon: <ShieldCheck size={18}/>, label: 'Aiuto / Soluzione' },
  FINALE: { color: 'bg-amber-50 border-amber-600 text-amber-900 border-dashed', printColor: '#fef3c7', icon: <Flag size={18}/>, label: 'Finale (Segreto)' }
};

export const ILLUSTRATION_STYLES: IllustrationStyle[] = [
  { id: 'standard', name: 'Vettoriale Moderno', category: 'Default', prompt: 'Modern minimalist vector art, clean lines, vibrant colors, approachable for students.' },
  { id: 'pittogramma', name: 'Pittogramma Infanzia', category: 'Icone', prompt: 'Educational pictogram for kindergarten, thick black outlines, flat primary colors, high legibility, white background.' },
  { id: 'sticker', name: 'Icona Sticker', category: 'Icone', prompt: 'Cute rounded sticker icon, thick white border, playful cartoon style, vibrant flat colors.' },
  { id: 'universale', name: 'Simbolo Universale', category: 'Icone', prompt: 'Universal signage symbol, high contrast silhouette, minimalist graphic design.' },
  { id: 'passerella', name: 'Passerella', category: 'Retrò', prompt: '60s and 70s psychedelic aesthetic, bright colors, geometric shapes, kaleidoscopic patterns.' },
  { id: 'cartoon_antico', name: 'Cartone animato antico', category: 'Retrò', prompt: 'Vintage rubber hose animation style, faded colors, thick outlines, 1930s aesthetic.' },
  { id: 'technicolor', name: 'Technicolor', category: 'Retrò', prompt: 'Vivid high-saturation 1950s cinema look, cinematic lighting, Technicolor palette.' },
  { id: 'risograph', name: 'Risograph', category: 'Retrò', prompt: 'Risograph printing style, offset colors, rough ink texture, limited color palette.' },
  { id: 'gotico', name: 'Figurina gotica', category: 'Gotico', prompt: 'Gothic illustration, dark and moody atmosphere, intricate stylised figures.' },
  { id: 'steampunk', name: 'Steampunk', category: 'Fantastico', prompt: 'Retro-futuristic steampunk, brass gears, copper pipes, Victorian industrial aesthetic.' },
  { id: 'romantico', name: 'Ritratto romantico', category: 'Romantico', prompt: 'Romantic portraiture, soft focus, intimate expression, sentimental mood.' }
];

export const STORY_TONES = ['Educativo', 'Realistico', 'Drammatico', 'Epico', 'Fiabesco', 'Ironico', 'Emozionale'];
export const LANGUAGE_STYLES = ['Semplice', 'Complice', 'Formale', 'Inclusivo', 'Poetico'];
export const STORY_LENGTHS: StoryLength[] = [
  { id: 'breve', label: 'Breve', desc: 'Circa 150 parole' },
  { id: 'media', label: 'Media', desc: 'Circa 300 parole' },
  { id: 'lunga', label: 'Lunga', desc: 'Circa 500 parole' }
];

export const REAL_DECK: CardData[] = [
  // PERSONAGGI
  { title: "Lo studente nuovo", desc: "È appena arrivato nella classe e non conosce ancora nessuno.", cat: "PERSONAGGIO" },
  { title: "La vittima", desc: "Riceve messaggi offensivi online o viene esclusa dal gruppo.", cat: "PERSONAGGIO" },
  { title: "Il bullo digitale", desc: "Scrive commenti cattivi, prende in giro o diffonde contenuti offensivi.", cat: "PERSONAGGIO" },
  { title: "Il testimone", desc: "Vede tutto ma non sa se intervenire oppure restare in silenzio.", cat: "PERSONAGGIO" },
  { title: "L’amica che difende", desc: "Interviene per aiutare, confortare o fermare la situazione.", cat: "PERSONAGGIO" },
  { title: "Il compagno che ride", desc: "Mette like, ride o rilancia i contenuti offensivi senza pensarci.", cat: "PERSONAGGIO" },
  { title: "L’insegnante", desc: "Scopre cosa sta succedendo e prova a capire come intervenire.", cat: "PERSONAGGIO" },
  { title: "Il genitore", desc: "Cerca di capire cosa è successo e come proteggere il ragazzo o la ragazza.", cat: "PERSONAGGIO" },
  { title: "Il moderatore della chat", desc: "Controlla le regole del gruppo e può fermare messaggi scorretti.", cat: "PERSONAGGIO" },
  { title: "Il preside", desc: "Interviene quando il problema diventa serio e coinvolge la scuola.", cat: "PERSONAGGIO" },
  { title: "Il gruppo della classe", desc: "Partecipa alla chat, osserva, commenta o prende posizione.", cat: "PERSONAGGIO" },
  { title: "L’amico fidato", desc: "Ascolta la vittima e la incoraggia a parlare con qualcuno.", cat: "PERSONAGGIO" },
  { title: "Il bullo pentito", desc: "Capisce di aver sbagliato e prova a rimediare.", cat: "PERSONAGGIO" },
  { title: "Il compagno indifferente", desc: "Fa finta di non vedere e pensa che non sia un problema suo.", cat: "PERSONAGGIO" },
  { title: "Lo studente esperto di tecnologia", desc: "Sa come salvare prove, segnalare contenuti e proteggere gli account.", cat: "PERSONAGGIO" },
  { title: "Il fratello maggiore", desc: "Dà consigli pratici e prova a calmare la situazione.", cat: "PERSONAGGIO" },
  { title: "L’educatore digitale", desc: "Parla di rispetto online, privacy e uso consapevole dei social.", cat: "PERSONAGGIO" },
  { title: "Il tutor scolastico", desc: "Aiuta a risolvere il conflitto e accompagna il gruppo nella riflessione.", cat: "PERSONAGGIO" },
  { title: "Il gruppo degli amici", desc: "Sostiene la vittima oppure può scegliere di non lasciarla sola.", cat: "PERSONAGGIO" },
  { title: "La comunità scolastica", desc: "Decide di cambiare le cose e costruire un ambiente più sicuro.", cat: "PERSONAGGIO" },

  // SITUAZIONI
  { title: "Un gruppo WhatsApp della classe", desc: "Una chat di classe dove circolano messaggi, immagini e commenti.", cat: "SITUAZIONE" },
  { title: "Un messaggio offensivo", desc: "Un testo cattivo o umiliante inviato a una persona o a un gruppo.", cat: "SITUAZIONE" },
  { title: "Una foto condivisa senza permesso", desc: "Un’immagine privata viene pubblicata o inoltrata senza consenso.", cat: "SITUAZIONE" },
  { title: "Un video imbarazzante", desc: "Un video mette in ridicolo qualcuno e si diffonde rapidamente.", cat: "SITUAZIONE" },
  { title: "Un commento cattivo sui social", desc: "Sotto un post compare un commento offensivo o umiliante.", cat: "SITUAZIONE" },
  { title: "Un profilo falso", desc: "Qualcuno usa un account finto per prendere in giro o ingannare.", cat: "SITUAZIONE" },
  { title: "Uno scherzo online", desc: "Uno scherzo digitale sembra divertente ma ferisce qualcuno.", cat: "SITUAZIONE" },
  { title: "Un meme offensivo", desc: "Un’immagine ironica viene usata per umiliare una persona.", cat: "SITUAZIONE" },
  { title: "Una catena di messaggi", desc: "Un contenuto offensivo viene inoltrato da molte persone.", cat: "SITUAZIONE" },
  { title: "Una presa in giro in chat", desc: "In una conversazione di gruppo qualcuno viene deriso ripetutamente.", cat: "SITUAZIONE" },
  { title: "Un post virale", desc: "Un contenuto si diffonde velocemente e diventa difficile fermarlo.", cat: "SITUAZIONE" },
  { title: "Una storia Instagram", desc: "Una storia pubblicata online espone una persona al giudizio degli altri.", cat: "SITUAZIONE" },
  { title: "Un video su TikTok", desc: "Un video breve può diventare occasione di derisione o supporto.", cat: "SITUAZIONE" },
  { title: "Una chat privata", desc: "I messaggi scambiati in privato possono essere usati per ferire o aiutare.", cat: "SITUAZIONE" },
  { title: "Un gioco online multiplayer", desc: "Durante una partita online partono insulti, esclusioni o provocazioni.", cat: "SITUAZIONE" },
  { title: "Una diretta streaming", desc: "Durante una live compaiono commenti o comportamenti offensivi.", cat: "SITUAZIONE" },
  { title: "Una chat di gaming", desc: "Nel gruppo di gioco qualcuno viene attaccato o escluso.", cat: "SITUAZIONE" },
  { title: "Un commento anonimo", desc: "Un messaggio offensivo arriva senza mostrare chi l’ha scritto.", cat: "SITUAZIONE" },
  { title: "Una foto modificata", desc: "Un’immagine viene alterata per ridicolizzare una persona.", cat: "SITUAZIONE" },
  { title: "Una sfida online", desc: "Una challenge spinge a compiere azioni rischiose o umilianti.", cat: "SITUAZIONE" },
  { title: "Una voce falsa che gira", desc: "Una diceria o una bugia si diffonde velocemente tra i compagni.", cat: "SITUAZIONE" },
  { title: "Un insulto pubblico", desc: "Una persona viene attaccata davanti a molti altri utenti.", cat: "SITUAZIONE" },
  { title: "Una discussione accesa", desc: "Una conversazione degenera e i toni diventano aggressivi.", cat: "SITUAZIONE" },
  { title: "Un gruppo segreto", desc: "Un gruppo nascosto viene creato per escludere o prendere in giro qualcuno.", cat: "SITUAZIONE" },
  { title: "Una pagina di meme della scuola", desc: "Una pagina pubblica contenuti ironici che possono diventare offensivi.", cat: "SITUAZIONE" },

  // AZIONI
  { title: "Rispondere al messaggio", desc: "Qualcuno decide di rispondere, chiarire o reagire subito.", cat: "AZIONE" },
  { title: "Ignorare il messaggio", desc: "Si sceglie di non rispondere, ma il problema potrebbe restare.", cat: "AZIONE" },
  { title: "Bloccare l’utente", desc: "L’account offensivo viene bloccato per fermare i contatti.", cat: "AZIONE" },
  { title: "Segnalare il contenuto", desc: "Il contenuto viene inviato alla piattaforma o a un adulto responsabile.", cat: "AZIONE" },
  { title: "Salvare uno screenshot", desc: "Si conserva una prova utile per spiegare cosa è successo.", cat: "AZIONE" },
  { title: "Difendere un compagno", desc: "Qualcuno prende posizione e dice che quel comportamento non va bene.", cat: "AZIONE" },
  { title: "Ridere del messaggio", desc: "Una reazione superficiale peggiora la situazione e incoraggia il gruppo.", cat: "AZIONE" },
  { title: "Condividere il post", desc: "Il contenuto viene rilanciato e raggiunge ancora più persone.", cat: "AZIONE" },
  { title: "Scrivere un commento gentile", desc: "Una parola positiva può ridurre il danno e dare sostegno.", cat: "AZIONE" },
  { title: "Chiedere spiegazioni", desc: "Si prova a capire cosa è successo e perché.", cat: "AZIONE" },
  { title: "Fare pace", desc: "I protagonisti cercano una soluzione per chiudere il conflitto.", cat: "AZIONE" },
  { title: "Chiedere scusa", desc: "Chi ha ferito qualcuno riconosce il proprio errore.", cat: "AZIONE" },
  { title: "Raccontare tutto a un adulto", desc: "Si coinvolge una persona di fiducia per chiedere aiuto.", cat: "AZIONE" },
  { title: "Uscire dal gruppo", desc: "Si lascia la chat o la community per non alimentare il problema.", cat: "AZIONE" },
  { title: "Aggiungere un amico", desc: "Si coinvolge qualcuno che può dare supporto e non lasciare sola la vittima.", cat: "AZIONE" },
  { title: "Scrivere un messaggio privato", desc: "Un contatto diretto può aiutare a chiarire o sostenere in modo discreto.", cat: "AZIONE" },
  { title: "Fare un post di sostegno", desc: "Si pubblica un messaggio per mostrare vicinanza e contrastare l’isolamento.", cat: "AZIONE" },
  { title: "Chiedere aiuto", desc: "La persona coinvolta o un testimone decide di non affrontare tutto da solo.", cat: "AZIONE" },
  { title: "Organizzare un incontro", desc: "Si decide di parlarne insieme per trovare una soluzione condivisa.", cat: "AZIONE" },
  { title: "Fare una segnalazione", desc: "La situazione viene riferita a chi può intervenire in modo ufficiale.", cat: "AZIONE" },
  { title: "Aprire una discussione", desc: "La classe o il gruppo decide di parlare apertamente del problema.", cat: "AZIONE" },
  { title: "Spiegare perché è sbagliato", desc: "Qualcuno fa notare che quel comportamento non è uno scherzo ma un danno reale.", cat: "AZIONE" },
  { title: "Sostenere la vittima", desc: "Si offre ascolto, protezione e vicinanza concreta.", cat: "AZIONE" },
  { title: "Cancellare il contenuto", desc: "Il post, la foto o il video offensivo viene rimosso.", cat: "AZIONE" },
  { title: "Fare una promessa", desc: "Il gruppo decide di cambiare comportamento per il futuro.", cat: "AZIONE" },

  // EMOZIONI
  { title: "Tristezza", desc: "Qualcuno si sente ferito, giù di morale e poco compreso.", cat: "EMOZIONE" },
  { title: "Vergogna", desc: "La persona colpita ha paura del giudizio degli altri.", cat: "EMOZIONE" },
  { title: "Paura", desc: "Si teme che la situazione peggiori o che tutti vengano a sapere tutto.", cat: "EMOZIONE" },
  { title: "Rabbia", desc: "La frustrazione o il dolore si trasformano in reazione intensa.", cat: "EMOZIONE" },
  { title: "Solitudine", desc: "La vittima sente di non avere nessuno accanto.", cat: "EMOZIONE" },
  { title: "Confusione", desc: "Non si capisce bene cosa fare o come interpretare quello che succede.", cat: "EMOZIONE" },
  { title: "Coraggio", desc: "Qualcuno trova la forza di parlare, difendere o chiedere aiuto.", cat: "EMOZIONE" },
  { title: "Amicizia", desc: "La relazione positiva diventa una risorsa per proteggere e sostenere.", cat: "EMOZIONE" },
  { title: "Sollievo", desc: "Dopo l’aiuto o la soluzione, la tensione si allenta.", cat: "EMOZIONE" },
  { title: "Fiducia", desc: "Si decide di aprirsi a qualcuno perché lo si considera sicuro.", cat: "EMOZIONE" },
  { title: "Sorpresa", desc: "Un evento inatteso cambia la storia o il comportamento dei personaggi.", cat: "EMOZIONE" },
  { title: "Dispiacere", desc: "Qualcuno prova dolore per ciò che è accaduto a un compagno.", cat: "EMOZIONE" },
  { title: "Rimorso", desc: "Chi ha sbagliato inizia a capire il danno che ha provocato.", cat: "EMOZIONE" },
  { title: "Gioia", desc: "La situazione migliora e torna un clima positivo.", cat: "EMOZIONE" },
  { title: "Speranza", desc: "Si intravede la possibilità che le cose possano cambiare.", cat: "EMOZIONE" },
  { title: "Solidarietà", desc: "Più persone scelgono di stare dalla parte di chi soffre.", cat: "EMOZIONE" },
  { title: "Imbarazzo", desc: "La persona si sente esposta e a disagio davanti agli altri.", cat: "EMOZIONE" },
  { title: "Orgoglio", desc: "Qualcuno si sente fiero di aver fatto la cosa giusta.", cat: "EMOZIONE" },
  { title: "Gentilezza", desc: "Un piccolo gesto positivo cambia il tono della storia.", cat: "EMOZIONE" },
  { title: "Rispetto", desc: "Le persone riconoscono il valore dell’altro e dei suoi confini.", cat: "EMOZIONE" },

  // AIUTO / SOLUZIONE
  { title: "Parlare con un insegnante", desc: "Un adulto della scuola può ascoltare, proteggere e intervenire.", cat: "AIUTO" },
  { title: "Chiedere aiuto ai genitori", desc: "La famiglia può offrire ascolto, protezione e orientamento.", cat: "AIUTO" },
  { title: "Segnalare alla piattaforma", desc: "Usare gli strumenti del social o della app per fermare il contenuto.", cat: "AIUTO" },
  { title: "Difendere pubblicamente la vittima", desc: "Prendere posizione davanti agli altri può spezzare il consenso del gruppo.", cat: "AIUTO" },
  { title: "Scrivere un messaggio di sostegno", desc: "Un messaggio privato o pubblico può far sentire meno sola la vittima.", cat: "AIUTO" },
  { title: "Creare regole nel gruppo", desc: "La chat o la community definisce comportamenti chiari e rispettosi.", cat: "AIUTO" },
  { title: "Organizzare un incontro a scuola", desc: "Parlare insieme aiuta a comprendere, prevenire e riparare.", cat: "AIUTO" },
  { title: "Fare educazione digitale", desc: "Imparare a usare bene gli strumenti online riduce i rischi.", cat: "AIUTO" },
  { title: "Creare un patto di classe", desc: "La classe stabilisce impegni condivisi per il rispetto online.", cat: "AIUTO" },
  { title: "Intervenire come testimone", desc: "Chi vede non resta in silenzio ma sceglie di agire.", cat: "AIUTO" },
  { title: "Aiutare la vittima", desc: "Si offre ascolto, protezione e accompagnamento concreto.", cat: "AIUTO" },
  { title: "Spiegare le conseguenze", desc: "Capire l’impatto delle azioni aiuta a cambiare comportamento.", cat: "AIUTO" },
  { title: "Fare una campagna online", desc: "Il gruppo trasforma l’esperienza in un messaggio positivo per tutti.", cat: "AIUTO" },
  { title: "Promuovere il rispetto", desc: "Si diffondono comportamenti, parole e regole per stare bene insieme.", cat: "AIUTO" },
  { title: "Ricostruire la fiducia", desc: "Dopo il danno, il gruppo prova a riparare le relazioni.", cat: "AIUTO" },

  // FINALE
  { title: "La classe impara il rispetto online", desc: "La storia si chiude con una crescita collettiva e più consapevolezza.", cat: "FINALE" },
  { title: "Il bullo capisce l’errore", desc: "Chi ha sbagliato comprende il danno fatto e cambia atteggiamento.", cat: "FINALE" },
  { title: "La vittima ritrova fiducia", desc: "La persona colpita si sente di nuovo ascoltata, protetta e forte.", cat: "FINALE" },
  { title: "Gli amici diventano più uniti", desc: "Il gruppo si compatta e decide di non lasciare indietro nessuno.", cat: "FINALE" },
  { title: "Nasce una campagna contro il cyberbullismo", desc: "L’esperienza diventa occasione per sensibilizzare altri studenti.", cat: "FINALE" },
  { title: "La scuola crea nuove regole digitali", desc: "Dalla storia nasce un insieme di regole condivise per stare meglio online.", cat: "FINALE" },
  { title: "La classe firma un patto online", desc: "Tutti si impegnano a rispettare parole, immagini e persone.", cat: "FINALE" },
  { title: "Tutti imparano a segnalare i contenuti", desc: "La classe acquisisce strumenti concreti per agire in modo corretto.", cat: "FINALE" },
  { title: "Il gruppo diventa un luogo sicuro", desc: "La chat o la community cambia tono e diventa più rispettosa.", cat: "FINALE" },
  { title: "La vittima diventa più forte", desc: "Con il sostegno giusto, la persona trova risorse e voce.", cat: "FINALE" },
  { title: "Gli studenti aiutano altri compagni", desc: "L’esperienza vissuta diventa aiuto concreto per chi verrà dopo.", cat: "FINALE" },
  { title: "Il bullo chiede scusa", desc: "Le scuse sincere aprono la strada a una possibile riparazione.", cat: "FINALE" },
  { title: "Nasce un progetto sul rispetto digitale", desc: "La storia ispira un’attività educativa che coinvolge tutta la scuola.", cat: "FINALE" },
  { title: "La classe crea un manifesto", desc: "Le regole e i valori emersi vengono trasformati in un documento condiviso.", cat: "FINALE" },
  { title: "Internet diventa un posto migliore", desc: "Il finale mostra un cambiamento positivo che parte dalle scelte dei ragazzi.", cat: "FINALE" }
];
