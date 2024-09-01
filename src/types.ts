// Google Fonts API からの応答に基づいた型定義
export interface GoogleFont {
    kind: string;
    family: string;
    category: string;
    variants: string[];
    subsets: string[];
    version: string;
    lastModified: string;
    files: {
      [key: string]: string | undefined;
    };
  }
  
  // Google Fonts のリスト全体の型定義
  export interface GoogleFontsList {
    kind: string;
    items: GoogleFont[];
  }
  
  // Figma の FontName 型定義
  export interface FontName {
    family: string;
    style: string;
  }
  
  // フィルタリングのオプション
  export type FontFilter = 'all' | 'google' | 'local';
  export type CategoryFilter = 'all' | 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
  
  // Textarea コンポーネントの Props
  export interface TextareaProps {
    value: string;
    onValueInput: (value: string) => void;
    placeholder?: string;
  }
  
  // プラグインのメインコンポーネントの State
  export interface PluginState {
    inputText: string;
    fonts: FontName[];
    selectedFonts: string[];
    searchTerm: string;
    fontFilter: FontFilter;
    category: CategoryFilter;
  }
  
  // プラグインのメッセージ型
  export type PluginMessage =
    | { type: 'get-fonts' }
    | { type: 'got-fonts', fontNames: FontName[] }
    | { type: 'generate-preview', inputText: string, selectedFonts: string[] };