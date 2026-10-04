import { useEffect, useMemo, useRef, useState } from 'react'
import { Binary, CircuitBoard, KeyRound, Pause, Play, RotateCcw, Search, Shuffle, StepForward, BarChart3 } from 'lucide-react'
import type { T } from './data/questions'
import { num, type Lang } from './lib'

type P = { lang: Lang }
const useL = (lang: Lang) => (o: T) => o[lang]
const card = 'rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100'

export default function Labs({ lang }: P) {
  const L = useL(lang)
  const [lab, setLab] = useState<'num' | 'gate' | 'sort' | 'cyber'>('num')
  const labs = [
    { id: 'num' as const, icon: Binary, t: { bn: 'নাম্বার সিস্টেম', en: 'Number systems' } },
    { id: 'gate' as const, icon: CircuitBoard, t: { bn: 'লজিক গেট', en: 'Logic gates' } },
    { id: 'sort' as const, icon: BarChart3, t: { bn: 'সর্টিং ও সার্চ', en: 'Sorting & search' } },
    { id: 'cyber' as const, icon: KeyRound, t: { bn: 'সাইবার ল্যাব', en: 'Cyber lab' } },
  ]
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{L({ bn: 'ইন্টারেক্টিভ ল্যাব', en: 'Interactive labs' })}</h2>
        <p className="text-sm text-slate-500">{L({ bn: 'মুখস্থ নয় — নিজে হাতে চালিয়ে বুঝুন। গালা রাউন্ডের ব্যবহারিক ও ভাইভার জন্য দারুণ।', en: 'Don’t memorise — see it work. Great for the gala round practical & viva.' })}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {labs.map((x) => (
          <button key={x.id} onClick={() => setLab(x.id)} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold ${lab === x.id ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}>
            <x.icon size={18} /> {L(x.t)}
          </button>
        ))}
      </div>
      <div className="pop" key={lab}>
        {lab === 'num' && <NumberLab lang={lang} />}
        {lab === 'gate' && <GateLab lang={lang} />}
        {lab === 'sort' && <SortLab lang={lang} />}
        {lab === 'cyber' && <CyberLab lang={lang} />}
      </div>
    </div>
  )
}

