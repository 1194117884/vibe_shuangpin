# 双拼练习平台 (Shuangpin Practice App) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Duolingo-style Shuangpin practice web app supporting multiple key mappings (小鹤、搜狗、微软、自然码).

**Architecture:** Pure frontend React app with CSS Modules for Duolingo-style UI. Shuangpin scheme data is static TypeScript constants. Practice engine is pure functions for testability. Progress persisted via localStorage. No backend.

**Tech Stack:** React 18 + TypeScript strict + Vite + CSS Modules + Vitest + React Testing Library + PWA (vite-plugin-pwa)

---

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/vite-env.d.ts`
- Create: `.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "vibe-shuangpin",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^9.0.0",
    "jsdom": "^25.0.0",
    "typescript": "^5.5.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0",
    "vite-plugin-pwa": "^0.20.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Vibe 双拼',
        short_name: '双拼',
        description: '双拼练习平台',
        theme_color: '#58CC02',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
})
```

- [ ] **Step 5: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#58CC02" />
    <title>Vibe 双拼</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create src/vite-env.d.ts**

```ts
/// <reference types="vite/client" />
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
```

- [ ] **Step 7: Create src/main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './components/App/App'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 8: Create src/index.css (reset + Duolingo-style base)**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-green: #58cc02;
  --color-green-hover: #46a302;
  --color-blue: #1cb0f6;
  --color-blue-hover: #1899d6;
  --color-orange: #ff9600;
  --color-red: #ff4b4b;
  --color-bg: #f0f0f0;
  --color-surface: #ffffff;
  --color-text: #2b2b2b;
  --color-text-secondary: #777777;
  --color-border: #e5e5e5;
  --color-correct: #58cc02;
  --color-incorrect: #ff4b4b;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --font-sans: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 9: Create .gitignore**

```
node_modules
dist
*.local
```

- [ ] **Step 10: Create favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#58CC02"/>
  <text x="50" y="68" font-size="50" font-weight="bold" text-anchor="middle" fill="white" font-family="system-ui">拼</text>
</svg>
```

- [ ] **Step 11: Create a placeholder App component**

Create `src/components/App/App.tsx`:
```tsx
export function App() {
  return <div>Vibe 双拼</div>
}
```

Create `src/components/App/App.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Vibe 双拼')).toBeInTheDocument()
  })
})
```

- [ ] **Step 12: Install dependencies and run verify**

Run: `npm install`
Expected: All packages install without errors.

Run: `npm run typecheck`
Expected: No type errors.

Run: `npm test`
Expected: 1 test passes.

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 13: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript project"
```

---

### Task 2: Define TypeScript types for the application

**Files:**
- Create: `src/types/index.ts`
- Create: `src/types/index.test.ts`

- [ ] **Step 1: Write the test that validates all types are properly defined**

```ts
import { describe, it, expect } from 'vitest'
import type { ShuangpinScheme, Exercise, Lesson, LessonProgress, UserStats, ExerciseResult } from './index'

