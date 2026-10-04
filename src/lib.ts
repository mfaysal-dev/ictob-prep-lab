import { useEffect, useState } from 'react'
import type { T } from './data/questions'

export type Lang = 'bn' | 'en'
const bnDigits = '০১২৩৪৫৬৭৮৯'
export const num = (v: number | string, lang: Lang) => (lang === 'bn' ? String(v).replace(/\d/g, (d) => bnDigits[+d]) : String(v))
export const tr = (o: T, lang: Lang) => o[lang]

export function useStored<V>(key: string, initial: V) {
  const [v, setV] = useState<V>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as V) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)) }, [key, v])
  return [v, setV] as const
}

export function shuffle<X>(arr: X[]): X[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export type Stat = { c: number; w: number; last: boolean }
export type Stats = Record<string, Stat>
export type MockRun = { at: number; score: number; total: number; secs: number }
