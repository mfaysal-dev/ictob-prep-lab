import { useEffect, useMemo, useState } from 'react'
import {
  Atom, BarChart3, Bot, Briefcase, Check, ChevronRight, Clock, Code, Cpu, FlaskConical, Glasses, House, Languages, Leaf,
  Lightbulb, Network, RotateCcw, Rocket, ShieldCheck, ShoppingCart, Sparkles, Target, Timer, Trophy, Wifi, X, Zap,
} from 'lucide-react'
import { questions, segments, type Q, type T } from './data/questions'
import { num, shuffle, tr, useStored, type Lang, type MockRun, type Stats } from './lib'
import Labs from './Labs'

type Tab = 'home' | 'practice' | 'mock' | 'labs' | 'progress'
const segIcon: Record<string, typeof Cpu> = { Lightbulb, Cpu, Network, Code, ShieldCheck, ShoppingCart, Leaf, Wifi, Sparkles, Bot, Glasses, Atom, Rocket, Briefcase }
const segName = (id: string) => segments.find((s) => s.id === id)!.name

export default function App() {
  const [lang, setLang] = useStored<Lang>('ob.lang', 'bn')
  const [tab, setTab] = useState<Tab>('home')
  const [stats, setStats] = useStored<Stats>('ob.stats', {})
  const [runs, setRuns] = useStored<MockRun[]>('ob.runs', [])
  const [practiceSeg, setPracticeSeg] = useState<string | null>(null)
  const L = (o: T) => tr(o, lang)
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [tab])

  const record = (q: Q, ok: boolean) => setStats((s) => { const p = s[q.id] ?? { c: 0, w: 0, last: false }; return { ...s, [q.id]: { c: p.c + (ok ? 1 : 0), w: p.w + (ok ? 0 : 1), last: ok } } })

  const tabs: { id: Tab; icon: typeof House; t: T }[] = [
    { id: 'home', icon: House, t: { bn: 'হোম', en: 'Home' } },
    { id: 'practice', icon: Target, t: { bn: 'অনুশীলন', en: 'Practice' } },
    { id: 'mock', icon: Timer, t: { bn: 'মক টেস্ট', en: 'Mock test' } },
    { id: 'labs', icon: FlaskConical, t: { bn: 'ল্যাব', en: 'Labs' } },
    { id: 'progress', icon: BarChart3, t: { bn: 'অগ্রগতি', en: 'Progress' } },
  ]
  const startPractice = (seg: string | null) => { setPracticeSeg(seg); setTab('practice') }

  return (
    <div className="min-h-dvh pb-24 text-slate-800 sm:pb-8">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-indigo-700 to-violet-700 text-white shadow-md">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <img src="/favicon.svg" alt="" className="h-9 w-9 rounded-xl" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight">ICTOB Prep Lab</h1>
            <p className="truncate text-xs text-indigo-100">{L({ bn: 'আইসিটি অলিম্পিয়াড বাংলাদেশ প্রস্তুতি — ফ্রি ও অফলাইন', en: 'ICT Olympiad Bangladesh prep — free & offline' })}</p>
          </div>
          <nav className="hidden gap-1 sm:flex">
            {tabs.map((x) => <button key={x.id} onClick={() => setTab(x.id)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${tab === x.id ? 'bg-white text-indigo-700' : 'text-indigo-100 hover:bg-white/10'}`}>{L(x.t)}</button>)}
          </nav>
          <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} aria-label="Switch language" className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-indigo-800 shadow"><Languages size={16} /> {lang === 'bn' ? 'EN' : 'বাংলা'}</button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 pt-5">
        {tab === 'home' && <Home lang={lang} stats={stats} runs={runs} go={setTab} startPractice={startPractice} />}
        {tab === 'practice' && <Practice key={practiceSeg ?? 'all'} lang={lang} seg={practiceSeg} setSeg={setPracticeSeg} stats={stats} record={record} />}
        {tab === 'mock' && <Mock lang={lang} record={record} onDone={(r) => setRuns((x) => [r, ...x].slice(0, 20))} />}
        {tab === 'labs' && <Labs lang={lang} />}
        {tab === 'progress' && <Progress lang={lang} stats={stats} runs={runs} reset={() => { setStats({}); setRuns([]) }} startPractice={startPractice} />}
        <footer className="mt-10 pb-4 text-center text-xs text-slate-500">
          {lang === 'bn' ? 'তৈরি করেছেন' : 'Built by'} <a className="font-semibold text-indigo-700" href="https://mfaysal.com">Mahir Faysal</a> · <a className="underline" href="https://github.com/mfaysal-dev/ictob-prep-lab">GitHub</a><br />
          {L({ bn: 'স্বাধীন শিক্ষামূলক প্রকল্প — ICT Olympiad Bangladesh-এর অফিসিয়াল অ্যাপ নয়।', en: 'Independent educational project — not an official ICT Olympiad Bangladesh app.' })}
        </footer>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="grid grid-cols-5">
          {tabs.map(({ id, icon: Icon, t }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${tab === id ? 'text-indigo-700' : 'text-slate-500'}`}>
              <span className={`rounded-full px-4 py-1 ${tab === id ? 'bg-indigo-100' : ''}`}><Icon size={20} /></span>{L(t)}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

type Base = { lang: Lang }
const accuracy = (stats: Stats, seg?: string) => {
  let c = 0, w = 0
  for (const q of questions) { if (seg && q.seg !== seg) continue; const s = stats[q.id]; if (s) { c += s.c; w += s.w } }
  return { c, w, pct: c + w ? Math.round((c / (c + w)) * 100) : 0, seen: questions.filter((q) => (!seg || q.seg === seg) && stats[q.id]).length }
}

function Home({ lang, stats, runs, go, startPractice }: Base & { stats: Stats; runs: MockRun[]; go: (t: Tab) => void; startPractice: (s: string | null) => void }) {
  const L = (o: T) => tr(o, lang), N = (v: number | string) => num(v, lang)
  const a = accuracy(stats)
  const best = runs.length ? Math.max(...runs.map((r) => Math.round((r.score / r.total) * 100))) : 0
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-lg shadow-indigo-200">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-100">ICT Olympiad Bangladesh · {L({ bn: 'প্রযুক্তির সাথে ক্ষমতায়ন', en: 'Empowerment with Technology' })}</p>
        <h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">{L({ bn: 'মুখস্থ নয়, বুঝে শিখুন — অলিম্পিয়াডের জন্য প্রস্তুত হোন', en: 'Understand, don’t memorise — get Olympiad ready' })}</h2>
        <p className="mt-2 text-sm text-indigo-100">{L({ bn: `${N(segments.length)}টি সেগমেন্টে ${N(questions.length)}টি দ্বিভাষিক প্রশ্ন, অফিসিয়াল ফরম্যাটের মক টেস্ট (নেগেটিভ মার্কিং নেই, পাস ৪০%) এবং ৪টি ইন্টারেক্টিভ ল্যাব।`, en: `${questions.length} bilingual questions across ${segments.length} segments, mock tests in the official format (no negative marking, 40% pass) and 4 interactive labs.` })}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => go('mock')} className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-semibold text-indigo-700 shadow"><Timer size={18} /> {L({ bn: 'মক টেস্ট দিন', en: 'Take a mock test' })}</button>
          <button onClick={() => startPractice(null)} className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 font-semibold ring-1 ring-white/40"><Zap size={18} /> {L({ bn: 'দ্রুত অনুশীলন', en: 'Quick practice' })}</button>
        </div>
      </section>
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { v: `${N(a.seen)}/${N(questions.length)}`, t: { bn: 'প্রশ্ন চর্চা', en: 'Questions seen' }, c: 'text-indigo-700' },
          { v: `${N(a.pct)}%`, t: { bn: 'সঠিকতা', en: 'Accuracy' }, c: 'text-emerald-600' },
          { v: `${N(best)}%`, t: { bn: 'সেরা মক স্কোর', en: 'Best mock' }, c: 'text-fuchsia-600' },
        ].map((x) => <div key={x.t.en} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className={`text-xl font-bold ${x.c}`}>{x.v}</p><p className="text-xs text-slate-500">{L(x.t)}</p></div>)}
      </div>
      <section>
        <h3 className="mb-2 font-bold">{L({ bn: 'সেগমেন্ট বেছে অনুশীলন করুন', en: 'Practise by segment' })}</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {segments.map((s) => {
            const I = segIcon[s.icon], sa = accuracy(stats, s.id), total = questions.filter((q) => q.seg === s.id).length
            return (
              <button key={s.id} onClick={() => startPractice(s.id)} className="flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-100 transition hover:ring-indigo-200 active:scale-[.99]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><I size={20} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{L(s.name)}</span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-indigo-500" style={{ width: `${(sa.seen / total) * 100}%` }} /></span>
                </span>
                <span className="text-xs text-slate-500">{N(sa.seen)}/{N(total)}</span>
                <ChevronRight size={18} className="text-slate-400" />
              </button>
            )
          })}
        </div>
      </section>
      <button onClick={() => go('labs')} className="flex w-full items-center gap-4 rounded-3xl bg-slate-900 p-5 text-left text-white">
        <FlaskConical size={32} className="text-emerald-300" />
        <span className="flex-1"><span className="block font-bold">{L({ bn: 'ইন্টারেক্টিভ ল্যাব', en: 'Interactive labs' })}</span><span className="text-sm text-slate-300">{L({ bn: 'নাম্বার সিস্টেম · লজিক গেট · সর্টিং ভিজুয়ালাইজার · বাইনারি সার্চ · সাইফার', en: 'Number systems · Logic gates · Sorting visualiser · Binary search · Ciphers' })}</span></span>
        <ChevronRight />
      </button>
    </div>
  )
}

