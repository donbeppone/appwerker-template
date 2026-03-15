/**
 * Design Token System — Smart Derivation
 *
 * 12 Kern-Tokens werden editiert, ~40 abgeleitete Tokens automatisch berechnet.
 * Kontrastfarben per Luminanz, Dark Mode per Inversion, Radien/Shadows skaliert.
 */

const STORAGE_KEY = 'aw-design-tokens'

// ─── Farb-Hilfsfunktionen ──────────────────────────────────

function hexToRgb(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  }
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('')
}

/** Relative Luminanz (WCAG) */
function luminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/** Kontrastfarbe: Weiß oder Schwarz */
function contrastColor(hex) {
  return luminance(hex) > 0.35 ? '#000000' : '#ffffff'
}

/** Farbe aufhellen (0–1) */
function lighten(hex, amount) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex({
    r: r + (255 - r) * amount,
    g: g + (255 - g) * amount,
    b: b + (255 - b) * amount,
  })
}

/** Farbe abdunkeln (0–1) */
function darken(hex, amount) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex({
    r: r * (1 - amount),
    g: g * (1 - amount),
    b: b * (1 - amount),
  })
}

/** Farbe entsättigen / in Richtung Grau verschieben */
function desaturate(hex, amount) {
  const { r, g, b } = hexToRgb(hex)
  const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return rgbToHex({
    r: r + (gray - r) * amount,
    g: g + (gray - g) * amount,
    b: b + (gray - b) * amount,
  })
}

// ─── Kern-Tokens (editierbar) ──────────────────────────────

export const coreTokenDefaults = {
  primary: '#000000',
  secondary: '#71717a',
  accent: '#2563eb',
  error: '#dc2626',
  success: '#16a34a',
  warning: '#ca8a04',
  info: '#2563eb',
  background: '#fafafa',
  fontFamily: 'Instrument Sans',
  headingFontFamily: 'Instrument Sans',
  radius: 6,          // Basis-Radius in px, sm/lg/xl werden skaliert
  spacing: 16,        // Basis-Abstand in px, xs/sm/md/lg/xl werden skaliert
  baseFontSize: 16,   // Body-Schriftgröße in px
  typeScaleRatio: 1.25, // Skalierung zwischen Überschriften-Ebenen (Major Third)
  typoOverrides: null,  // JSON-String für individuelle Überschreibungen { h1: { fontSize, ... }, ... }
}

// ─── Typografische Skala ─────────────────────────────────

export const typeScalePresets = [
  { title: 'Minor Second (1.067)', value: 1.067 },
  { title: 'Major Second (1.125)', value: 1.125 },
  { title: 'Minor Third (1.200)', value: 1.200 },
  { title: 'Major Third (1.250)', value: 1.250 },
  { title: 'Perfect Fourth (1.333)', value: 1.333 },
  { title: 'Augmented Fourth (1.414)', value: 1.414 },
  { title: 'Perfect Fifth (1.500)', value: 1.500 },
]

/**
 * Typografie-Presets aus Basis-Größe + Skalierungsfaktor ableiten.
 * Individuelle Überschreibungen pro Element möglich.
 */
export function deriveTypography(core) {
  const base = core.baseFontSize || 16
  const ratio = core.typeScaleRatio || 1.25
  const overrides = core.typoOverrides ? (typeof core.typoOverrides === 'string' ? JSON.parse(core.typoOverrides) : core.typoOverrides) : {}

  const defaults = {
    h1: { fontSize: Math.min(Math.round(base * ratio ** 5), 96), lineHeight: 110, weight: 700, font: 'heading' },
    h2: { fontSize: Math.min(Math.round(base * ratio ** 4), 72), lineHeight: 115, weight: 700, font: 'heading' },
    h3: { fontSize: Math.min(Math.round(base * ratio ** 3), 56), lineHeight: 120, weight: 600, font: 'heading' },
    h4: { fontSize: Math.round(base * ratio ** 2), lineHeight: 125, weight: 600, font: 'heading' },
    h5: { fontSize: Math.round(base * ratio), lineHeight: 130, weight: 600, font: 'heading' },
    h6: { fontSize: base, lineHeight: 135, weight: 600, font: 'heading' },
    body: { fontSize: base, lineHeight: 160, weight: 400, font: 'body' },
    small: { fontSize: Math.round(base * 0.875), lineHeight: 150, weight: 400, font: 'body' },
  }

  const result = {}
  for (const [key, def] of Object.entries(defaults)) {
    result[key] = { ...def, ...(overrides[key] || {}) }
  }
  return result
}

