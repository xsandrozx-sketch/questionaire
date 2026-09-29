import React, {useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createClient} from '@supabase/supabase-js';
import {RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip} from 'recharts';
import questions from './data/questions.json';
import './styles.css';

type Question={id:number;category:string;subcategory:string;text:string};
const qs=questions as Question[];
const categories=['CULTURA','MINDSET','LEADERSHIP','AMBIENTE','RISORSE','PROCESSI','BRAND'];
const labels={CULTURA:'Cultura',MINDSET:'Mindset',LEADERSHIP:'Leadership',AMBIENTE:'Ambiente',RISORSE:'Risorse',PROCESSI:'Processi',BRAND:'Brand & Posizionamento'} as Record<string,string>;
const supabase=(import.meta.env.VITE_SUPABASE_URL&&import.meta.env.VITE_SUPABASE_ANON_KEY)?createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY):null;

function App(){
 const [step,setStep]=useState(0); const [answers,setAnswers]=useState<Record<number,number>>({}); const [name,setName]=useState(''); const [company,setCompany]=useState(''); const [email,setEmail]=useState(''); const [saving,setSaving]=useState(false); const [saved,setSaved]=useState(false); const [error,setError]=useState('');
 const totalSteps=categories.length; const currentCategory=categories[step]; const current=qs.filter(q=>q.category===currentCategory);
 const complete=qs.every(q=>answers[q.id]);
 const scores=useMemo(()=>Object.fromEntries(categories.map(c=>{const a=qs.filter(q=>q.category===c).map(q=>answers[q.id]).filter(Boolean) as number[]; return [c,a.length?a.reduce((x,y)=>x+y,0)/a.length:0]})),[answers]);
 const radar=categories.map(c=>({subject:labels[c],score:Number(scores[c].toFixed(2)),fullMark:5}));
 const progress=Math.round(Object.keys(answers).length/qs.length*100);
 const select=(id:number,v:number)=>setAnswers(a=>({...a,[id]:v}));
 const submit=async()=>{setError(''); if(!complete){setError('Completa tutte le domande prima di inviare il questionario.');return} if(!supabase){setError('Supabase non è ancora configurato.');return} setSaving(true); const {error:e}=await supabase.from('assessments').insert({respondent_name:name||null,company:company||null,email:email||null,answers,scores,overall_score:Number((Object.values(scores).reduce((a:number,b:any)=>a+b,0)/categories.length).toFixed(2))}); setSaving(false); if(e){setError(e.message);return} setSaved(true)};
 if(saved)return <main className="shell"><section className="card success"><div className="badge">✓</div><h1>Assessment completato</h1><p>Le risposte sono state registrate correttamente.</p><div className="resultGrid">{radar.map(r=><div key={r.subject}><strong>{r.subject}</strong><span>{r.score.toFixed(2)} / 5</span></div>)}</div><div className="chart"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radar}><PolarGrid/><PolarAngleAxis dataKey="subject"/><PolarRadiusAxis domain={[0,5]}/><Radar dataKey="score" fill="currentColor" fillOpacity={.22} stroke="currentColor"/><Tooltip/></RadarChart></ResponsiveContainer></div></section></main>;
 return <main className="shell"><header><div><div className="eyebrow">INNOVATION ASSESSMENT</div><h1>Innovation Radar</h1><p>Valuta la capacità della tua organizzazione di gestire e sviluppare l'innovazione.</p></div><div className="progress"><b>{progress}%</b><div><i style={{width:`${progress}%`}}/></div></div></header>
 <section className="card"><div className="steps">{categories.map((c,i)=><button key={c} className={i===step?'active':i<step?'done':''} onClick={()=>i<=step&&setStep(i)}>{i+1}</button>)}</div>
 {step===0&&<div className="identity"><h2>Prima di iniziare</h2><p>Questi dati sono opzionali e servono a identificare l'assessment.</p><div className="fields"><input placeholder="Nome e cognome" value={name} onChange={e=>setName(e.target.value)}/><input placeholder="Azienda" value={company} onChange={e=>setCompany(e.target.value)}/><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/></div></div>}
 <div className="sectionTitle"><span>AREA {step+1} DI {totalSteps}</span><h2>{labels[currentCategory]}</h2><p>Indica quanto la situazione descritta corrisponde alla tua organizzazione.</p></div>
 <div className="questions">{current.map(q=><article className="question" key={q.id}><div className="qmeta">{q.subcategory||'Dimensione'} · {q.id}</div><h3>{q.text}</h3><div className="scale">{[1,2,3,4,5].map(v=><button key={v} className={answers[q.id]===v?'selected':''} onClick={()=>select(q.id,v)}><b>{v}</b><small>{['Per nulla','Poco','Parzialmente','Molto','Completamente'][v-1]}</small></button>)}</div></article>)}</div>
 {error&&<div className="error">{error}</div>}
 <footer><button className="secondary" disabled={step===0} onClick={()=>setStep(step-1)}>Indietro</button>{step<totalSteps-1?<button className="primary" onClick={()=>setStep(step+1)}>{step===0?'Inizia':'Continua'}</button>:<button className="primary" onClick={submit} disabled={saving}>{saving?'Salvataggio…':'Completa assessment'}</button>}</footer>
 </section></main>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);