function QuestionCard({ lang, q, order, picked, onPick, reveal }: Base & { q: Q; order: number[]; picked: number | null; onPick: (i: number) => void; reveal: boolean }) {
  const L = (o: T) => tr(o, lang)
  const letters = lang === 'bn' ? ['ক', 'খ', 'গ', 'ঘ'] : ['A', 'B', 'C', 'D']
  return (
    <div className="pop space-y-3">
      <p className="text-lg font-semibold leading-relaxed">{L(q.q)}</p>
      <div className="space-y-2">
        {order.map((oi, k) => {
          const isA = oi === q.a, isP = picked === oi
          const cls = reveal ? (isA ? 'bg-emerald-50 ring-2 ring-emerald-500' : isP ? 'bg-rose-50 ring-2 ring-rose-400' : 'bg-white ring-1 ring-slate-200 opacity-70') : isP ? 'bg-indigo-50 ring-2 ring-indigo-500' : 'bg-white ring-1 ring-slate-200 hover:ring-indigo-300'
          return (
            <button key={oi} disabled={reveal} onClick={() => onPick(oi)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${cls}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${reveal && isA ? 'bg-emerald-500 text-white' : reveal && isP ? 'bg-rose-500 text-white' : 'bg-slate-100'}`}>{reveal && isA ? <Check size={16} /> : reveal && isP ? <X size={16} /> : letters[k]}</span>
              <span>{L(q.o[oi])}</span>
            </button>
          )
        })}
      </div>
      {reveal && <p className={`pop rounded-2xl p-3 text-sm ${picked === q.a ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}><b>{picked === q.a ? L({ bn: 'সঠিক! ', en: 'Correct! ' }) : L({ bn: 'ব্যাখ্যা: ', en: 'Explanation: ' })}</b>{L(q.ex)}</p>}
    </div>
  )
}

function Practice({ lang, seg, setSeg, stats, record }: Base & { seg: string | null; setSeg: (s: string | null) => void; stats: Stats; record: (q: Q, ok: boolean) => void }) {
  const L = (o: T) => tr(o, lang), N = (v: number | string) => num(v, lang)
  const [mode, setMode] = useState<'seg' | 'mistakes'>('seg')
  const pool = useMemo(() => {
    const base = mode === 'mistakes' ? questions.filter((q) => stats[q.id] && !stats[q.id].last) : questions.filter((q) => !seg || q.seg === seg)
    return shuffle(base).map((q) => ({ q, order: shuffle([0, 1, 2, 3]) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seg, mode])
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  useEffect(() => { setI(0); setPicked(null); setScore(0); setStreak(0) }, [pool])
  const cur = pool[i]
  const pick = (oi: number) => { if (picked !== null) return; setPicked(oi); const ok = oi === cur.q.a; record(cur.q, ok); if (ok) { setScore((s) => s + 1); setStreak((s) => s + 1) } else setStreak(0) }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="Segment" value={mode === 'mistakes' ? '__m' : seg ?? ''} onChange={(e) => { if (e.target.value === '__m') setMode('mistakes'); else { setMode('seg'); setSeg(e.target.value || null) } }} className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm">
          <option value="">{L({ bn: 'সব সেগমেন্ট (মিশ্র)', en: 'All segments (mixed)' })}</option>
          {segments.map((s) => <option key={s.id} value={s.id}>{L(s.name)}</option>)}
          <option value="__m">{L({ bn: '🔁 আমার ভুলগুলো আবার', en: '🔁 Retry my mistakes' })}</option>
        </select>
        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-800">🔥 {N(streak)}</span>
        <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-800">✓ {N(score)}</span>
      </div>
      {!cur ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
          <Trophy size={44} className="mx-auto text-amber-500" />
          <p className="mt-2 text-lg font-bold">{pool.length ? L({ bn: 'সেট শেষ!', en: 'Set complete!' }) : L({ bn: 'এখানে কোনো প্রশ্ন নেই — দারুণ, কোনো ভুল বাকি নেই!', en: 'Nothing here — great, no mistakes left!' })}</p>
          {pool.length > 0 && <p className="text-slate-600">{N(score)}/{N(pool.length)} {L({ bn: 'সঠিক', en: 'correct' })}</p>}
          <button onClick={() => { setMode('seg'); setSeg(null) }} className="mt-4 rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white">{L({ bn: 'আবার শুরু', en: 'Start again' })}</button>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">{L(segName(cur.q.seg))}</span>
            <span>{N(i + 1)} / {N(pool.length)}</span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-indigo-500 transition-all" style={{ width: `${((i + 1) / pool.length) * 100}%` }} /></div>
          <QuestionCard key={cur.q.id} lang={lang} q={cur.q} order={cur.order} picked={picked} onPick={pick} reveal={picked !== null} />
          {picked !== null && <button onClick={() => { setI(i + 1); setPicked(null) }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 font-semibold text-white">{L({ bn: 'পরের প্রশ্ন', en: 'Next question' })} <ChevronRight size={18} /></button>}
        </div>
      )}
    </div>
  )
}

function Mock({ lang, record, onDone }: Base & { record: (q: Q, ok: boolean) => void; onDone: (r: MockRun) => void }) {
  const L = (o: T) => tr(o, lang), N = (v: number | string) => num(v, lang)
  const [count, setCount] = useState(20)
  const [phase, setPhase] = useState<'setup' | 'run' | 'done'>('setup')
  const [set, setSet] = useState<{ q: Q; order: number[] }[]>([])
  const [ans, setAns] = useState<Record<number, number>>({})
  const [i, setI] = useState(0)
  const [left, setLeft] = useState(0)
  const [used, setUsed] = useState(0)
  const total = count * 45
  const start = () => {
    // balanced pick: spread questions across segments
    const bySeg = segments.map((s) => shuffle(questions.filter((q) => q.seg === s.id)))
    const picked: Q[] = []
    for (let r = 0; picked.length < count; r++) for (const list of shuffle(bySeg)) { if (list[r] && picked.length < count) picked.push(list[r]) }
    setSet(shuffle(picked).map((q) => ({ q, order: shuffle([0, 1, 2, 3]) })))
    setAns({}); setI(0); setLeft(total); setPhase('run')
  }
  const submit = () => {
    const score = set.filter((x, k) => ans[k] === x.q.a).length
    set.forEach((x, k) => record(x.q, ans[k] === x.q.a))
    setUsed(total - left)
    onDone({ at: Date.now(), score, total: set.length, secs: total - left })
    setPhase('done')
  }
  useEffect(() => {
    if (phase !== 'run') return
    if (left <= 0) { submit(); return }
    const t = setTimeout(() => setLeft((x) => x - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, left])
  const mmss = (s: number) => `${N(String(Math.floor(s / 60)).padStart(2, '0'))}:${N(String(s % 60).padStart(2, '0'))}`

  if (phase === 'setup') return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <Timer size={40} className="text-indigo-600" />
        <h2 className="mt-2 text-xl font-bold">{L({ bn: 'মক টেস্ট — সিলেকশন রাউন্ডের মতো', en: 'Mock test — like the selection round' })}</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
          <li>✓ {L({ bn: 'MCQ, স্বয়ংক্রিয় মূল্যায়ন', en: 'MCQ, auto-graded' })}</li>
          <li>✓ {L({ bn: 'নেগেটিভ মার্কিং নেই', en: 'No negative marking' })}</li>
          <li>✓ {L({ bn: 'পাস নম্বর ৪০% (অফিসিয়াল FAQ অনুযায়ী)', en: 'Pass mark 40% (per the official FAQ)' })}</li>
          <li>✓ {L({ bn: 'সব সেগমেন্ট থেকে সমানভাবে প্রশ্ন; প্রশ্নপ্রতি ৪৫ সেকেন্ড', en: 'Balanced across all segments; 45 seconds per question' })}</li>
        </ul>
        <div className="mt-4 flex gap-2">
          {[10, 20, 30].map((c) => <button key={c} onClick={() => setCount(c)} className={`flex-1 rounded-2xl py-3 font-bold ${count === c ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{N(c)}<span className="block text-xs font-normal">{mmss(c * 45)}</span></button>)}
        </div>
        <button onClick={start} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-lg font-bold text-white shadow-lg shadow-indigo-200">{L({ bn: 'শুরু করুন', en: 'Start' })}</button>
      </div>
    </div>
  )

  if (phase === 'done') {
    const score = set.filter((x, k) => ans[k] === x.q.a).length
    const pct = Math.round((score / set.length) * 100)
    const pass = pct >= 40
    const segRes = segments.map((s) => { const xs = set.map((x, k) => ({ x, k })).filter(({ x }) => x.q.seg === s.id); return { s, n: xs.length, c: xs.filter(({ x, k }) => ans[k] === x.q.a).length } }).filter((r) => r.n)
    return (
      <div className="space-y-4">
        <div className={`pop rounded-3xl p-6 text-center text-white shadow-lg ${pass ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-rose-500 to-orange-500'}`}>
          <Trophy size={44} className="mx-auto" />
          <p className="mt-2 text-5xl font-bold">{N(pct)}%</p>
          <p className="text-lg font-semibold">{N(score)}/{N(set.length)} · {pass ? L({ bn: 'উত্তীর্ণ! 🎉', en: 'Passed! 🎉' }) : L({ bn: 'আরও অনুশীলন দরকার', en: 'Needs more practice' })}</p>
          <p className="text-sm opacity-90"><Clock size={14} className="inline" /> {mmss(used)}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="mb-3 font-bold">{L({ bn: 'সেগমেন্ট অনুযায়ী ফলাফল', en: 'Result by segment' })}</p>
          <div className="space-y-2">{segRes.map((r) => <Bar key={r.s.id} label={L(r.s.name)} pct={Math.round((r.c / r.n) * 100)} right={`${N(r.c)}/${N(r.n)}`} />)}</div>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="mb-3 font-bold">{L({ bn: 'উত্তর পর্যালোচনা', en: 'Review answers' })}</p>
          <div className="space-y-6">{set.map((x, k) => <QuestionCard key={k} lang={lang} q={x.q} order={x.order} picked={ans[k] ?? null} onPick={() => {}} reveal />)}</div>
        </div>
        <button onClick={() => setPhase('setup')} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 font-semibold text-white"><RotateCcw size={18} /> {L({ bn: 'আরেকটি মক টেস্ট', en: 'Another mock test' })}</button>
      </div>
    )
  }

  const cur = set[i]
  return (
    <div className="space-y-4">
      <div className="sticky top-[60px] z-20 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-sm ring-1 ring-slate-100 backdrop-blur">
        <span className={`flex items-center gap-1 rounded-full px-3 py-1.5 font-mono font-bold ${left < 60 ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}><Clock size={16} /> {mmss(left)}</span>
        <span className="text-sm text-slate-500">{N(Object.keys(ans).length)}/{N(set.length)} {L({ bn: 'উত্তর দেওয়া', en: 'answered' })}</span>
        <button onClick={submit} className="ml-auto rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white">{L({ bn: 'জমা দিন', en: 'Submit' })}</button>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="mb-3 text-xs font-semibold text-slate-500">{L({ bn: 'প্রশ্ন', en: 'Question' })} {N(i + 1)} · {L(segName(cur.q.seg))}</p>
        <QuestionCard key={i} lang={lang} q={cur.q} order={cur.order} picked={ans[i] ?? null} onPick={(oi) => setAns({ ...ans, [i]: oi })} reveal={false} />
        <div className="mt-4 flex gap-2">
          <button disabled={i === 0} onClick={() => setI(i - 1)} className="flex-1 rounded-2xl bg-slate-100 py-3 font-semibold disabled:opacity-40">{L({ bn: 'আগের', en: 'Previous' })}</button>
          {i < set.length - 1 ? <button onClick={() => setI(i + 1)} className="flex-1 rounded-2xl bg-indigo-600 py-3 font-semibold text-white">{L({ bn: 'পরের', en: 'Next' })}</button> : <button onClick={submit} className="flex-1 rounded-2xl bg-emerald-600 py-3 font-semibold text-white">{L({ bn: 'জমা দিন', en: 'Submit' })}</button>}
        </div>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {set.map((_, k) => <button key={k} onClick={() => setI(k)} className={`aspect-square rounded-lg text-xs font-bold ${k === i ? 'bg-indigo-600 text-white' : ans[k] !== undefined ? 'bg-indigo-100 text-indigo-800' : 'bg-white ring-1 ring-slate-200'}`}>{N(k + 1)}</button>)}
      </div>
    </div>
  )
}

function Bar({ label, pct, right }: { label: string; pct: number; right: string }) {
  const c = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-400' : 'bg-rose-500'
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span className="truncate">{label}</span><span className="font-semibold text-slate-600">{right}</span></div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${c} transition-all`} style={{ width: `${Math.max(pct, 2)}%` }} /></div>
    </div>
  )
}

function Progress({ lang, stats, runs, reset, startPractice }: Base & { stats: Stats; runs: MockRun[]; reset: () => void; startPractice: (s: string) => void }) {
  const L = (o: T) => tr(o, lang), N = (v: number | string) => num(v, lang)
  const rows = segments.map((s) => ({ s, a: accuracy(stats, s.id) }))
  const weak = rows.filter((r) => r.a.c + r.a.w > 0).sort((x, y) => x.a.pct - y.a.pct).slice(0, 3)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{L({ bn: 'আমার অগ্রগতি', en: 'My progress' })}</h2>
      {weak.length > 0 && (
        <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-100">
          <p className="font-bold text-amber-900">{L({ bn: '🎯 দুর্বল জায়গা — এগুলো আগে চর্চা করুন', en: '🎯 Weak spots — practise these first' })}</p>
          <div className="mt-2 flex flex-wrap gap-2">{weak.map((r) => <button key={r.s.id} onClick={() => startPractice(r.s.id)} className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">{L(r.s.name)} · {N(r.a.pct)}%</button>)}</div>
        </div>
      )}
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        {rows.map((r) => <Bar key={r.s.id} label={L(r.s.name)} pct={r.a.pct} right={r.a.c + r.a.w ? `${N(r.a.pct)}%` : '—'} />)}
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="mb-2 font-bold">{L({ bn: 'মক টেস্টের ইতিহাস', en: 'Mock test history' })}</p>
        {runs.length === 0 ? <p className="text-sm text-slate-500">{L({ bn: 'এখনও কোনো মক টেস্ট দেননি।', en: 'No mock tests yet.' })}</p> : (
          <ul className="divide-y divide-slate-100 text-sm">{runs.map((r) => { const p = Math.round((r.score / r.total) * 100); return <li key={r.at} className="flex justify-between py-2"><span>{new Date(r.at).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span><b className={p >= 40 ? 'text-emerald-600' : 'text-rose-600'}>{N(r.score)}/{N(r.total)} · {N(p)}%</b></li> })}</ul>
        )}
      </div>
      <button onClick={() => { if (confirm(L({ bn: 'সব অগ্রগতি মুছে ফেলবেন?', en: 'Reset all progress?' }))) reset() }} className="text-sm font-semibold text-rose-600">{L({ bn: 'অগ্রগতি রিসেট', en: 'Reset progress' })}</button>
    </div>
  )
}