describe('types', () => {
  it('ShuangpinScheme has required fields', () => {
    const scheme: ShuangpinScheme = {
      id: 'test',
      name: 'Test',
      description: 'A test scheme',
      initials: { zh: 'v' },
      finals: { an: 'j' },
      specials: { a: 'aa' },
      zeroInitialFinals: { a: 'aa' },
    }
    expect(scheme.id).toBe('test')
    expect(Object.keys(scheme.initials).length).toBe(1)
  })

  it('Exercise type is correct', () => {
    const exercise: Exercise = {
      prompt: 'zhong',
      answer: 'vs',
      type: 'syllable',
    }
    expect(exercise.type).toBe('syllable')
  })

  it('Lesson has required structure', () => {
    const lesson: Lesson = {
      id: 'lesson-1',
      title: '声母练习',
      description: '练习声母',
      schemeId: 'xiaohe',
      exercises: [],
      prerequisites: [],
    }
    expect(lesson.prerequisites).toEqual([])
  })

  it('ExerciseResult tracks typing outcome', () => {
    const result: ExerciseResult = {
      exercise: { prompt: 'zhong', answer: 'vs', type: 'syllable' },
      input: 'vs',
      correct: true,
      timeMs: 1500,
    }
    expect(result.correct).toBe(true)
    expect(result.timeMs).toBe(1500)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/types/index.test.ts`
Expected: FAIL - Module not found (types/index.ts doesn't exist yet)

- [ ] **Step 3: Create src/types/index.ts**

```ts
/** A Shuangpin key mapping scheme */
export interface ShuangpinScheme {
  id: string
  name: string
  description: string
  /** Initial consonant to key mapping, e.g. { zh: 'v', ch: 'i', sh: 'u' } */
  initials: Record<string, string>
  /** Final (rhyme) to key mapping, e.g. { ang: 'h', eng: 'g', ong: 's' } */
  finals: Record<string, string>
  /** Special single-syllable key sequences, e.g. { a: 'aa', o: 'oo' } */
  specials: Record<string, string>
  /** Zero-initial finals with their Shuangpin sequences */
  zeroInitialFinals: Record<string, string>
}

export type ExerciseType = 'initial' | 'final' | 'syllable' | 'word' | 'phrase'

/** A single question in an exercise */
export interface Exercise {
  prompt: string
  answer: string
  type: ExerciseType
}

/** A lesson containing multiple exercises */
export interface Lesson {
  id: string
  title: string
  description: string
  schemeId: string
  exercises: Exercise[]
  prerequisites: string[]
}

/** Result of a single exercise attempt */
export interface ExerciseResult {
  exercise: Exercise
  input: string
  correct: boolean
  timeMs: number
}

/** Progress for a specific lesson */
export interface LessonProgress {
  lessonId: string
  completed: boolean
  bestAccuracy: number
  bestWpm: number
  attempts: number
  lastPracticed: string | null
}

/** Overall user statistics */
export interface UserStats {
  streaks: number
  lastPracticeDate: string | null
  totalExercisesCompleted: number
  lessonProgress: Record<string, LessonProgress>
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/types/index.test.ts`
Expected: PASS - all type assertions pass (TypeScript compiles the file, runtime tests pass)

- [ ] **Step 5: Commit**

```bash
git add src/types/
git commit -m "feat: define TypeScript types for shuangpin app"
```

---

### Task 3: Implement 小鹤 scheme data

**Files:**
- Create: `src/data/xiaohe.ts`
- Create: `src/data/xiaohe.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { xiaohe } from './xiaohe'

describe('xiaohe scheme', () => {
  it('has correct id and name', () => {
    expect(xiaohe.id).toBe('xiaohe')
    expect(xiaohe.name).toBe('小鹤')
  })

  it('maps all standard initials', () => {
    expect(xiaohe.initials['zh']).toBe('v')
    expect(xiaohe.initials['ch']).toBe('i')
    expect(xiaohe.initials['sh']).toBe('u')
  })

  it('maps common finals', () => {
    expect(xiaohe.finals['ang']).toBe('h')
    expect(xiaohe.finals['eng']).toBe('g')
    expect(xiaohe.finals['ong']).toBe('s')
    expect(xiaohe.finals['an']).toBe('j')
    expect(xiaohe.finals['ao']).toBe('c')
    expect(xiaohe.finals['ai']).toBe('d')
    expect(xiaohe.finals['ei']).toBe('w')
    expect(xiaohe.finals['ou']).toBe('b')
    expect(xiaohe.finals['iu']).toBe('q')
    expect(xiaohe.finals['in']).toBe('b')
    expect(xiaohe.finals['ing']).toBe('k')
    expect(xiaohe.finals['un']).toBe('p')
    expect(xiaohe.finals['vn']).toBe('y')
    expect(xiaohe.finals['ia']).toBe('x')
    expect(xiaohe.finals['ie']).toBe('p')
    expect(xiaohe.finals['uo']).toBe('o')
    expect(xiaohe.finals['ue']).toBe('t')
    expect(xiaohe.finals['ui']).toBe('v')
    expect(xiaohe.finals['ua']).toBe('x')
    expect(xiaohe.finals['ian']).toBe('j')
    expect(xiaohe.finals['iao']).toBe('n')
    expect(xiaohe.finals['iang']).toBe('l')
    expect(xiaohe.finals['iong']).toBe('s')
    expect(xiaohe.finals['uang']).toBe('l')
    expect(xiaohe.finals['uan']).toBe('r')
    expect(xiaohe.finals['uai']).toBe('k')
    expect(xiaohe.finals['uai']).toBe('k')
    expect(xiaohe.finals['ve']).toBe('t')
    expect(xiaohe.finals['er']).toBe('r')
  })

  it('maps zero-initial finals', () => {
    expect(xiaohe.zeroInitialFinals['a']).toBe('aa')
    expect(xiaohe.zeroInitialFinals['o']).toBe('oo')
    expect(xiaohe.zeroInitialFinals['e']).toBe('ee')
    expect(xiaohe.zeroInitialFinals['ai']).toBe('ai')
    expect(xiaohe.zeroInitialFinals['an']).toBe('an')
    expect(xiaohe.zeroInitialFinals['ang']).toBe('ah')
    expect(xiaohe.zeroInitialFinals['ou']).toBe('ou')
  })

  it('has no duplicate values in finals', () => {
    const values = Object.values(xiaohe.finals)
    const unique = new Set(values)
    expect(values.length).toBe(unique.size)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/xiaohe.test.ts`
Expected: FAIL - Module not found

- [ ] **Step 3: Create src/data/xiaohe.ts**

```ts
import type { ShuangpinScheme } from '../types'

export const xiaohe: ShuangpinScheme = {
  id: 'xiaohe',
  name: '小鹤',
  description: '小鹤双拼方案',
  initials: {
    zh: 'v',
    ch: 'i',
    sh: 'u',
  },
  finals: {
    a: 'a',
    o: 'o',
    e: 'e',
    i: 'i',
    u: 'u',
    v: 'v',
    ai: 'd',
    ei: 'w',
    ui: 'v',
    ao: 'c',
    ou: 'b',
    an: 'j',
    en: 'f',
    in: 'b',
    un: 'p',
    vn: 'y',
    ang: 'h',
    eng: 'g',
    ing: 'k',
    ong: 's',
    ia: 'x',
    iao: 'n',
    ie: 'p',
    iu: 'q',
    ua: 'x',
    uo: 'o',
    uai: 'k',
    uan: 'r',
    uang: 'l',
    un: 'p',
    iong: 's',
    iang: 'l',
    ian: 'j',
    ue: 't',
    ve: 't',
    er: 'r',
    ao: 'c',
  },
  specials: {
    a: 'aa',
    o: 'oo',
    e: 'ee',
  },
  zeroInitialFinals: {
    a: 'aa',
    o: 'oo',
    e: 'ee',
    ai: 'ai',
    an: 'an',
    ang: 'ah',
    ao: 'ao',
    ei: 'ei',
    en: 'en',
    eng: 'eg',
    er: 'er',
    ou: 'ou',
  },
}
```

- [ ] **Step 4: Fix duplicate key issues in xiaohe.ts**

Note: The initial data above has duplicate keys (`ao`, `un` appear twice). Fix by removing duplicates - keep the first occurrence. The test should verify no duplicates.

Actually, let me correct the data. Let me rewrite the finals map properly without duplicates.

```ts
import type { ShuangpinScheme } from '../types'

export const xiaohe: ShuangpinScheme = {
  id: 'xiaohe',
  name: '小鹤',
  description: '小鹤双拼方案',
  initials: {
    zh: 'v',
    ch: 'i',
    sh: 'u',
  },
  finals: {
    a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
    ai: 'd', ei: 'w', ui: 'v',
    ao: 'c', ou: 'b',
    an: 'j', en: 'f', in: 'b', un: 'p', vn: 'y',
    ang: 'h', eng: 'g', ing: 'k', ong: 's',
    ia: 'x', iao: 'n', ie: 'p', iu: 'q',
    ua: 'x', uo: 'o', uai: 'k', uan: 'r', uang: 'l',
    iong: 's', iang: 'l', ian: 'j',
    ue: 't', ve: 't',
    er: 'r',
  },
  specials: {
    a: 'aa',
    o: 'oo',
    e: 'ee',
  },
  zeroInitialFinals: {
    a: 'aa', o: 'oo', e: 'ee',
    ai: 'ai', an: 'an', ang: 'ah', ao: 'ao',
    ei: 'ei', en: 'en', eng: 'eg', er: 'er',
    ou: 'ou',
  },
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/data/xiaohe.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/data/xiaohe.ts src/data/xiaohe.test.ts
git commit -m "feat: add 小鹤 shuangpin scheme data"
```

---

### Task 4: Implement core Shuangpin utility functions

**Files:**
- Create: `src/utils/shuangpin.ts`
- Create: `src/utils/shuangpin.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { getShuangpinKeys, parsePinyin, getAvailableSchemes } from './shuangpin'
import { xiaohe } from '../data/xiaohe'

describe('getShuangpinKeys', () => {
  it('returns keys for a syllable with initial + final', () => {
    // zhong = zh + ong → v + s
    expect(getShuangpinKeys('zhong', xiaohe)).toBe('vs')
  })

  it('returns keys for a syllable with single final', () => {
    // an → an
    expect(getShuangpinKeys('an', xiaohe)).toBe('an')
  })

  it('handles zero-initial finals correctly', () => {
    expect(getShuangpinKeys('a', xiaohe)).toBe('aa')
    expect(getShuangpinKeys('e', xiaohe)).toBe('ee')
    expect(getShuangpinKeys('o', xiaohe)).toBe('oo')
  })

  it('handles ch/sh/zh initials', () => {
    // chi = ch + i → i + i
    expect(getShuangpinKeys('chi', xiaohe)).toBe('ii')
    // shi = sh + i → u + i
    expect(getShuangpinKeys('shi', xiaohe)).toBe('ui')
    // zhi = zh + i → v + i
    expect(getShuangpinKeys('zhi', xiaohe)).toBe('vi')
  })

  it('handles syllables with ia/iao/uai finals', () => {
    // qia = q + ia → q + x
    expect(getShuangpinKeys('qia', xiaohe)).toBe('qx')
    // biao = b + iao → b + n
    expect(getShuangpinKeys('biao', xiaohe)).toBe('bn')
    // kuai = k + uai → k + k
    expect(getShuangpinKeys('kuai', xiaohe)).toBe('kk')
  })

  it('throws for invalid pinyin', () => {
    expect(() => getShuangpinKeys('xyz', xiaohe)).toThrow('无法解析拼音')
  })
})

describe('parsePinyin', () => {
  it('splits zh-initial syllables', () => {
    expect(parsePinyin('zhong')).toEqual({ initial: 'zh', final: 'ong' })
    expect(parsePinyin('zhi')).toEqual({ initial: 'zh', final: 'i' })
  })

  it('splits ch-initial syllables', () => {
    expect(parsePinyin('chi')).toEqual({ initial: 'ch', final: 'i' })
  })

  it('splits sh-initial syllables', () => {
    expect(parsePinyin('shi')).toEqual({ initial: 'sh', final: 'i' })
    expect(parsePinyin('shang')).toEqual({ initial: 'sh', final: 'ang' })
  })

  it('splits single-letter initial syllables', () => {
    expect(parsePinyin('da')).toEqual({ initial: 'd', final: 'a' })
    expect(parsePinyin('nian')).toEqual({ initial: 'n', final: 'ian' })
    expect(parsePinyin('kuai')).toEqual({ initial: 'k', final: 'uai' })
  })

  it('returns null for zero-initial syllables', () => {
    expect(parsePinyin('an')).toBeNull()
    expect(parsePinyin('a')).toBeNull()
    expect(parsePinyin('e')).toBeNull()
    expect(parsePinyin('ou')).toBeNull()
  })
})

describe('getAvailableSchemes', () => {
  it('returns at least xiaohe', () => {
    const schemes = getAvailableSchemes()
    const ids = schemes.map(s => s.id)
    expect(ids).toContain('xiaohe')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/shuangpin.test.ts`
Expected: FAIL - Module not found

- [ ] **Step 3: Create src/utils/shuangpin.ts**

```ts
import type { ShuangpinScheme } from '../types'
import { xiaohe } from '../data/xiaohe'

const INITIALS = ['zh', 'ch', 'sh'] as const

/**
 * Parse a pinyin syllable into initial and final parts.
 * Returns null if the syllable has no initial (zero-initial).
 */
export function parsePinyin(syllable: string): { initial: string; final: string } | null {
  for (const init of INITIALS) {
    if (syllable.startsWith(init)) {
      return { initial: init, final: syllable.slice(init.length) }
    }
  }
  // Single-consonant initial: b, p, m, f, d, t, n, l, g, k, h, j, q, x, r, z, c, s, y, w
  const first = syllable[0]
  if (!first) return null
  if (/[bpmfdtnlgkhjqxrzcsyw]/.test(first)) {
    // Check if this is a zero-initial syllable starting with a consonant-like letter
    // that actually isn't an initial (e.g., "an" starts with a but a isn't an initial here)
    // Actually, an, ang etc start with vowels. Our regex handles single consonants only.
    return { initial: first, final: syllable.slice(1) }
  }
  return null
}

/**
 * Get the Shuangpin keystrokes for a pinyin syllable under a given scheme.
 */
export function getShuangpinKeys(syllable: string, scheme: ShuangpinScheme): string {
  // Check specials first (single-key syllables like a, o, e)
  if (scheme.specials[syllable]) {
    return scheme.specials[syllable]!
  }

  // Check zero-initial finals
  if (scheme.zeroInitialFinals[syllable]) {
    return scheme.zeroInitialFinals[syllable]!
  }

  const parsed = parsePinyin(syllable)
  if (!parsed) {
    throw new Error(`无法解析拼音: ${syllable}`)
  }

  const { initial, final } = parsed

  const initialKey = scheme.initials[initial] ?? initial
  const finalKey = scheme.finals[final]

  if (!finalKey) {
    throw new Error(`无法解析拼音: ${syllable} (未找到韵母映射: ${final})`)
  }

  return initialKey + finalKey
}

/**
 * Get all available Shuangpin schemes.
 */
export function getAvailableSchemes(): ShuangpinScheme[] {
  return [xiaohe]
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/utils/shuangpin.test.ts`
Expected: PASS (may need to fix edge cases)

If there are failures, fix them (likely edge cases in parsePinyin for specific syllables).

- [ ] **Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: implement core shuangpin utility functions"
```

---

### Task 5: Add remaining scheme data (搜狗, 微软, 自然码)

**Files:**
- Create: `src/data/sougou.ts`
- Create: `src/data/sougou.test.ts`
- Create: `src/data/microsoft.ts`
- Create: `src/data/microsoft.test.ts`
- Create: `src/data/ziranma.ts`
- Create: `src/data/ziranma.test.ts`
- Modify: `src/data/schemes.ts`
- Modify: `src/data/schemes.test.ts`
- Modify: `src/utils/shuangpin.ts`

- [ ] **Step 1: Write tests for 搜狗 scheme**

```ts
// src/data/sougou.test.ts
import { describe, it, expect } from 'vitest'
import { sougou } from './sougou'

describe('sougou scheme', () => {
  it('has correct id and name', () => {
    expect(sougou.id).toBe('sougou')
    expect(sougou.name).toBe('搜狗')
  })

  it('maps zh/ch/sh to u/i/v', () => {
    expect(sougou.initials['zh']).toBe('v')
    expect(sougou.initials['ch']).toBe('i')
    expect(sougou.initials['sh']).toBe('u')
  })

  it('maps common finals', () => {
    expect(sougou.finals['ang']).toBe('h')
    expect(sougou.finals['eng']).toBe('g')
    expect(sougou.finals['ong']).toBe('s')
    expect(sougou.finals['an']).toBe('j')
    expect(sougou.finals['en']).toBe('f')
    expect(sougou.finals['ian']).toBe('j')
    expect(sougou.finals['iao']).toBe('c')
    expect(sougou.finals['in']).toBe('n')
    expect(sougou.finals['ing']).toBe('y')
    expect(sougou.finals['iu']).toBe('q')
    expect(sougou.finals['uan']).toBe('r')
    expect(sougou.finals['ue']).toBe('x')
    expect(sougou.finals['un']).toBe('p')
    expect(sougou.finals['uo']).toBe('o')
    expect(sougou.finals['ve']).toBe('x')
    expect(sougou.finals['ai']).toBe('l')
    expect(sougou.finals['ei']).toBe('z')
  })

  it('has no duplicate initial/final values', () => {
    const values = Object.values(sougou.finals)
    const unique = new Set(values)
    expect(values.length).toBe(unique.size)
  })
})
```

- [ ] **Step 2: Run to fail**

Run: `npx vitest run src/data/sougou.test.ts`
Expected: FAIL

- [ ] **Step 3: Create src/data/sougou.ts**

```ts
import type { ShuangpinScheme } from '../types'

export const sougou: ShuangpinScheme = {
  id: 'sougou',
  name: '搜狗',
  description: '搜狗双拼方案',
  initials: {
    zh: 'v',
    ch: 'i',
    sh: 'u',
  },
  finals: {
    a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
    ai: 'l', ei: 'z', ui: 'v',
    ao: 'k', ou: 'b',
    an: 'j', en: 'f', in: 'n', un: 'p', vn: 'y',
    ang: 'h', eng: 'g', ing: 'y', ong: 's',
    ia: 'x', iao: 'c', ie: 'x', iu: 'q',
    ua: 'x', uo: 'o', uai: 'm', uan: 'r', uang: 'l',
    iong: 's', iang: 'l', ian: 'j',
    ue: 'x', ve: 'x',
    er: 'r',
  },
  specials: {
    a: 'aa',
    o: 'oo',
    e: 'ee',
  },
  zeroInitialFinals: {
    a: 'aa', o: 'oo', e: 'ee',
    ai: 'ai', an: 'an', ang: 'ah', ao: 'ao',
    ei: 'ei', en: 'en', eng: 'eg', er: 'er',
    ou: 'ou',
  },
}
```

- [ ] **Step 4: Tests pass**

Run: `npx vitest run src/data/sougou.test.ts`
Expected: PASS

- [ ] **Step 5: Write tests for 微软 scheme**

```ts
// src/data/microsoft.test.ts
import { describe, it, expect } from 'vitest'
import { microsoft } from './microsoft'

describe('microsoft scheme', () => {
  it('has correct id', () => {
    expect(microsoft.id).toBe('microsoft')
    expect(microsoft.name).toBe('微软')
  })

  it('maps zh/ch/sh to v/i/u', () => {
    expect(microsoft.initials['zh']).toBe('v')
    expect(microsoft.initials['ch']).toBe('i')
    expect(microsoft.initials['sh']).toBe('u')
  })

  it('maps common finals', () => {
    expect(microsoft.finals['ang']).toBe('h')
    expect(microsoft.finals['eng']).toBe('g')
    expect(microsoft.finals['ong']).toBe('s')
    expect(microsoft.finals['an']).toBe('j')
    expect(microsoft.finals['ian']).toBe('j')
    expect(microsoft.finals['iao']).toBe('k')
    expect(microsoft.finals['in']).toBe('n')
    expect(microsoft.finals['ing']).toBe('y')
    expect(microsoft.finals['iu']).toBe('q')
    expect(microsoft.finals['uan']).toBe('r')
    expect(microsoft.finals['ue']).toBe('x')
    expect(microsoft.finals['un']).toBe('p')
    expect(microsoft.finals['uo']).toBe('o')
    expect(microsoft.finals['ve']).toBe('x')
  })
})
```

- [ ] **Step 6: Create src/data/microsoft.ts**

```ts
import type { ShuangpinScheme } from '../types'

export const microsoft: ShuangpinScheme = {
  id: 'microsoft',
  name: '微软',
  description: '微软双拼方案',
  initials: {
    zh: 'v',
    ch: 'i',
    sh: 'u',
  },
  finals: {
    a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
    ai: 'l', ei: 'z', ui: 'v',
    ao: 'k', ou: 'b',
    an: 'j', en: 'f', in: 'n', un: 'p', vn: 'y',
    ang: 'h', eng: 'g', ing: 'y', ong: 's',
    ia: 'w', iao: 'k', ie: 'x', iu: 'q',
    ua: 'w', uo: 'o', uai: 'y', uan: 'r', uang: 'l',
    iong: 's', iang: 'l', ian: 'j',
    ue: 'x', ve: 'x',
    er: 'r',
  },
  specials: {
    a: 'aa',
    o: 'oo',
    e: 'ee',
  },
  zeroInitialFinals: {
    a: 'aa', o: 'oo', e: 'ee',
    ai: 'ai', an: 'an', ang: 'ah', ao: 'ao',
    ei: 'ei', en: 'en', eng: 'eg', er: 'er',
    ou: 'ou',
  },
}
```

- [ ] **Step 7: Run tests, fix, pass**

Run: `npx vitest run src/data/microsoft.test.ts`
Expected: PASS

- [ ] **Step 8: Write tests for 自然码 scheme**

```ts
// src/data/ziranma.test.ts
import { describe, it, expect } from 'vitest'
import { ziranma } from './ziranma'

describe('ziranma scheme', () => {
  it('has correct id', () => {
    expect(ziranma.id).toBe('ziranma')
    expect(ziranma.name).toBe('自然码')
  })

  it('maps zh/ch/sh to v/i/u', () => {
    expect(ziranma.initials['zh']).toBe('v')
    expect(ziranma.initials['ch']).toBe('i')
    expect(ziranma.initials['sh']).toBe('u')
  })

  it('maps common finals', () => {
    expect(ziranma.finals['ang']).toBe('h')
    expect(ziranma.finals['eng']).toBe('g')
    expect(ziranma.finals['ong']).toBe('s')
    expect(ziranma.finals['an']).toBe('j')
    expect(ziranma.finals['ian']).toBe('j')
    expect(ziranma.finals['iao']).toBe('c')
    expect(ziranma.finals['in']).toBe('n')
    expect(ziranma.finals['ing']).toBe('y')
    expect(ziranma.finals['iu']).toBe('q')
    expect(ziranma.finals['uan']).toBe('r')
    expect(ziranma.finals['ue']).toBe('t')
    expect(ziranma.finals['un']).toBe('p')
    expect(ziranma.finals['uo']).toBe('o')
    expect(ziranma.finals['ve']).toBe('t')
    expect(ziranma.finals['ai']).toBe('l')
    expect(ziranma.finals['ei']).toBe('z')
  })
})
```

- [ ] **Step 9: Create src/data/ziranma.ts**

```ts
import type { ShuangpinScheme } from '../types'

export const ziranma: ShuangpinScheme = {
  id: 'ziranma',
  name: '自然码',
  description: '自然码双拼方案',
  initials: {
    zh: 'v',
    ch: 'i',
    sh: 'u',
  },
  finals: {
    a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
    ai: 'l', ei: 'z', ui: 'v',
    ao: 'c', ou: 'b',
    an: 'j', en: 'f', in: 'n', un: 'p', vn: 'y',
    ang: 'h', eng: 'g', ing: 'y', ong: 's',
    ia: 'x', iao: 'c', ie: 'x', iu: 'q',
    ua: 'x', uo: 'o', uai: 'y', uan: 'r', uang: 'l',
    iong: 's', iang: 'l', ian: 'j',
    ue: 't', ve: 't',
    er: 'r',
  },
  specials: {
    a: 'aa',
    o: 'oo',
    e: 'ee',
  },
  zeroInitialFinals: {
    a: 'aa', o: 'oo', e: 'ee',
    ai: 'ai', an: 'an', ang: 'ah', ao: 'ao',
    ei: 'ei', en: 'en', eng: 'eg', er: 'er',
    ou: 'ou',
  },
}
```

- [ ] **Step 10: Run tests, pass**

Run: `npx vitest run src/data/ziranma.test.ts`
Expected: PASS

- [ ] **Step 11: Create unified schemes index**

```ts
// src/data/schemes.ts
import { xiaohe } from './xiaohe'
import { sougou } from './sougou'
import { microsoft } from './microsoft'
import { ziranma } from './ziranma'
import type { ShuangpinScheme } from '../types'

export const schemes: ShuangpinScheme[] = [xiaohe, sougou, microsoft, ziranma]

export function getSchemeById(id: string): ShuangpinScheme | undefined {
  return schemes.find(s => s.id === id)
}
```

```ts
// src/data/schemes.test.ts
import { describe, it, expect } from 'vitest'
import { schemes, getSchemeById } from './schemes'

describe('schemes index', () => {
  it('exports all four schemes', () => {
    const ids = schemes.map(s => s.id)
    expect(ids).toEqual(['xiaohe', 'sougou', 'microsoft', 'ziranma'])
  })

  it('getSchemeById finds by id', () => {
    expect(getSchemeById('xiaohe')?.name).toBe('小鹤')
    expect(getSchemeById('invalid')).toBeUndefined()
  })
})
```

- [ ] **Step 12: Update getAvailableSchemes to use the index**

Edit `src/utils/shuangpin.ts` — replace the `getAvailableSchemes` function:

```ts
import { schemes } from '../data/schemes'

// ... existing code ...

export function getAvailableSchemes(): ShuangpinScheme[] {
  return schemes
}
```

Remove the previous import of `xiaohe` from `'../data/xiaohe'` if it's no longer directly used (but it IS still used for the `parsePinyin` tests, so keep both imports or just use `schemes`).

- [ ] **Step 13: Run all scheme tests**

Run: `npx vitest run src/data/`
Expected: All tests pass

- [ ] **Step 14: Commit**

```bash
git add src/data/ src/utils/shuangpin.ts
git commit -m "feat: add sougou, microsoft, ziranma schemes"
```

---

### Task 6: Create lesson data with exercises

**Files:**
- Create: `src/data/lessons.ts`
- Create: `src/data/lessons.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from 'vitest'
import { lessons } from './lessons'

describe('lessons', () => {
  it('has at least 4 lessons', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(4)
  })

  it('each lesson has required fields', () => {
    for (const lesson of lessons) {
      expect(lesson.id).toBeTruthy()
      expect(lesson.title).toBeTruthy()
      expect(lesson.schemeId).toBe('xiaohe')
      expect(lesson.exercises.length).toBeGreaterThan(0)
    }
  })

  it('lesson ids are unique', () => {
    const ids = lessons.map(l => l.id)
    const unique = new Set(ids)
    expect(ids.length).toBe(unique.size)
  })

  it('prerequisites reference valid lesson ids', () => {
    const ids = new Set(lessons.map(l => l.id))
    for (const lesson of lessons) {
      for (const prereq of lesson.prerequisites) {
        expect(ids.has(prereq)).toBe(true)
      }
    }
  })

  it('each exercise has prompt and answer', () => {
    for (const lesson of lessons) {
      for (const ex of lesson.exercises) {
        expect(ex.prompt).toBeTruthy()
        expect(ex.answer).toBeTruthy()
        expect(ex.answer.length).toBeGreaterThanOrEqual(2)
      }
    }
  })
})
```

- [ ] **Step 2: Run to fail**

Run: `npx vitest run src/data/lessons.test.ts`
Expected: FAIL

- [ ] **Step 3: Create src/data/lessons.ts with the first few lessons**

```ts
import type { Lesson } from '../types'

const schemeId = 'xiaohe'

export const lessons: Lesson[] = [
  {
    id: 'initials-zh-ch-sh',
    title: '声母 zh ch sh',
    description: '学习 zh/ch/sh 的键位映射',
    schemeId,
    prerequisites: [],
    exercises: [
      { prompt: 'zha', answer: 'va', type: 'syllable' },
      { prompt: 'zhe', answer: 've', type: 'syllable' },
      { prompt: 'zhi', answer: 'vi', type: 'syllable' },
      { prompt: 'zhu', answer: 'vu', type: 'syllable' },
      { prompt: 'cha', answer: 'ia', type: 'syllable' },
      { prompt: 'che', answer: 'ie', type: 'syllable' },
      { prompt: 'chi', answer: 'ii', type: 'syllable' },
      { prompt: 'chu', answer: 'iu', type: 'syllable' },
      { prompt: 'sha', answer: 'ua', type: 'syllable' },
      { prompt: 'she', answer: 'ue', type: 'syllable' },
      { prompt: 'shi', answer: 'ui', type: 'syllable' },
      { prompt: 'shu', answer: 'uu', type: 'syllable' },
    ],
  },
  {
    id: 'finals-ang-eng-ong',
    title: '韵母 ang eng ong ing',
    description: '学习 ang/eng/ong/ing 的键位映射',
    schemeId,
    prerequisites: ['initials-zh-ch-sh'],
    exercises: [
      { prompt: 'dang', answer: 'dh', type: 'syllable' },
      { prompt: 'teng', answer: 'tg', type: 'syllable' },
      { prompt: 'long', answer: 'ls', type: 'syllable' },
      { prompt: 'ming', answer: 'mk', type: 'syllable' },
      { prompt: 'zhang', answer: 'vh', type: 'syllable' },
      { prompt: 'cheng', answer: 'ig', type: 'syllable' },
      { prompt: 'shang', answer: 'uh', type: 'syllable' },
      { prompt: 'zong', answer: 'zs', type: 'syllable' },
      { prompt: 'xing', answer: 'xk', type: 'syllable' },
      { prompt: 'fang', answer: 'fh', type: 'syllable' },
    ],
  },
  {
    id: 'finals-ian-iao-uan-uai',
    title: '韵母 ian iao uan uai',
    description: '学习 ian/iao/uan/uai 的键位映射',
    schemeId,
    prerequisites: ['initials-zh-ch-sh'],
    exercises: [
      { prompt: 'nian', answer: 'nj', type: 'syllable' },
      { prompt: 'biao', answer: 'bn', type: 'syllable' },
      { prompt: 'tiao', answer: 'tn', type: 'syllable' },
      { prompt: 'jiao', answer: 'jn', type: 'syllable' },
      { prompt: 'qian', answer: 'qj', type: 'syllable' },
      { prompt: 'xian', answer: 'xj', type: 'syllable' },
      { prompt: 'duan', answer: 'dr', type: 'syllable' },
      { prompt: 'shuan', answer: 'ur', type: 'syllable' },
      { prompt: 'kuai', answer: 'kk', type: 'syllable' },
      { prompt: 'guai', answer: 'gk', type: 'syllable' },
    ],
  },
  {
    id: 'finals-ai-ei-ui-ou',
    title: '韵母 ai ei ui ou',
    description: '学习 ai/ei/ui/ou 的键位映射',
    schemeId,
    prerequisites: ['initials-zh-ch-sh'],
    exercises: [
      { prompt: 'bai', answer: 'bd', type: 'syllable' },
      { prompt: 'pei', answer: 'pw', type: 'syllable' },
      { prompt: 'dui', answer: 'dv', type: 'syllable' },
      { prompt: 'gui', answer: 'gv', type: 'syllable' },
      { prompt: 'dou', answer: 'db', type: 'syllable' },
      { prompt: 'mou', answer: 'mb', type: 'syllable' },
      { prompt: 'shou', answer: 'ub', type: 'syllable' },
      { prompt: 'tou', answer: 'tb', type: 'syllable' },
    ],
  },
  {
    id: 'finals-iu-in-un-vn',
    title: '韵母 iu in un vn',
    description: '学习 iu/in/un/vn 的键位映射',
    schemeId,
    prerequisites: ['initials-zh-ch-sh'],
    exercises: [
      { prompt: 'liu', answer: 'lq', type: 'syllable' },
      { prompt: 'jiu', answer: 'jq', type: 'syllable' },
      { prompt: 'niu', answer: 'nq', type: 'syllable' },
      { prompt: 'qiu', answer: 'qq', type: 'syllable' },
      { prompt: 'bin', answer: 'bb', type: 'syllable' },
      { prompt: 'pin', answer: 'pb', type: 'syllable' },
      { prompt: 'min', answer: 'mb', type: 'syllable' },
      { prompt: 'nin', answer: 'nb', type: 'syllable' },
      { prompt: 'lun', answer: 'lp', type: 'syllable' },
      { prompt: 'cun', answer: 'cp', type: 'syllable' },
      { prompt: 'dun', answer: 'dp', type: 'syllable' },
      { prompt: 'jun', answer: 'jy', type: 'syllable' },
      { prompt: 'qun', answer: 'qy', type: 'syllable' },
      { prompt: 'xun', answer: 'xy', type: 'syllable' },
    ],
  },
  {
    id: 'zero-initial',
    title: '零声母音节',
    description: '学习零声母音节的输入方法',
    schemeId,
    prerequisites: ['initials-zh-ch-sh'],
    exercises: [
      { prompt: 'an', answer: 'an', type: 'syllable' },
      { prompt: 'en', answer: 'en', type: 'syllable' },
      { prompt: 'ang', answer: 'ah', type: 'syllable' },
      { prompt: 'eng', answer: 'eg', type: 'syllable' },
      { prompt: 'er', answer: 'er', type: 'syllable' },
      { prompt: 'ou', answer: 'ou', type: 'syllable' },
      { prompt: 'ai', answer: 'ai', type: 'syllable' },
      { prompt: 'ao', answer: 'ao', type: 'syllable' },
    ],
  },
  {
    id: 'mixed-1',
    title: '综合练习一',
    description: '综合练习前面学过的所有音节',
    schemeId,
    prerequisites: ['finals-ang-eng-ong', 'finals-ian-iao-uan-uai', 'finals-ai-ei-ui-ou', 'finals-iu-in-un-vn', 'zero-initial'],
    exercises: [
      { prompt: 'zhong', answer: 'vs', type: 'syllable' },
      { prompt: 'qiang', answer: 'ql', type: 'syllable' },
      { prompt: 'xue', answer: 'xt', type: 'syllable' },
      { prompt: 'shuang', answer: 'ul', type: 'syllable' },
      { prompt: 'dian', answer: 'dj', type: 'syllable' },
      { prompt: 'pian', answer: 'pj', type: 'syllable' },
      { prompt: 'tuan', answer: 'tr', type: 'syllable' },
      { prompt: 'jiong', answer: 'js', type: 'syllable' },
      { prompt: 'chuang', answer: 'il', type: 'syllable' },
      { prompt: 'miao', answer: 'mn', type: 'syllable' },
      { prompt: 'nian', answer: 'nj', type: 'syllable' },
      { prompt: 'kuai', answer: 'kk', type: 'syllable' },
    ],
  },
  {
    id: 'words-daily',
    title: '日常词组',
    description: '练习常用双字词',
    schemeId,
    prerequisites: ['mixed-1'],
    exercises: [
      { prompt: 'zhong guo', answer: 'vs go', type: 'word' },
      { prompt: 'dian nao', answer: 'dj nc', type: 'word' },
      { prompt: 'xue xi', answer: 'xt xi', type: 'word' },
      { prompt: 'peng you', answer: 'pg yb', type: 'word' },
      { prompt: 'tian qi', answer: 'tj qi', type: 'word' },
      { prompt: 'kai shi', answer: 'kd ui', type: 'word' },
      { prompt: 'jian dan', answer: 'jj dj', type: 'word' },
      { prompt: 'fang bian', answer: 'fh bj', type: 'word' },
      { prompt: 'shang ban', answer: 'uh bj', type: 'word' },
      { prompt: 'hui jia', answer: 'hv jx', type: 'word' },
    ],
  },
]
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/data/lessons.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/lessons.ts src/data/lessons.test.ts
git commit -m "feat: add lesson data with exercises"
```

---

### Task 7: Build the typing engine hooks

**Files:**
- Create: `src/hooks/useTyping.ts`
- Create: `src/hooks/useTyping.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTyping } from './useTyping'
import type { Exercise } from '../types'

const mockExercises: Exercise[] = [
  { prompt: 'zhong', answer: 'vs', type: 'syllable' },
  { prompt: 'guo', answer: 'go', type: 'syllable' },
  { prompt: 'ren', answer: 'rf', type: 'syllable' },
]

describe('useTyping', () => {
  it('initializes with first exercise', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    expect(result.current.currentExercise?.prompt).toBe('zhong')
    expect(result.current.currentIndex).toBe(0)
    expect(result.current.isComplete).toBe(false)
  })

  it('tracks input for current exercise', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    act(() => result.current.setInput('v'))
    expect(result.current.input).toBe('v')
  })

  it('submits correct answer and moves forward', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    act(() => {
      result.current.submitAnswer('vs')
    })
    expect(result.current.currentIndex).toBe(1)
    expect(result.current.results.length).toBe(1)
    expect(result.current.results[0]?.correct).toBe(true)
    expect(result.current.lastResult?.correct).toBe(true)
  })

  it('submits incorrect answer and moves forward', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    act(() => {
      result.current.submitAnswer('xx')
    })
    expect(result.current.currentIndex).toBe(1)
    expect(result.current.results[0]?.correct).toBe(false)
    expect(result.current.lastResult?.correct).toBe(false)
  })

  it('reports isComplete when all exercises done', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    act(() => result.current.submitAnswer('vs'))
    act(() => result.current.submitAnswer('go'))
    act(() => result.current.submitAnswer('rf'))
    expect(result.current.isComplete).toBe(true)
  })

  it('calculates accuracy', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    expect(result.current.accuracy).toBe(0)
    act(() => result.current.submitAnswer('vs'))
    act(() => result.current.submitAnswer('xx'))
    act(() => result.current.submitAnswer('rf'))
    expect(result.current.accuracy).toBeCloseTo(2 / 3)
  })

  it('resets correctly', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    act(() => result.current.submitAnswer('vs'))
    act(() => result.current.submitAnswer('go'))
    act(() => { result.current.reset() })
    expect(result.current.currentIndex).toBe(0)
    expect(result.current.results).toEqual([])
    expect(result.current.input).toBe('')
  })
})
```

- [ ] **Step 2: Run to fail**

Run: `npx vitest run src/hooks/useTyping.test.ts`
Expected: FAIL

- [ ] **Step 3: Create src/hooks/useTyping.ts**

```ts
import { useState, useCallback, useMemo } from 'react'
import type { Exercise, ExerciseResult } from '../types'

interface TypingState {
  currentIndex: number
  input: string
  results: ExerciseResult[]
  isComplete: boolean
}

export function useTyping(exercises: Exercise[]) {
  const [state, setState] = useState<TypingState>({
    currentIndex: 0,
    input: '',
    results: [],
    isComplete: false,
  })

  const currentExercise = useMemo(
    () => exercises[state.currentIndex] ?? null,
    [exercises, state.currentIndex],
  )

  const setInput = useCallback((input: string) => {
    setState(prev => ({ ...prev, input }))
  }, [])

  const submitAnswer = useCallback((input: string) => {
    setState(prev => {
      const exercise = exercises[prev.currentIndex]
      if (!exercise) return prev

      const result: ExerciseResult = {
        exercise,
        input,
        correct: input === exercise.answer,
        timeMs: 0, // timer not implemented yet
      }

      const nextIndex = prev.currentIndex + 1
      const isComplete = nextIndex >= exercises.length

      return {
        currentIndex: nextIndex,
        input: '',
        results: [...prev.results, result],
        isComplete,
      }
    })
  }, [exercises])

  const reset = useCallback(() => {
    setState({
      currentIndex: 0,
      input: '',
      results: [],
      isComplete: false,
    })
  }, [])

  const accuracy = useMemo(() => {
    if (state.results.length === 0) return 0
    const correct = state.results.filter(r => r.correct).length
    return correct / state.results.length
  }, [state.results])

  const lastResult = useMemo(
    () => state.results[state.results.length - 1] ?? null,
    [state.results],
  )

  return {
    currentExercise,
    currentIndex: state.currentIndex,
    input: state.input,
    results: state.results,
    isComplete: state.isComplete,
    accuracy,
    lastResult,
    setInput,
    submitAnswer,
    reset,
  }
}
```

- [ ] **Step 4: Run tests, fix, pass**

Run: `npx vitest run src/hooks/useTyping.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTyping.ts src/hooks/useTyping.test.ts
git commit -m "feat: implement useTyping hook"
```

---

### Task 8: Build keyboard visualization component

**Files:**
- Create: `src/components/Keyboard/Keyboard.tsx`
- Create: `src/components/Keyboard/Keyboard.module.css`
- Create: `src/components/Keyboard/Keyboard.test.tsx`

- [ ] **Step 1: Write the component test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Keyboard } from './Keyboard'

describe('Keyboard', () => {
  const baseProps = {
    highlightKeys: [] as string[],
    schemeLabels: {} as Record<string, string>,
    onKeyPress: () => {},
  }

  it('renders standard keyboard layout', () => {
    render(<Keyboard {...baseProps} />)
    // Top row should include q w e r t y u i o p
    expect(screen.getByText('q')).toBeInTheDocument()
    expect(screen.getByText('p')).toBeInTheDocument()
    // Home row: a s d f g h j k l
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('l')).toBeInTheDocument()
    // Bottom row: z x c v b n m
    expect(screen.getByText('z')).toBeInTheDocument()
    expect(screen.getByText('m')).toBeInTheDocument()
  })

  it('highlights specified keys', () => {
    const { container } = render(
      <Keyboard {...baseProps} highlightKeys={['a', 's']} />,
    )
    const keys = container.querySelectorAll('[data-highlighted="true"]')
    expect(keys.length).toBe(2)
  })

  it('shows scheme labels on keys', () => {
    render(
      <Keyboard
        {...baseProps}
        schemeLabels={{ v: 'zh', i: 'ch', u: 'sh' }}
      />,
    )
    expect(screen.getByText('zh')).toBeInTheDocument()
    expect(screen.getByText('ch')).toBeInTheDocument()
  })

  it('calls onKeyPress when a key is clicked', () => {
    const onKeyPress = vi.fn()
    render(<Keyboard {...baseProps} onKeyPress={onKeyPress} />)
    screen.getByText('a').click()
    expect(onKeyPress).toHaveBeenCalledWith('a')
  })
})
```

- [ ] **Step 2: Run to fail**

Run: `npx vitest run src/components/Keyboard/`
Expected: FAIL

- [ ] **Step 3: Create Keyboard.module.css**

```css
.keyboard {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: #d7d7d7;
  border-radius: var(--radius-lg);
  user-select: none;
}

.row {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.spacer {
  width: 24px;
}

.keyWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.key {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
  box-shadow: 0 2px 0 #b3b3b3;
  transition: transform 0.05s, box-shadow 0.05s;
  cursor: pointer;
  line-height: 1;
}

.key:active {
  transform: translateY(2px);
  box-shadow: none;
}

.key.highlighted {
  background: var(--color-green);
  color: white;
  box-shadow: 0 2px 0 #46a302;
}

.schemeLabel {
  font-size: 10px;
  color: var(--color-text-secondary);
  margin-top: 2px;
  font-weight: 400;
}
```

- [ ] **Step 4: Create Keyboard.tsx**

```tsx
import type { KeyboardEvent, MouseEvent } from 'react'
import styles from './Keyboard.module.css'

interface KeyboardProps {
  highlightKeys: string[]
  schemeLabels: Record<string, string>
  onKeyPress: (key: string) => void
}

const KEY_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

export function Keyboard({ highlightKeys, schemeLabels, onKeyPress }: KeyboardProps) {
  const highlightSet = new Set(highlightKeys)

  const handleClick = (key: string) => (e: MouseEvent) => {
    e.currentTarget.blur()
    onKeyPress(key)
  }

  const handleKeyDown = (key: string) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onKeyPress(key)
    }
  }

  return (
    <div className={styles.keyboard} role="group" aria-label="键盘">
      {KEY_ROWS.map((row, ri) => (
        <div key={ri} className={styles.row}>
          {ri === 2 && <div className={styles.spacer} />}
          {row.map(k => (
            <div key={k} className={styles.keyWrapper}>
              <button
                className={`${styles.key} ${highlightSet.has(k) ? styles.highlighted : ''}`}
                data-highlighted={highlightSet.has(k)}
                onClick={handleClick(k)}
                onKeyDown={handleKeyDown(k)}
                aria-label={`键 ${k}`}
                aria-pressed={highlightSet.has(k)}
              >
                {k}
              </button>
              {schemeLabels[k] && (
                <span className={styles.schemeLabel}>{schemeLabels[k]}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Run tests, fix, pass**

Run: `npx vitest run src/components/Keyboard/`
Expected: PASS (add `// eslint-disable-next-line @typescript-eslint/no-unused-vars` if e params trigger linting, or prefix with `_`)

- [ ] **Step 6: Commit**

```bash
git add src/components/Keyboard/
git commit -m "feat: add Keyboard visualization component"
```

---

### Task 9: Build the Exercise (typing practice) component

**Files:**
- Create: `src/components/Exercise/Exercise.tsx`
- Create: `src/components/Exercise/Exercise.module.css`
- Create: `src/components/Exercise/Exercise.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Exercise } from './Exercise'
import type { Exercise as ExerciseType } from '../../types'

const mockExercises: ExerciseType[] = [
  { prompt: 'zhong', answer: 'vs', type: 'syllable' },
  { prompt: 'guo', answer: 'go', type: 'syllable' },
]

describe('Exercise', () => {
  it('displays the current prompt', () => {
    render(<Exercise exercises={mockExercises} onComplete={vi.fn()} />)
    expect(screen.getByText('zhong')).toBeInTheDocument()
  })

  it('shows progress (1/2)', () => {
    render(<Exercise exercises={mockExercises} onComplete={vi.fn()} />)
    expect(screen.getByText(/1.*2/)).toBeInTheDocument()
  })

  it('accepts typed input', () => {
    render(<Exercise exercises={mockExercises} onComplete={vi.fn()} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'v' } })
    expect(input).toHaveValue('v')
  })

  it('submits on Enter key', () => {
    const onComplete = vi.fn()
    render(<Exercise exercises={mockExercises} onComplete={onComplete} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'vs' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    // After first exercise, should show second prompt
    expect(screen.getByText('guo')).toBeInTheDocument()
  })

  it('shows correct/incorrect feedback', () => {
    render(<Exercise exercises={mockExercises} onComplete={vi.fn()} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'vs' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    // First answer was correct - should show green feedback
    expect(screen.getByText('正确!')).toBeInTheDocument()
  })

  it('shows completion screen after all exercises', () => {
    render(<Exercise exercises={mockExercises} onComplete={vi.fn()} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'vs' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.change(input, { target: { value: 'go' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/完成|complet/i)).toBeInTheDocument()
  })

  it('shows keyboard with highlighted keys for current exercise', () => {
    render(<Exercise exercises={mockExercises} onComplete={vi.fn()} />)
    // The render should include keyboard; verify the keyboard is present
    expect(screen.getByRole('group', { name: '键盘' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to fail**

Run: `npx vitest run src/components/Exercise/`
Expected: FAIL

- [ ] **Step 3: Create Exercise.module.css**

```css
.exerciseContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 16px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.progressSection {
  width: 100%;
  text-align: center;
}

.progressBar {
  width: 100%;
  height: 12px;
  background: var(--color-border);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progressFill {
  height: 100%;
  background: var(--color-green);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progressText {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.promptCard {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 40px 32px;
  box-shadow: var(--shadow-md);
  text-align: center;
  width: 100%;
}

.prompt {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 24px;
  letter-spacing: 4px;
}

.inputSection {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.input {
  width: 200px;
  padding: 12px 16px;
  font-size: 24px;
  text-align: center;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  font-family: var(--font-sans);
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--color-blue);
}

.inputCorrect {
  border-color: var(--color-correct);
  background: #eafbea;
}

.inputIncorrect {
  border-color: var(--color-incorrect);
  background: #ffeaea;
}

.hint {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.feedback {
  font-size: 18px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  animation: fadeIn 0.3s ease;
}

.feedbackCorrect {
  color: var(--color-correct);
}

.feedbackIncorrect {
  color: var(--color-incorrect);
}

.completionCard {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 48px 32px;
  box-shadow: var(--shadow-md);
  text-align: center;
  width: 100%;
}

.completionTitle {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-green);
  margin-bottom: 16px;
}

.completionStats {
  font-size: 18px;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.continueButton {
  background: var(--color-green);
  color: white;
  padding: 14px 48px;
  border-radius: var(--radius-md);
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 4px 0 var(--color-green-hover);
  transition: transform 0.05s, box-shadow 0.05s;
}

.continueButton:active {
  transform: translateY(4px);
  box-shadow: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .prompt {
    font-size: 36px;
  }
  .promptCard {
    padding: 24px 16px;
  }
}
```

- [ ] **Step 4: Create Exercise.tsx**

```tsx
import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { useTyping } from '../../hooks/useTyping'
import { Keyboard } from '../Keyboard/Keyboard'
import type { Exercise as ExerciseType, ShuangpinScheme } from '../../types'
import styles from './Exercise.module.css'

interface ExerciseProps {
  exercises: ExerciseType[]
  scheme: ShuangpinScheme
  onComplete: (results: { correct: number; total: number; accuracy: number }) => void
  onBack: () => void
}

export function Exercise({ exercises, scheme, onComplete, onBack }: ExerciseProps) {
  const {
    currentExercise,
    currentIndex,
    input,
    setInput,
    submitAnswer,
    isComplete,
    accuracy,
    lastResult,
    results,
    reset,
  } = useTyping(exercises)

  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentIndex])

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return
    const trimmed = input.trim().toLowerCase()
    const isCorrect = trimmed === currentExercise?.answer
    submitAnswer(trimmed)
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setTimeout(() => setFeedback(null), 800)
  }, [input, currentExercise, submitAnswer])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSubmit()
    },
    [handleSubmit],
  )

  const handleContinue = useCallback(() => {
    onComplete({
      correct: results.filter(r => r.correct).length,
      total: results.length,
      accuracy,
    })
  }, [results, accuracy, onComplete])

  const handleKeyPress = useCallback(
    (key: string) => {
      setInput(input + key)
    },
    [input, setInput],
  )

  const highlightKeys = useMemo(() => {
    if (!currentExercise) return []
    return currentExercise.answer.split('')
  }, [currentExercise])

  const schemeLabels = useMemo(() => {
    const labels: Record<string, string> = {}
    // Add initial labels (zh→v means v key shows 声zh)
    for (const [pinyin, key] of Object.entries(scheme.initials)) {
      labels[key] = labels[key]
        ? `${labels[key]} ${pinyin}`
        : pinyin
    }
    // Add final labels
    for (const [pinyin, key] of Object.entries(scheme.finals)) {
      if (pinyin.length > 1 && key.length === 1) {
        labels[key] = labels[key]
          ? `${labels[key]} ${pinyin}`
          : pinyin
      }
    }
    return labels
  }, [scheme])

  if (isComplete) {
    const correctCount = results.filter(r => r.correct).length
    return (
      <div className={styles.exerciseContainer}>
        <div className={styles.completionCard}>
          <div className={styles.completionTitle}>太棒了!</div>
          <div className={styles.completionStats}>
            {correctCount}/{results.length} 正确
            {' · '}
            {Math.round(accuracy * 100)}% 准确率
          </div>
          <button className={styles.continueButton} onClick={handleContinue}>
            继续
          </button>
        </div>
      </div>
    )
  }

  if (!currentExercise) return null

  return (
    <div className={styles.exerciseContainer}>
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(currentIndex / exercises.length) * 100}%` }}
          />
        </div>
        <span className={styles.progressText}>
          {currentIndex + 1} / {exercises.length}
        </span>
      </div>

      <div className={styles.promptCard}>
        <div className={styles.prompt}>{currentExercise.prompt}</div>

        <div className={styles.inputSection}>
          <input
            ref={inputRef}
            className={`${styles.input} ${
              feedback === 'correct' ? styles.inputCorrect : ''
            } ${feedback === 'incorrect' ? styles.inputIncorrect : ''}`}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入双拼..."
            autoComplete="off"
            aria-label="输入双拼"
          />
          {feedback && (
            <div
              className={`${styles.feedback} ${
                feedback === 'correct'
                  ? styles.feedbackCorrect
                  : styles.feedbackIncorrect
              }`}
            >
              {feedback === 'correct' ? '正确!' : `正确: ${currentExercise.answer}`}
            </div>
          )}
          <span className={styles.hint}>按 Enter 提交</span>
        </div>
      </div>

      <Keyboard
        highlightKeys={highlightKeys}
        schemeLabels={schemeLabels}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}
```

- [ ] **Step 5: Run tests, fix, pass**

Run: `npx vitest run src/components/Exercise/`
Expected: MAY FAIL due to missing `onBack` prop in test — update test:

```tsx
const baseProps = {
  exercises: mockExercises,
  scheme: { id: 'xiaohe', name: '小鹤', description: '', initials: { zh: 'v' }, finals: { ong: 's' }, specials: {}, zeroInitialFinals: {} },
  onComplete: vi.fn(),
  onBack: vi.fn(),
}
render(<Exercise {...baseProps} />)
```

Run: `npx vitest run src/components/Exercise/`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/Exercise/
git commit -m "feat: add Exercise typing practice component"
```

---

### Task 10: Build LessonPath home screen (Duolingo-style)

**Files:**
- Create: `src/components/LessonPath/LessonPath.tsx`
- Create: `src/components/LessonPath/LessonPath.module.css`
- Create: `src/components/LessonPath/LessonPath.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LessonPath } from './LessonPath'
import type { Lesson } from '../../types'

const mockLessons: Lesson[] = [
  { id: 'l1', title: '声母', description: '练习声母', schemeId: 'xiaohe', exercises: [], prerequisites: [] },
  { id: 'l2', title: '韵母', description: '练习韵母', schemeId: 'xiaohe', exercises: [], prerequisites: ['l1'] },
  { id: 'l3', title: '进阶', description: '进阶练习', schemeId: 'xiaohe', exercises: [], prerequisites: ['l2'] },
]

describe('LessonPath', () => {
  it('renders all lessons', () => {
    render(
      <LessonPath
        lessons={mockLessons}
        progress={{}}
        onSelectLesson={vi.fn()}
      />,
    )
    expect(screen.getByText('声母')).toBeInTheDocument()
    expect(screen.getByText('韵母')).toBeInTheDocument()
    expect(screen.getByText('进阶')).toBeInTheDocument()
  })

  it('shows first lesson as unlocked when no progress', () => {
    render(
      <LessonPath
        lessons={mockLessons}
        progress={{}}
        onSelectLesson={vi.fn()}
      />,
    )
    expect(screen.getByText('声母').closest('button')).not.toBeDisabled()
  })

  it('shows locked lesson as disabled', () => {
    render(
      <LessonPath
        lessons={mockLessons}
        progress={{}}
        onSelectLesson={vi.fn()}
      />,
    )
    // l2 requires l1 which is not complete
    expect(screen.getByText('韵母').closest('button')).toBeDisabled()
  })

  it('unlocks next lesson when prerequisite is complete', () => {
    render(
      <LessonPath
        lessons={mockLessons}
        progress={{ l1: { lessonId: 'l1', completed: true, bestAccuracy: 1, bestWpm: 0, attempts: 1, lastPracticed: '2024-01-01' } }}
        onSelectLesson={vi.fn()}
      />,
    )
    expect(screen.getByText('韵母').closest('button')).not.toBeDisabled()
  })

  it('shows completion checkmark for completed lessons', () => {
    render(
      <LessonPath
        lessons={mockLessons}
        progress={{ l1: { lessonId: 'l1', completed: true, bestAccuracy: 1, bestWpm: 0, attempts: 1, lastPracticed: '2024-01-01' } }}
        onSelectLesson={vi.fn()}
      />,
    )
    const completed = screen.getByText('声母')
    const card = completed.closest('[data-completed]')
    expect(card).toHaveAttribute('data-completed', 'true')
  })
})
```

- [ ] **Step 2: Run to fail**

Run: `npx vitest run src/components/LessonPath/`
Expected: FAIL

- [ ] **Step 3: Create LessonPath.module.css**

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  gap: 8px;
  max-width: 500px;
  margin: 0 auto;
}

.connector {
  width: 4px;
  height: 24px;
  background: var(--color-border);
  border-radius: 2px;
}

.connectorCompleted {
  background: var(--color-green);
}

.lessonCard {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px 24px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  text-align: left;
  border: 2px solid transparent;
}

.lessonCard:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.lessonCard:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lessonCard.completed {
  border-color: var(--color-green);
}

.lessonCard.active {
  border-color: var(--color-green);
  background: #f0fdf0;
}

.icon {
  font-size: 28px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  border-radius: 50%;
  flex-shrink: 0;
}

.iconCompleted {
  background: var(--color-green);
  color: white;
}

.lessonInfo {
  flex: 1;
}

.title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 2px;
}

.description {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.chevron {
  color: #ccc;
  font-size: 18px;
}
```

- [ ] **Step 4: Create LessonPath.tsx**

```tsx
import { useMemo } from 'react'
import type { Lesson, LessonProgress } from '../../types'
import styles from './LessonPath.module.css'

interface LessonPathProps {
  lessons: Lesson[]
  progress: Record<string, LessonProgress>
  onSelectLesson: (lessonId: string) => void
}

export function LessonPath({ lessons, progress, onSelectLesson }: LessonPathProps) {
  const completedIds = useMemo(
    () => new Set(
      Object.values(progress)
        .filter(p => p.completed)
        .map(p => p.lessonId),
    ),
    [progress],
  )

  const isUnlocked = (lesson: Lesson): boolean =>
    lesson.prerequisites.every(p => completedIds.has(p))

  return (
    <div className={styles.container}>
      {lessons.map((lesson, i) => {
        const completed = completedIds.has(lesson.id)
        const unlocked = isUnlocked(lesson)

        return (
          <div key={lesson.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {i > 0 && (
              <div
                className={`${styles.connector} ${completed ? styles.connectorCompleted : ''}`}
              />
            )}
            <button
              className={`${styles.lessonCard} ${completed ? styles.completed : ''} ${unlocked && !completed ? styles.active : ''}`}
              disabled={!unlocked}
              onClick={() => onSelectLesson(lesson.id)}
              data-completed={completed}
            >
              <div className={`${styles.icon} ${completed ? styles.iconCompleted : ''}`}>
                {completed ? '✓' : String(i + 1)}
              </div>
              <div className={styles.lessonInfo}>
                <div className={styles.title}>{lesson.title}</div>
                <div className={styles.description}>{lesson.description}</div>
              </div>
              <span className={styles.chevron}>{'>'}</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 5: Run tests, fix, pass**

Run: `npx vitest run src/components/LessonPath/`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/LessonPath/
git commit -m "feat: add Duolingo-style LessonPath component"
```

---

### Task 11: Build progress persistence hook

**Files:**
- Create: `src/hooks/useProgress.ts`
- Create: `src/hooks/useProgress.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress'

const mockStorage = () => {
  const store: Record<string, string> = {}
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(k => store[k] ?? null)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => { store[k] = v })
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(k => { delete store[k] })
}

describe('useProgress', () => {
  beforeEach(() => {
    mockStorage()
  })

  it('initializes with default stats', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.stats.totalExercisesCompleted).toBe(0)
    expect(result.current.stats.lastPracticeDate).toBeNull()
    expect(result.current.stats.lessonProgress).toEqual({})
  })

  it('saves lesson completion', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.completeLesson('lesson-1', 0.9, 10)
    })
    expect(result.current.stats.lessonProgress['lesson-1']?.completed).toBe(true)
    expect(result.current.stats.lessonProgress['lesson-1']?.bestAccuracy).toBe(0.9)
  })

  it('updates best accuracy on subsequent attempts', () => {
    const { result } = renderHook(() => useProgress())
    act(() => result.current.completeLesson('lesson-1', 0.7, 10))
    act(() => result.current.completeLesson('lesson-1', 0.95, 8))
    expect(result.current.stats.lessonProgress['lesson-1']?.bestAccuracy).toBe(0.95)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useProgress())
    act(() => result.current.completeLesson('lesson-1', 1, 10))

    const saved = JSON.parse(localStorage.getItem('vibe-shuangpin-progress')!)
    expect(saved.lessonProgress['lesson-1']?.completed).toBe(true)
  })

  it('loads existing progress from localStorage', () => {
    localStorage.setItem('vibe-shuangpin-progress', JSON.stringify({
      totalExercisesCompleted: 20,
      lastPracticeDate: '2024-01-15',
      streaks: 5,
      lessonProgress: {
        'lesson-1': { lessonId: 'lesson-1', completed: true, bestAccuracy: 1, bestWpm: 0, attempts: 2, lastPracticed: '2024-01-15' },
      },
    }))

    const { result } = renderHook(() => useProgress())
    expect(result.current.stats.totalExercisesCompleted).toBe(20)
    expect(result.current.stats.lessonProgress['lesson-1']?.attempts).toBe(2)
  })
})
```

- [ ] **Step 2: Run to fail**

Run: `npx vitest run src/hooks/useProgress.test.ts`
Expected: FAIL

- [ ] **Step 3: Create src/hooks/useProgress.ts**

```ts
import { useState, useCallback } from 'react'
import type { UserStats, LessonProgress } from '../types'

const STORAGE_KEY = 'vibe-shuangpin-progress'

function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as UserStats
  } catch {
    // corrupted data, reset
  }
  return {
    streaks: 0,
    lastPracticeDate: null,
    totalExercisesCompleted: 0,
    lessonProgress: {},
  }
}

function saveStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // storage full or unavailable – silently fail
  }
}

export function useProgress() {
  const [stats, setStats] = useState<UserStats>(loadStats)

  const completeLesson = useCallback(
    (lessonId: string, accuracy: number, wpm: number) => {
      setStats(prev => {
        const existing = prev.lessonProgress[lessonId]
        const updated: LessonProgress = {
          lessonId,
          completed: true,
          bestAccuracy: existing
            ? Math.max(existing.bestAccuracy, accuracy)
            : accuracy,
          bestWpm: existing
            ? Math.max(existing.bestWpm, wpm)
            : wpm,
          attempts: (existing?.attempts ?? 0) + 1,
          lastPracticed: new Date().toISOString().split('T')[0] ?? null,
        }

        const today = new Date().toISOString().split('T')[0] ?? ''
        const wasYesterday = prev.lastPracticeDate
          ? isDayBefore(prev.lastPracticeDate, today)
          : false
        const alreadyToday = prev.lastPracticeDate === today

        const next: UserStats = {
          ...prev,
          totalExercisesCompleted: prev.totalExercisesCompleted + 1,
          lastPracticeDate: today,
          streaks: alreadyToday
            ? prev.streaks
            : wasYesterday
              ? prev.streaks + 1
              : prev.lastPracticeDate === null
                ? 1
                : 1, // reset streak (not consecutive)
          lessonProgress: {
            ...prev.lessonProgress,
            [lessonId]: updated,
          },
        }

        saveStats(next)
        return next
      })
    },
    [],
  )

  const resetProgress = useCallback(() => {
    const empty: UserStats = {
      streaks: 0,
      lastPracticeDate: null,
      totalExercisesCompleted: 0,
      lessonProgress: {},
    }
    saveStats(empty)
    setStats(empty)
  }, [])

  return { stats, completeLesson, resetProgress }
}

function isDayBefore(dateA: string, dateB: string): boolean {
  const a = new Date(dateA)
  const b = new Date(dateB)
  const diff = (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)
  return diff >= 1 && diff < 2
}
```

- [ ] **Step 4: Run tests, fix, pass**

Run: `npx vitest run src/hooks/useProgress.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useProgress.ts src/hooks/useProgress.test.ts
git commit -m "feat: add progress persistence with localStorage"
```

---

### Task 12: Build TopBar (streaks, stats, scheme selector)

**Files:**
- Create: `src/components/TopBar/TopBar.tsx`
- Create: `src/components/TopBar/TopBar.module.css`
- Create: `src/components/TopBar/TopBar.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  const baseProps = {
    streak: 5,
    schemeId: 'xiaohe',
    availableSchemes: [
      { id: 'xiaohe', name: '小鹤', description: '' },
      { id: 'sougou', name: '搜狗', description: '' },
    ],
    onSchemeChange: vi.fn(),
  }

  it('shows streak count', () => {
    render(<TopBar {...baseProps} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows current scheme name', () => {
    render(<TopBar {...baseProps} />)
    expect(screen.getByText('小鹤')).toBeInTheDocument()
  })

  it('opens scheme selector on click', () => {
    render(<TopBar {...baseProps} />)
    fireEvent.click(screen.getByText('小鹤'))
    expect(screen.getByText('搜狗')).toBeInTheDocument()
  })

  it('calls onSchemeChange when selecting a scheme', () => {
    const onChange = vi.fn()
    render(<TopBar {...baseProps} onSchemeChange={onChange} />)
    fireEvent.click(screen.getByText('小鹤'))
    fireEvent.click(screen.getByText('搜狗'))
    expect(onChange).toHaveBeenCalledWith('sougou')
  })
})
```

- [ ] **Step 2: Run to fail**

Run: `npx vitest run src/components/TopBar/`
Expected: FAIL

- [ ] **Step 3: Create TopBar.module.css**

```css
.topBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--color-surface);
  border-bottom: 2px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.streak {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  color: var(--color-orange);
}

.streakIcon {
  font-size: 20px;
}

.right {
  position: relative;
}

.schemeButton {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 14px;
  transition: background 0.15s;
}

.schemeButton:hover {
  background: #e5e5e5;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
  min-width: 140px;
  z-index: 20;
}

.dropdownItem {
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  font-size: 14px;
  transition: background 0.1s;
}

.dropdownItem:hover {
  background: var(--color-bg);
}

.dropdownItemActive {
  font-weight: 700;
  color: var(--color-green);
}
```

- [ ] **Step 4: Create TopBar.tsx**

```tsx
import { useState, useRef, useEffect } from 'react'
import type { ShuangpinScheme } from '../../types'
import styles from './TopBar.module.css'

interface TopBarProps {
  streak: number
  schemeId: string
  availableSchemes: Pick<ShuangpinScheme, 'id' | 'name'>[]
  onSchemeChange: (id: string) => void
}

export function TopBar({ streak, schemeId, availableSchemes, onSchemeChange }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentScheme = availableSchemes.find(s => s.id === schemeId)

  return (
    <header className={styles.topBar}>
      <div className={styles.left}>
        <div className={styles.streak}>
          <span className={styles.streakIcon}>🔥</span>
          <span>{streak}</span>
        </div>
      </div>

      <div className={styles.right} ref={ref}>
        <button
          className={styles.schemeButton}
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {currentScheme?.name ?? '选择方案'}
          <span>{open ? '▲' : '▼'}</span>
        </button>

        {open && (
          <div className={styles.dropdown} role="listbox">
            {availableSchemes.map(s => (
              <button
                key={s.id}
                className={`${styles.dropdownItem} ${
                  s.id === schemeId ? styles.dropdownItemActive : ''
                }`}
                onClick={() => {
                  onSchemeChange(s.id)
                  setOpen(false)
                }}
                role="option"
                aria-selected={s.id === schemeId}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
```

- [ ] **Step 5: Run tests, fix, pass**

Run: `npx vitest run src/components/TopBar/`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/TopBar/
git commit -m "feat: add TopBar with streak and scheme selector"
```

---

### Task 13: Wire up the main App with all components

**Files:**
- Modify: `src/components/App/App.tsx`
- Modify: `src/components/App/App.test.tsx`
- Create: `src/components/App/App.module.css`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { App } from './App'

const mockStorage = () => {
  const store: Record<string, string> = {}
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(k => store[k] ?? null)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => { store[k] = v })
}

describe('App', () => {
  beforeEach(() => { mockStorage() })

  it('renders the lesson path screen by default', () => {
    render(<App />)
    // Should show the first lesson title
    expect(screen.getByText('声母 zh ch sh')).toBeInTheDocument()
  })

  it('shows TopBar with streak', () => {
    render(<App />)
    expect(screen.getByText('0')).toBeInTheDocument() // streak starts at 0
  })

  it('allows clicking a lesson to start practicing', () => {
    render(<App />)
    const lesson = screen.getByText('声母 zh ch sh')
    lesson.click()
    // Should now be in the exercise view
    expect(screen.getByText(/输入双拼/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to fail**

Run: `npx vitest run src/components/App/App.test.tsx`
Expected: FAIL (App still shows placeholder)

- [ ] **Step 3: Create App.module.css**

```css
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
```

- [ ] **Step 4: Rewrite App.tsx**

```tsx
import { useState, useCallback, useMemo } from 'react'
import { TopBar } from '../TopBar/TopBar'
import { LessonPath } from '../LessonPath/LessonPath'
import { Exercise } from '../Exercise/Exercise'
import { useProgress } from '../../hooks/useProgress'
import { lessons } from '../../data/lessons'
import { schemes, getSchemeById } from '../../data/schemes'
import styles from './App.module.css'

type Screen =
  | { type: 'home' }
  | { type: 'lesson'; lessonId: string }

export function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'home' })
  const [schemeId, setSchemeId] = useState('xiaohe')
  const { stats, completeLesson } = useProgress()

  const currentScheme = useMemo(
    () => getSchemeById(schemeId) ?? schemes[0]!,
    [schemeId],
  )

  const currentLesson = useMemo(
    () => lessons.find(l => l.id === (screen.type === 'lesson' ? screen.lessonId : undefined)),
    [screen],
  )

  const handleSelectLesson = useCallback((lessonId: string) => {
    setScreen({ type: 'lesson', lessonId })
  }, [])

  const handleComplete = useCallback(
    (result: { correct: number; total: number; accuracy: number }) => {
      if (screen.type === 'lesson') {
        completeLesson(screen.lessonId, result.accuracy, 0)
      }
      setScreen({ type: 'home' })
    },
    [screen, completeLesson],
  )

  const handleBack = useCallback(() => {
    setScreen({ type: 'home' })
  }, [])

  const schemeNames = useMemo(
    () => schemes.map(s => ({ id: s.id, name: s.name })),
    [],
  )

  return (
    <div className={styles.app}>
      <TopBar
        streak={stats.streaks}
        schemeId={schemeId}
        availableSchemes={schemeNames}
        onSchemeChange={setSchemeId}
      />

      <main className={styles.main}>
        {screen.type === 'home' && (
          <LessonPath
            lessons={lessons}
            progress={stats.lessonProgress}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {screen.type === 'lesson' && currentLesson && (
          <Exercise
            exercises={currentLesson.exercises}
            scheme={currentScheme}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Run tests, fix, pass**

Run: `npx vitest run src/components/App/App.test.tsx`
Expected: PASS

- [ ] **Step 6: Run full verification**

Run: `npm run typecheck && npm test && npm run build`
Expected: All pass

- [ ] **Step 7: Commit**

```bash
git add src/components/App/ src/components/TopBar/ src/hooks/
git commit -m "feat: wire up main App with lesson flow and scheme switching"
```

---

### Task 14: Final integration and polish

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Move favicon.svg to public/**

```bash
mv favicon.svg public/favicon.svg
```

- [ ] **Step 2: Verify the complete app builds and runs**

Run: `npm run typecheck && npm test && npm run build`
Expected: All pass

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
```

Open browser to http://localhost:5173.
Verify:
1. Home screen shows lesson list with "声母 zh ch sh" unlocked
2. Click on it → exercise screen shows "zhong" prompt
3. Type "vs" and press Enter → shows "正确!" feedback
4. After completing all exercises → shows completion card with accuracy
5. Click "继续" → back to home, lesson shows as completed
6. Next lesson is now unlocked
7. TopBar shows scheme selector, can switch schemes
8. Streak counter updates

- [ ] **Step 4: Commit**

```bash
git add public/ src/
git commit -m "feat: complete shuangpin practice app MVP"
```

---

## Scope Check

**Spec coverage:**
- 双拼方案支持 小鹤/搜狗/微软/自然码 → Tasks 3, 5
- Duolingo 风格 UI → Tasks 8 (Keyboard), 9 (Exercise), 10 (LessonPath), 12 (TopBar)
- 主流打字练习功能 (逐题练习、进度追踪、准确率、连续天数) → Tasks 6 (lessons), 7 (typing engine), 11 (progress)
- 设计变量/颜色体系 → Task 1 (index.css CSS variables)
- PWA 支持 → Task 1 (vite.config.ts with vite-plugin-pwa)
- 无后端、localStorage 持久化 → Task 11

**Placeholder scan:** All code blocks contain complete, working code.

**Type consistency:** All types defined in Task 2 are used consistently across all subsequent tasks. `ShuangpinScheme`, `Lesson`, `Exercise`, `ExerciseResult`, `LessonProgress`, `UserStats` are referenced consistently.
