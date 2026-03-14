/**
 * Design Token System — Lädt Tokens aus Appwrite, injiziert als CSS Custom Properties,
 * synchronisiert mit Vuetify Theme.
 */

const STORAGE_KEY = 'aw-design-tokens'

/** Default-Tokens (Fallback wenn Appwrite nicht erreichbar) */
export const defaultTokens = {
  colors: {
    primary: '#6366f1',
    'on-primary': '#ffffff',
    secondary: '#6b7280',
    accent: '#06b6d4',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
    background: '#f8f9fb',
    surface: '#ffffff',
    text: '#111827',
    'text-secondary': '#6b7280',
    border: '#e5e7eb',
  },
  colorsDark: {
    background: '#0f1117',
    surface: '#1a1d27',
    text: '#f3f4f6',
    'text-secondary': '#9ca3af',
    border: '#2d3140',
  },
  typography: {
    fontFamily: 'DM Sans',
    headingFontFamily: 'DM Sans',
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.07)',
    md: '0 4px 12px rgba(0,0,0,0.06)',
    lg: '0 20px 48px rgba(0,0,0,0.10)',
  },
  sidebar: {
    bg: '#111827',
    width: '220px',
  },
  layout: 'sidebar',
}

/**
 * Tokens als CSS Custom Properties auf :root setzen
 */
export function injectTokens(tokens) {
  const root = document.documentElement

  // Farben
  if (tokens.colors) {
    for (const [key, value] of Object.entries(tokens.colors)) {
      root.style.setProperty(`--aw-${key}`, value)
    }
  }

  // Dark-Mode-Farben in separatem Block (werden per html.dark aktiviert)
  // → Die main.css :root / html.dark Logik greift hier

  // Border Radius
  if (tokens.borderRadius) {
    root.style.setProperty('--aw-radius-sm', tokens.borderRadius.sm)
    root.style.setProperty('--aw-radius', tokens.borderRadius.md)
    root.style.setProperty('--aw-radius-lg', tokens.borderRadius.lg)
    root.style.setProperty('--aw-radius-xl', tokens.borderRadius.xl)
  }

  // Shadows
  if (tokens.shadows) {
    root.style.setProperty('--aw-shadow-xs', tokens.shadows.sm)
    root.style.setProperty('--aw-shadow', tokens.shadows.md)
    root.style.setProperty('--aw-shadow-lg', tokens.shadows.lg)
  }

  // Sidebar
  if (tokens.sidebar) {
    root.style.setProperty('--aw-sidebar-bg', tokens.sidebar.bg)
    root.style.setProperty('--aw-sidebar-width', tokens.sidebar.width)
  }

  // Typography
  if (tokens.typography) {
    const fontFamily = `'${tokens.typography.fontFamily}', system-ui, sans-serif`
    const headingFamily = `'${tokens.typography.headingFontFamily}', system-ui, sans-serif`
    root.style.setProperty('--aw-font-family', fontFamily)
    root.style.setProperty('--aw-font-family-heading', headingFamily)
  }

  // localStorage Cache
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
  } catch { /* ignore */ }
}

/**
 * Vuetify Theme mit Tokens synchronisieren
 */
export function syncVuetifyTheme(vuetifyTheme, tokens) {
  if (!tokens.colors) return

  const themeColors = {
    primary: tokens.colors.primary,
    'on-primary': tokens.colors['on-primary'],
    secondary: tokens.colors.secondary,
    error: tokens.colors.error,
    success: tokens.colors.success,
    warning: tokens.colors.warning,
    info: tokens.colors.info,
    surface: tokens.colors.surface,
    background: tokens.colors.background,
  }

  // Light Theme
  Object.assign(vuetifyTheme.themes.value.light.colors, themeColors)

  // Dark Theme
  if (tokens.colorsDark) {
    Object.assign(vuetifyTheme.themes.value.dark.colors, {
      ...themeColors,
      background: tokens.colorsDark.background,
      surface: tokens.colorsDark.surface,
    })
  }
}

/**
 * Tokens aus localStorage-Cache laden (schneller Startup)
 */
export function loadCachedTokens() {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}
