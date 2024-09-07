export interface GoogleFont {
  kind: string
  family: string
  category: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: {
    [key: string]: string | undefined
  }
}

export interface GoogleFontsList {
  kind: string
  items: GoogleFont[]
}

export interface FontName {
  family: string
  style: string
}

export type FontFilter = 'all' | 'google' | 'local'
export type CategoryFilter =
  | 'all'
  | 'serif'
  | 'sans-serif'
  | 'display'
  | 'handwriting'
  | 'monospace'

export interface TextareaProps {
  value: string
  onValueInput: (value: string) => void
  placeholder?: string
}

export interface PluginState {
  inputText: string
  fonts: FontName[]
  selectedFonts: string[]
  searchTerm: string
  fontFilter: FontFilter
  category: CategoryFilter
}

export type PluginMessage =
  | { type: 'get-fonts' }
  | { type: 'got-fonts'; fontNames: FontName[] }
  | { type: 'generate-preview'; inputText: string; selectedFonts: string[] }