/**
 * Aus 12 Kern-Tokens das vollständige Token-Set ableiten
 */
export function deriveTokens(core) {
  const c = { ...coreTokenDefaults, ...core }
  const isDarkBg = luminance(c.background) < 0.2

  // Surface: leicht heller/dunkler als Background
  const surface = isDarkBg ? lighten(c.background, 0.06) : '#ffffff'
  const surfaceRaised = isDarkBg ? lighten(c.background, 0.12) : '#ffffff'
  const text = contrastColor(c.background)
  const textSecondary = isDarkBg ? lighten(c.background, 0.5) : desaturate(darken(c.background, 0.2), 0.3)
  const textMuted = isDarkBg ? lighten(c.background, 0.35) : desaturate(lighten(text, 0.6), 0.5)
  const border = isDarkBg ? lighten(c.background, 0.15) : darken(c.background, 0.12)

  // Radius-Skalierung
  const r = c.radius
  const radiusSm = Math.max(2, Math.round(r * 0.67))
  const radiusLg = Math.round(r * 1.33)
  const radiusXl = Math.round(r * 2)

  // Shadow-Intensität je nach Hintergrund
  const shadowAlpha = isDarkBg ? 0.4 : 0.06

  // Dark Mode: automatisch invertierte Farben
  const darkBg = darken(c.background, 0.9)
  const darkSurface = lighten(darkBg, 0.06)
  const darkSurfaceRaised = lighten(darkBg, 0.12)
  const darkText = lighten(darkBg, 0.95)
  const darkTextSecondary = lighten(darkBg, 0.5)
  const darkTextMuted = lighten(darkBg, 0.35)
  const darkBorder = lighten(darkBg, 0.18)
  // Im Dark Mode: Primary invertieren wenn sie zu dunkel ist
  const darkPrimary = luminance(c.primary) < 0.15 ? '#ffffff' : c.primary
  // Status-Farben im Dark Mode leicht aufhellen
  const darkError = lighten(c.error, 0.15)
  const darkSuccess = lighten(c.success, 0.15)
  const darkWarning = lighten(c.warning, 0.2)
  const darkInfo = lighten(c.info, 0.15)

  // Sidebar-BG aus Background ableiten — immer kontrastreich
  const sidebarBg = isDarkBg
    ? lighten(c.background, 0.08)
    : darken(c.background, 0.85)
  const isSidebarDark = luminance(sidebarBg) < 0.2

  return {
    // Kern (gespeichert)
    core: c,

    // ── Light Mode ──
    light: {
      primary: c.primary,
      'primary-hover': luminance(c.primary) > 0.5 ? darken(c.primary, 0.1) : lighten(c.primary, 0.15),
      'on-primary': contrastColor(c.primary),
      secondary: c.secondary,
      'on-secondary': contrastColor(c.secondary),
      accent: c.accent,
      error: c.error,
      'on-error': contrastColor(c.error),
      success: c.success,
      'on-success': contrastColor(c.success),
      warning: c.warning,
      'on-warning': contrastColor(c.warning),
      info: c.info,
      'on-info': contrastColor(c.info),
      background: c.background,
      'on-background': text,
      surface,
      'on-surface': text,
      'surface-raised': surfaceRaised,
      text,
      'text-secondary': textSecondary,
      'text-muted': textMuted,
      border,
    },

    // ── Dark Mode ──
    dark: {
      primary: darkPrimary,
      'primary-hover': darken(darkPrimary, 0.1),
      'on-primary': contrastColor(darkPrimary),
      secondary: lighten(c.secondary, 0.3),
      'on-secondary': '#000000',
      accent: lighten(c.accent, 0.15),
      error: darkError,
      'on-error': contrastColor(darkError),
      success: darkSuccess,
      'on-success': contrastColor(darkSuccess),
      warning: darkWarning,
      'on-warning': contrastColor(darkWarning),
      info: darkInfo,
      'on-info': contrastColor(darkInfo),
      background: darkBg,
      'on-background': darkText,
      surface: darkSurface,
      'on-surface': darkText,
      'surface-raised': darkSurfaceRaised,
      text: darkText,
      'text-secondary': darkTextSecondary,
      'text-muted': darkTextMuted,
      border: darkBorder,
    },

    // ── Layout ──
    sidebar: {
      bg: sidebarBg,
      text: isSidebarDark
        ? lighten(sidebarBg, 0.5)
        : darken(sidebarBg, 0.4),
      'active-bg': isSidebarDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.06)',
      'active-text': isSidebarDark
        ? '#ffffff'
        : '#000000',
      width: '220px',
    },

    // ── Radien ──
    radius: {
      sm: `${radiusSm}px`,
      md: `${r}px`,
      lg: `${radiusLg}px`,
      xl: `${radiusXl}px`,
    },

    // ── Abstände ──
    spacing: {
      xs: `${Math.round(c.spacing * 0.25)}px`,   // 4px
      sm: `${Math.round(c.spacing * 0.5)}px`,    // 8px
      md: `${c.spacing}px`,                       // 16px
      lg: `${Math.round(c.spacing * 1.5)}px`,    // 24px
      xl: `${Math.round(c.spacing * 2)}px`,      // 32px
      '2xl': `${Math.round(c.spacing * 3)}px`,   // 48px
    },

    // ── Schatten ──
    shadows: {
      xs: `0 1px 2px rgba(0, 0, 0, ${(shadowAlpha * 0.5).toFixed(2)})`,
      sm: `0 1px 3px rgba(0, 0, 0, ${(shadowAlpha * 0.7).toFixed(2)}), 0 1px 2px rgba(0, 0, 0, ${(shadowAlpha * 0.5).toFixed(2)})`,
      md: `0 2px 8px rgba(0, 0, 0, ${shadowAlpha.toFixed(2)}), 0 1px 3px rgba(0, 0, 0, ${(shadowAlpha * 0.6).toFixed(2)})`,
      lg: `0 4px 16px rgba(0, 0, 0, ${(shadowAlpha * 1.3).toFixed(2)}), 0 2px 6px rgba(0, 0, 0, ${(shadowAlpha * 0.5).toFixed(2)})`,
      xl: `0 8px 28px rgba(0, 0, 0, ${(shadowAlpha * 1.6).toFixed(2)}), 0 4px 10px rgba(0, 0, 0, ${(shadowAlpha * 0.6).toFixed(2)})`,
      '2xl': `0 16px 48px rgba(0, 0, 0, ${(shadowAlpha * 2).toFixed(2)}), 0 6px 16px rgba(0, 0, 0, ${(shadowAlpha * 0.8).toFixed(2)})`,
    },

    // ── Typografie ──
    typography: {
      fontFamily: `'${c.fontFamily}', system-ui, -apple-system, sans-serif`,
      headingFontFamily: `'${c.headingFontFamily}', system-ui, -apple-system, sans-serif`,
      mono: "'JetBrains Mono', 'SF Mono', monospace",
    },

    // ── Typografie-Presets ──
    typo: deriveTypography(c),
  }
}