/* ---------- Number systems ---------- */
const bases = [
  { b: 2, t: { bn: 'বাইনারি (২)', en: 'Binary (2)' }, re: /^[01]+$/ },
  { b: 8, t: { bn: 'অক্টাল (৮)', en: 'Octal (8)' }, re: /^[0-7]+$/ },
  { b: 10, t: { bn: 'ডেসিমাল (১০)', en: 'Decimal (10)' }, re: /^[0-9]+$/ },
  { b: 16, t: { bn: 'হেক্সাডেসিমাল (১৬)', en: 'Hexadecimal (16)' }, re: /^[0-9a-fA-F]+$/ },
]
function NumberLab({ lang }: P) {
  const L = useL(lang)
  const [from, setFrom] = useState(10)
  const [val, setVal] = useState('2026')
  const base = bases.find((b) => b.b === from)!
  const valid = val !== '' && base.re.test(val) && val.length <= 12
  const dec = valid ? parseInt(val, from) : NaN
  const steps: { n: number; q: number; r: number }[] = []
  if (valid && dec > 0) { let x = dec; while (x > 0 && steps.length < 40) { steps.push({ n: x, q: Math.floor(x / 2), r: x % 2 }); x = Math.floor(x / 2) } }
  const digits = valid ? val.toUpperCase().split('') : []
  return (
    <div className={`${card} space-y-4`}>
      <div className="flex flex-wrap gap-2">
        <select aria-label="From base" value={from} onChange={(e) => { setFrom(+e.target.value); setVal('') }} className="rounded-xl border border-slate-300 px-3 py-2.5">
          {bases.map((b) => <option key={b.b} value={b.b}>{L(b.t)}</option>)}
        </select>
        <input aria-label="Number" value={val} onChange={(e) => setVal(e.target.value.trim())} className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-lg outline-none focus:border-indigo-500" placeholder="2026" />
      </div>
      {!valid && val && <p className="text-sm text-rose-600">{L({ bn: 'এই বেসের জন্য সঠিক অঙ্ক দিন (সর্বোচ্চ ১২টি)।', en: 'Enter valid digits for this base (max 12).' })}</p>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {bases.map((b) => (
          <div key={b.b} className={`rounded-2xl p-3 ${b.b === from ? 'bg-indigo-50 ring-2 ring-indigo-200' : 'bg-slate-50'}`}>
            <p className="text-xs font-semibold text-slate-500">{L(b.t)}</p>
            <p className="break-all font-mono text-lg font-bold text-indigo-900">{valid ? dec.toString(b.b).toUpperCase() : '—'}</p>
          </div>
        ))}
      </div>
      {valid && from !== 10 && (
        <div>
          <p className="mb-2 font-semibold">{L({ bn: `ধাপ: বেস ${num(from, lang)} → ডেসিমাল (স্থানীয় মান)`, en: `Steps: base ${from} → decimal (place values)` })}</p>
          <p className="overflow-x-auto rounded-2xl bg-slate-900 p-3 font-mono text-sm text-emerald-300">
            {digits.map((d, i) => `${d}×${from}^${digits.length - 1 - i}`).join(' + ')} = <b className="text-white">{dec}</b>
          </p>
        </div>
      )}
      {valid && steps.length > 0 && (
        <div>
          <p className="mb-2 font-semibold">{L({ bn: 'ধাপ: ডেসিমাল → বাইনারি (২ দিয়ে বারবার ভাগ)', en: 'Steps: decimal → binary (repeated division by 2)' })}</p>
          <div className="max-h-64 overflow-auto rounded-2xl ring-1 ring-slate-200">
            <table className="w-full text-center font-mono text-sm">
              <thead className="sticky top-0 bg-slate-100 text-xs"><tr><th className="py-2">{L({ bn: 'সংখ্যা', en: 'Number' })}</th><th>÷ 2</th><th>{L({ bn: 'ভাগশেষ', en: 'Remainder' })}</th></tr></thead>
              <tbody>{steps.map((s, i) => <tr key={i} className="border-t border-slate-100"><td className="py-1.5">{s.n}</td><td>{s.q}</td><td className="font-bold text-indigo-600">{s.r}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-slate-600">{L({ bn: 'ভাগশেষগুলো নিচ থেকে উপরে পড়ুন:', en: 'Read the remainders bottom to top:' })} <b className="font-mono text-indigo-700">{dec.toString(2)}</b></p>
        </div>
      )}
    </div>
  )
}

/* ---------- Logic gates ---------- */
type Gate = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR'
const gateFn: Record<Gate, (a: number, b: number) => number> = {
  AND: (a, b) => a & b, OR: (a, b) => a | b, NOT: (a) => 1 - a, NAND: (a, b) => 1 - (a & b),
  NOR: (a, b) => 1 - (a | b), XOR: (a, b) => a ^ b, XNOR: (a, b) => 1 - (a ^ b),
}
const gateExpr: Record<Gate, string> = { AND: 'Y = A · B', OR: 'Y = A + B', NOT: 'Y = A̅', NAND: 'Y = (A · B)̅', NOR: 'Y = (A + B)̅', XOR: 'Y = A ⊕ B', XNOR: 'Y = (A ⊕ B)̅' }
const gateNote: Record<Gate, T> = {
  AND: { bn: 'সব ইনপুট ১ হলে আউটপুট ১।', en: 'Output is 1 only when all inputs are 1.' },
  OR: { bn: 'যেকোনো একটি ইনপুট ১ হলেই আউটপুট ১।', en: 'Output is 1 if any input is 1.' },
  NOT: { bn: 'ইনপুটের বিপরীত (ইনভার্টার)।', en: 'Inverts the input.' },
  NAND: { bn: 'AND-এর বিপরীত — সার্বজনীন গেট (Universal gate)।', en: 'Opposite of AND — a universal gate.' },
  NOR: { bn: 'OR-এর বিপরীত — এটিও সার্বজনীন গেট।', en: 'Opposite of OR — also a universal gate.' },
  XOR: { bn: 'ইনপুট দুটি ভিন্ন হলে আউটপুট ১ — যোগের (Half adder) মূল।', en: 'Output 1 when inputs differ — heart of the half adder.' },
  XNOR: { bn: 'ইনপুট দুটি সমান হলে আউটপুট ১।', en: 'Output 1 when inputs are equal.' },
}
function GateLab({ lang }: P) {
  const L = useL(lang)
  const [g, setG] = useState<Gate>('AND')
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const y = gateFn[g](a, b)
  const single = g === 'NOT'
  const rows = single ? [[0, 0], [1, 0]] : [[0, 0], [0, 1], [1, 0], [1, 1]]
  const Sw = ({ v, set, label }: { v: number; set: (n: number) => void; label: string }) => (
    <button onClick={() => set(1 - v)} className={`flex w-24 flex-col items-center rounded-2xl py-3 font-mono text-2xl font-bold transition ${v ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-200 text-slate-500'}`}>
      <span className="text-xs font-sans">{label}</span>{v}
    </button>
  )
  return (
    <div className={`${card} space-y-5`}>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(gateFn) as Gate[]).map((x) => (
          <button key={x} onClick={() => setG(x)} className={`rounded-full px-3 py-1.5 font-mono text-sm font-bold ${g === x ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{x}</button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col gap-3">
          <Sw v={a} set={setA} label="A" />
          {!single && <Sw v={b} set={setB} label="B" />}
        </div>
        <div className="flex h-28 w-28 items-center justify-center rounded-r-[56px] rounded-l-xl bg-indigo-600 font-mono text-xl font-bold text-white shadow-lg">{g}</div>
        <div className={`flex h-20 w-20 flex-col items-center justify-center rounded-full font-mono text-2xl font-bold transition ${y ? 'bg-amber-300 text-amber-900 shadow-[0_0_40px_#fcd34d]' : 'bg-slate-700 text-slate-400'}`}>
          <span className="text-xs font-sans">Y</span>{y}
        </div>
      </div>
      <p className="text-center font-mono text-lg font-semibold text-indigo-800">{gateExpr[g]}</p>
      <p className="text-center text-sm text-slate-600">{L(gateNote[g])}</p>
      <table className="mx-auto w-full max-w-xs text-center font-mono">
        <thead><tr className="text-xs text-slate-500"><th>A</th>{!single && <th>B</th>}<th>Y</th></tr></thead>
        <tbody>
          {rows.map(([ra, rb]) => {
            const on = ra === a && (single || rb === b)
            return <tr key={`${ra}${rb}`} className={on ? 'bg-indigo-100 font-bold text-indigo-900' : ''}><td className="py-1">{ra}</td>{!single && <td>{rb}</td>}<td>{gateFn[g](ra, rb)}</td></tr>
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Sorting & binary search ---------- */
type Algo = 'bubble' | 'selection' | 'insertion'
type Frame = { arr: number[]; hl: number[]; done: number[]; cmp: number; swp: number }
function frames(input: number[], algo: Algo): Frame[] {
  const a = [...input], out: Frame[] = [], done: number[] = []
  let cmp = 0, swp = 0
  const push = (hl: number[]) => out.push({ arr: [...a], hl, done: [...done], cmp, swp })
  const n = a.length
  if (algo === 'bubble') {
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        cmp++; push([j, j + 1])
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swp++; push([j, j + 1]) }
      }
      done.push(n - 1 - i)
    }
    done.push(0)
  } else if (algo === 'selection') {
    for (let i = 0; i < n - 1; i++) {
      let m = i
      for (let j = i + 1; j < n; j++) { cmp++; push([m, j]); if (a[j] < a[m]) m = j }
      if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; swp++ }
      done.push(i); push([i])
    }
    done.push(n - 1)
  } else {
    for (let i = 1; i < n; i++) {
      let j = i
      while (j > 0) { cmp++; push([j - 1, j]); if (a[j - 1] > a[j]) { [a[j - 1], a[j]] = [a[j], a[j - 1]]; swp++; j-- } else break }
    }
    for (let i = 0; i < n; i++) done.push(i)
  }
  push([])
  return out
}
const rand = () => Array.from({ length: 12 }, () => 5 + Math.floor(Math.random() * 95))
const algoInfo: Record<Algo, { t: T; big: string }> = {
  bubble: { t: { bn: 'বাবল সর্ট — পাশাপাশি দুটি তুলনা করে বড়টিকে ডানে ঠেলে দেয়।', en: 'Bubble sort — compares neighbours and pushes the larger one right.' }, big: 'O(n²)' },
  selection: { t: { bn: 'সিলেকশন সর্ট — প্রতি ধাপে সবচেয়ে ছোটটি খুঁজে সামনে আনে।', en: 'Selection sort — finds the smallest each pass and moves it forward.' }, big: 'O(n²)' },
  insertion: { t: { bn: 'ইনসার্শন সর্ট — তাসের মতো প্রতিটি সংখ্যা সঠিক জায়গায় ঢোকায়।', en: 'Insertion sort — inserts each item into place, like sorting cards.' }, big: 'O(n²)' },
}
function SortLab({ lang }: P) {
  const L = useL(lang)
  const N = (v: number | string) => num(v, lang)
  const [algo, setAlgo] = useState<Algo>('bubble')
  const [data, setData] = useState<number[]>(() => rand())
  const fs = useMemo(() => frames(data, algo), [data, algo])
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  const [speed, setSpeed] = useState(220)
  useEffect(() => { setI(0); setPlay(false) }, [fs])
  useEffect(() => {
    if (!play) return
    if (i >= fs.length - 1) { setPlay(false); return }
    const t = setTimeout(() => setI((x) => x + 1), speed)
    return () => clearTimeout(t)
  }, [play, i, fs, speed])
  const f = fs[Math.min(i, fs.length - 1)]
  const max = Math.max(...f.arr)
  return (
    <div className="space-y-4">
      <div className={`${card} space-y-4`}>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(algoInfo) as Algo[]).map((x) => (
            <button key={x} onClick={() => setAlgo(x)} className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${algo === x ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{x}</button>
          ))}
        </div>
        <p className="text-sm text-slate-600">{L(algoInfo[algo].t)} <b className="font-mono">{algoInfo[algo].big}</b></p>
        <div className="flex h-48 items-end gap-1 rounded-2xl bg-slate-50 p-2">
          {f.arr.map((v, k) => (
            <div key={k} className="flex flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[10px] font-semibold text-slate-500">{v}</span>
              <div className={`w-full rounded-t-md transition-all duration-150 ${f.hl.includes(k) ? 'bg-amber-400' : f.done.includes(k) ? 'bg-emerald-500' : 'bg-indigo-400'}`} style={{ height: `${(v / max) * 150}px` }} />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setPlay(!play)} className="flex items-center gap-1 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{play ? <Pause size={16} /> : <Play size={16} />} {play ? L({ bn: 'থামুন', en: 'Pause' }) : L({ bn: 'চালান', en: 'Play' })}</button>
          <button onClick={() => setI((x) => Math.min(x + 1, fs.length - 1))} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold"><StepForward size={16} /> {L({ bn: 'এক ধাপ', en: 'Step' })}</button>
          <button onClick={() => setI(0)} className="rounded-full bg-slate-100 p-2" aria-label="Reset"><RotateCcw size={16} /></button>
          <button onClick={() => setData(rand())} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold"><Shuffle size={16} /> {L({ bn: 'নতুন ডেটা', en: 'New data' })}</button>
          <label className="ml-auto flex items-center gap-2 text-xs text-slate-500">{L({ bn: 'গতি', en: 'Speed' })}<input type="range" min={40} max={600} value={640 - speed} onChange={(e) => setSpeed(640 - +e.target.value)} /></label>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-xl bg-slate-50 p-2"><p className="text-xs text-slate-500">{L({ bn: 'ধাপ', en: 'Step' })}</p><b>{N(i + 1)}/{N(fs.length)}</b></div>
          <div className="rounded-xl bg-amber-50 p-2"><p className="text-xs text-slate-500">{L({ bn: 'তুলনা', en: 'Comparisons' })}</p><b>{N(f.cmp)}</b></div>
          <div className="rounded-xl bg-emerald-50 p-2"><p className="text-xs text-slate-500">{L({ bn: 'অদলবদল', en: 'Swaps' })}</p><b>{N(f.swp)}</b></div>
        </div>
      </div>
      <BinarySearch lang={lang} />
    </div>
  )
}

function BinarySearch({ lang }: P) {
  const L = useL(lang)
  const N = (v: number | string) => num(v, lang)
  const arr = useMemo(() => [3, 8, 12, 17, 21, 26, 30, 34, 41, 47, 52, 58, 63, 70, 77, 85], [])
  const [target, setTarget] = useState(47)
  const [st, setSt] = useState<{ lo: number; hi: number; mid: number | null; found: number | null; steps: number; log: string[] }>({ lo: 0, hi: arr.length - 1, mid: null, found: null, steps: 0, log: [] })
  const reset = () => setSt({ lo: 0, hi: arr.length - 1, mid: null, found: null, steps: 0, log: [] })
  const over = st.found !== null || st.lo > st.hi
  const step = () => {
    if (over) return
    const mid = Math.floor((st.lo + st.hi) / 2)
    const v = arr[mid]
    const msg = v === target ? L({ bn: `arr[${mid}] = ${v} ✔ পাওয়া গেছে!`, en: `arr[${mid}] = ${v} ✔ found!` }) : v < target ? L({ bn: `arr[${mid}] = ${v} < ${target} → ডান অর্ধেকে খুঁজি`, en: `arr[${mid}] = ${v} < ${target} → search right half` }) : L({ bn: `arr[${mid}] = ${v} > ${target} → বাম অর্ধেকে খুঁজি`, en: `arr[${mid}] = ${v} > ${target} → search left half` })
    setSt({ lo: v < target ? mid + 1 : st.lo, hi: v > target ? mid - 1 : st.hi, mid, found: v === target ? mid : null, steps: st.steps + 1, log: [...st.log, msg] })
  }
  const r = useRef(reset); r.current = reset
  useEffect(() => { r.current() }, [target])
  return (
    <div className={`${card} space-y-3`}>
      <p className="flex items-center gap-2 font-bold"><Search size={18} className="text-indigo-600" /> {L({ bn: 'বাইনারি সার্চ — O(log n)', en: 'Binary search — O(log n)' })}</p>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {L({ bn: 'খুঁজুন:', en: 'Find:' })}
        <select aria-label="Target" value={target} onChange={(e) => setTarget(+e.target.value)} className="rounded-xl border border-slate-300 px-2 py-1.5 font-mono">
          {[...arr, 50].sort((x, y) => x - y).map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <button onClick={step} disabled={over} className="rounded-full bg-indigo-600 px-4 py-1.5 font-semibold text-white disabled:opacity-40">{L({ bn: 'পরের ধাপ', en: 'Next step' })}</button>
        <button onClick={reset} className="rounded-full bg-slate-100 p-2" aria-label="Reset search"><RotateCcw size={14} /></button>
      </div>
      <div className="grid grid-cols-8 gap-1 sm:grid-cols-16">
        {arr.map((v, k) => {
          const out = k < st.lo || k > st.hi
          const cls = st.found === k ? 'bg-emerald-500 text-white' : st.mid === k ? 'bg-amber-400 text-amber-950' : out ? 'bg-slate-100 text-slate-300' : 'bg-indigo-100 text-indigo-900'
          return <div key={k} className={`rounded-lg py-2 text-center font-mono text-sm font-bold transition ${cls}`}>{v}<span className="block text-[9px] font-normal opacity-60">{k}</span></div>
        })}
      </div>
      <ol className="space-y-1 font-mono text-xs text-slate-700">{st.log.map((m, k) => <li key={k}>{N(k + 1)}. {m}</li>)}</ol>
      {over && <p className="rounded-xl bg-indigo-50 p-2 text-sm text-indigo-900">{st.found !== null ? L({ bn: `মাত্র ${N(st.steps)} ধাপে পাওয়া গেছে! লিনিয়ার সার্চে লাগত ${N(st.found + 1)} ধাপ।`, en: `Found in just ${st.steps} steps! Linear search would need ${st.found + 1}.` }) : L({ bn: `${N(st.steps)} ধাপে নিশ্চিত হলাম সংখ্যাটি তালিকায় নেই।`, en: `In ${st.steps} steps we proved it is not in the list.` })}</p>}
    </div>
  )
}

/* ---------- Cyber lab ---------- */
function CyberLab({ lang }: P) {
  const L = useL(lang)
  const N = (v: number | string) => num(v, lang)
  const [text, setText] = useState('ICT OLYMPIAD BANGLADESH')
  const [shift, setShift] = useState(3)
  const enc = (s: string, k: number) => s.replace(/[a-z]/gi, (c) => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + k + 26 * 10) % 26) + b) })
  const [pw, setPw] = useState('mahir2008')
  let pool = 0
  if (/[a-z]/.test(pw)) pool += 26
  if (/[A-Z]/.test(pw)) pool += 26
  if (/[0-9]/.test(pw)) pool += 10
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33
  const common = ['123456', 'password', '12345678', 'qwerty', 'bangladesh', '111111', 'iloveyou'].includes(pw.toLowerCase())
  const bits = common ? 5 : pw.length * Math.log2(Math.max(pool, 1))
  const secs = 2 ** bits / 1e10 // assume 10 billion guesses per second (offline GPU attack)
  const human = (s: number): T => {
    if (s < 1) return { bn: 'মুহূর্তেই', en: 'instantly' }
    const u: [number, T][] = [[31536000 * 1e6, { bn: 'লক্ষ বছরেরও বেশি', en: 'over a million years' }], [31536000, { bn: 'বছর', en: 'years' }], [86400, { bn: 'দিন', en: 'days' }], [3600, { bn: 'ঘণ্টা', en: 'hours' }], [60, { bn: 'মিনিট', en: 'minutes' }], [1, { bn: 'সেকেন্ড', en: 'seconds' }]]
    if (s >= u[0][0]) return u[0][1]
    for (const [d, name] of u.slice(1)) if (s >= d) return { bn: `প্রায় ${N(Math.round(s / d))} ${name.bn}`, en: `about ${Math.round(s / d)} ${name.en}` }
    return { bn: 'মুহূর্তেই', en: 'instantly' }
  }
  const lvl = bits < 40 ? 0 : bits < 60 ? 1 : bits < 80 ? 2 : 3
  const lvlT: T[] = [{ bn: 'খুব দুর্বল', en: 'Very weak' }, { bn: 'দুর্বল', en: 'Weak' }, { bn: 'ভালো', en: 'Good' }, { bn: 'শক্তিশালী', en: 'Strong' }]
  const lvlC = ['bg-rose-500', 'bg-orange-500', 'bg-amber-400', 'bg-emerald-500']
  return (
    <div className="space-y-4">
      <div className={`${card} space-y-3`}>
        <p className="font-bold">{L({ bn: 'সিজার সাইফার (এনক্রিপশনের প্রথম ধাপ)', en: 'Caesar cipher (encryption basics)' })}</p>
        <input aria-label="Plain text" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono outline-none focus:border-indigo-500" />
        <label className="flex items-center gap-3 text-sm">{L({ bn: 'শিফট', en: 'Shift' })} <input type="range" min={1} max={25} value={shift} onChange={(e) => setShift(+e.target.value)} className="flex-1" /> <b className="w-6 font-mono">{shift}</b></label>
        <div className="overflow-x-auto font-mono text-xs">
          <div className="flex gap-0.5">{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c) => <span key={c} className="w-5 shrink-0 rounded bg-slate-100 text-center">{c}</span>)}</div>
          <div className="mt-0.5 flex gap-0.5">{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c) => <span key={c} className="w-5 shrink-0 rounded bg-indigo-600 text-center text-white">{enc(c, shift)}</span>)}</div>
        </div>
        <p className="rounded-2xl bg-slate-900 p-3 font-mono text-emerald-300">{enc(text, shift)}</p>
        <p className="text-xs text-slate-500">{L({ bn: `মাত্র ২৫টি সম্ভাব্য কী — তাই কম্পিউটার এক সেকেন্ডেরও কম সময়ে ভেঙে ফেলে। আধুনিক AES/RSA-তে কী-এর সংখ্যা অকল্পনীয় বড়।`, en: 'Only 25 possible keys, so a computer cracks it in under a second. Modern AES/RSA have astronomically many keys.' })}</p>
      </div>
      <div className={`${card} space-y-3`}>
        <p className="font-bold">{L({ bn: 'পাসওয়ার্ড কত শক্তিশালী?', en: 'How strong is your password?' })}</p>
        <input aria-label="Password to test" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono outline-none focus:border-indigo-500" />
        <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${lvlC[lvl]} transition-all`} style={{ width: `${Math.min(100, (bits / 100) * 100)}%` }} /></div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-xl bg-slate-50 p-2"><p className="text-xs text-slate-500">{L({ bn: 'মান', en: 'Rating' })}</p><b>{L(lvlT[lvl])}</b></div>
          <div className="rounded-xl bg-slate-50 p-2"><p className="text-xs text-slate-500">{L({ bn: 'এনট্রপি', en: 'Entropy' })}</p><b>{N(Math.round(bits))} bits</b></div>
          <div className="rounded-xl bg-slate-50 p-2"><p className="text-xs text-slate-500">{L({ bn: 'ভাঙতে সময়', en: 'Time to crack' })}</p><b>{L(human(secs))}</b></div>
        </div>
        <p className="text-xs text-slate-500">{L({ bn: 'হিসাব: এনট্রপি = দৈর্ঘ্য × log₂(অক্ষরের সংখ্যা); প্রতি সেকেন্ডে ১০০০ কোটি অনুমান ধরে। পাসওয়ার্ড কোথাও পাঠানো হয় না — সব হিসাব আপনার ডিভাইসে।', en: 'Entropy = length × log₂(character pool), assuming 10 billion guesses/second. Nothing is sent anywhere — computed on your device.' })}</p>
      </div>
    </div>
  )
}