/**
 * Abgeleitete Tokens als CSS Custom Properties injizieren
 */
export function injectTokens(coreTokens) {
  const derived = deriveTokens(coreTokens)
  const root = document.documentElement

  // Light-Mode Farben
  for (const [key, value] of Object.entries(derived.light)) {
    root.style.setProperty(`--aw-${key}`, value)
  }

  // Sidebar
  for (const [key, value] of Object.entries(derived.sidebar)) {
    root.style.setProperty(`--aw-sidebar-${key}`, value)
  }

  // Radien
  root.style.setProperty('--aw-radius-sm', derived.radius.sm)
  root.style.setProperty('--aw-radius', derived.radius.md)
  root.style.setProperty('--aw-radius-lg', derived.radius.lg)
  root.style.setProperty('--aw-radius-xl', derived.radius.xl)

  // Abstände
  for (const [key, value] of Object.entries(derived.spacing)) {
    root.style.setProperty(`--aw-space-${key}`, value)
  }

  // Schatten
  root.style.setProperty('--aw-shadow-xs', derived.shadows.xs)
  root.style.setProperty('--aw-shadow-sm', derived.shadows.sm)
  root.style.setProperty('--aw-shadow', derived.shadows.md)
  root.style.setProperty('--aw-shadow-lg', derived.shadows.lg)
  root.style.setProperty('--aw-shadow-xl', derived.shadows.xl)
  root.style.setProperty('--aw-shadow-2xl', derived.shadows['2xl'])

  // Typografie
  root.style.setProperty('--aw-font-family', derived.typography.fontFamily)
  root.style.setProperty('--aw-font-family-heading', derived.typography.headingFontFamily)
  root.style.setProperty('--aw-font-mono', derived.typography.mono)

  // Typografie-Presets
  for (const [key, preset] of Object.entries(derived.typo)) {
    root.style.setProperty(`--aw-typo-${key}-size`, `${preset.fontSize}px`)
    root.style.setProperty(`--aw-typo-${key}-line-height`, `${preset.lineHeight}%`)
    root.style.setProperty(`--aw-typo-${key}-weight`, `${preset.weight}`)
    const fontStack = preset.font === 'heading'
      ? derived.typography.headingFontFamily
      : derived.typography.fontFamily
    root.style.setProperty(`--aw-typo-${key}-font`, fontStack)
  }

  // Dark Mode: CSS-Klasse mit eigenem Style-Block
  injectDarkModeStyles(derived)

  // Cache
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coreTokens))
  } catch { /* ignore */ }
}

/**
 * Dark Mode Styles als <style>-Block injizieren (dynamisch)
 */
function injectDarkModeStyles(derived) {
  const id = 'aw-dark-tokens'
  let style = document.getElementById(id)
  if (!style) {
    style = document.createElement('style')
    style.id = id
    document.head.appendChild(style)
  }

  const darkVars = Object.entries(derived.dark)
    .map(([key, value]) => `  --aw-${key}: ${value};`)
    .join('\n')

  const darkSidebarBg = lighten(derived.dark.background, 0.08)
  const sidebarVars = `  --aw-sidebar-bg: ${darkSidebarBg};
  --aw-sidebar-text: ${lighten(darkSidebarBg, 0.5)};`

  const shadowVars = [
    `  --aw-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.3);`,
    `  --aw-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(0, 0, 0, 0.25);`,
    `  --aw-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3);`,
    `  --aw-shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3);`,
    `  --aw-shadow-xl: 0 8px 28px rgba(0, 0, 0, 0.6), 0 4px 10px rgba(0, 0, 0, 0.35);`,
    `  --aw-shadow-2xl: 0 16px 48px rgba(0, 0, 0, 0.7), 0 6px 16px rgba(0, 0, 0, 0.4);`,
  ].join('\n')

  style.textContent = `html.dark {\n${darkVars}\n${sidebarVars}\n${shadowVars}\n}`
}

/**
 * Vuetify Theme mit abgeleiteten Tokens synchronisieren
 */
export function syncVuetifyTheme(vuetifyTheme, coreTokens) {
  const derived = deriveTokens(coreTokens)

  const vuetifyColorKeys = [
    'primary', 'on-primary', 'secondary', 'on-secondary',
    'error', 'on-error', 'success', 'on-success',
    'warning', 'on-warning', 'info', 'on-info',
    'surface', 'on-surface', 'background', 'on-background',
  ]

  // Light
  const lightColors = {}
  for (const key of vuetifyColorKeys) {
    if (derived.light[key]) lightColors[key] = derived.light[key]
  }
  Object.assign(vuetifyTheme.themes.value.light.colors, lightColors)

  // Dark
  const darkColors = {}
  for (const key of vuetifyColorKeys) {
    if (derived.dark[key]) darkColors[key] = derived.dark[key]
  }
  Object.assign(vuetifyTheme.themes.value.dark.colors, darkColors)
}

/**
 * Kern-Tokens aus localStorage-Cache laden
 */
export function loadCachedTokens() {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}
