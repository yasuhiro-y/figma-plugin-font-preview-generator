import { h } from 'preact'
import { useState, useEffect, useMemo } from 'preact/hooks'
import {
  Button,
  Textbox,
  VerticalSpace,
  Text,
  Container,
  Checkbox,
  render,
  SegmentedControl,
  IconButton,
  useInitialFocus,
  LoadingIndicator,
} from '@create-figma-plugin/ui'
import { IconSearch32 } from '@create-figma-plugin/ui'

import {
  GoogleFont,
  GoogleFontsList,
  FontName,
  FontFilter,
  CategoryFilter,
  TextareaProps,
  PluginState,
  PluginMessage,
} from './types'

// You'll need to create this JSON file
import googleFontsData from './google-fonts.json'

const googleFonts: GoogleFontsList = googleFontsData as GoogleFontsList

const textareaStyles: h.JSX.CSSProperties = {
  width: '100%',
  minHeight: '80px',
  padding: '8px',
  borderRadius: '2px',
  border: '1px solid var(--figma-color-border)',
  backgroundColor: 'var(--figma-color-bg)',
  color: 'var(--figma-color-text)',
  fontFamily: 'inherit',
  fontSize: '12px',
  resize: 'vertical',
}

const flexContainerStyles: h.JSX.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
}

const scrollableContainerStyles: h.JSX.CSSProperties = {
  maxHeight: '300px',
  overflowY: 'auto',
  paddingTop: "16px",
  paddingBottom: "16px",

}

const fixedBottomStyles: h.JSX.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '16px',
  backgroundColor: 'var(--figma-color-bg)',
  borderTop: '1px solid var(--figma-color-border)',
}


// Custom Textarea component
function Textarea({ value, onValueInput, ...props }: TextareaProps) {
  const initialFocus = useInitialFocus()
  return (
    <textarea
      {...initialFocus}
      value={value}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement
        onValueInput(target.value)
      }}
      style={textareaStyles}
      {...props}
    />
  )
}

function Plugin() {
  const [inputText, setInputText] = useState<string>('Hello World')
  const [fonts, setFonts] = useState<FontName[]>([])
  const [selectedFonts, setSelectedFonts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [fontFilter, setFontFilter] = useState<FontFilter>('all')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: 'get-fonts' } as PluginMessage }, '*')

    window.onmessage = (event) => {
      const message = event.data.pluginMessage as PluginMessage
      if (message.type === 'got-fonts') {
        setFonts(message.fontNames)
        setIsLoading(false)
      }
    }
  }, [])

  const filteredFonts = useMemo(() => {
    let filtered = fonts

    if (fontFilter === 'google') {
      filtered = filtered.filter((font) =>
        googleFonts.items.some((gf) => gf.family === font.family)
      )
    } else if (fontFilter === 'local') {
      filtered = filtered.filter(
        (font) => !googleFonts.items.some((gf) => gf.family === font.family)
      )
    }

    if (category !== 'all' && fontFilter === 'google') {
      filtered = filtered.filter(
        (font) => googleFonts.items.find((gf) => gf.family === font.family)?.category === category
      )
    }

    return filtered.filter((font) => font.family.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [fonts, searchTerm, fontFilter, category])

  const toggleFont = (font: string) => {
    setSelectedFonts((prev) =>
      prev.includes(font) ? prev.filter((f) => f !== font) : [...prev, font]
    )
  }

  const toggleAllFiltered = () => {
    const filteredFontFamilies = [...new Set(filteredFonts.map((font) => font.family))]
    if (filteredFontFamilies.every((font) => selectedFonts.includes(font))) {
      setSelectedFonts((prev) => prev.filter((font) => !filteredFontFamilies.includes(font)))
    } else {
      setSelectedFonts((prev) => [...new Set([...prev, ...filteredFontFamilies])])
    }
  }

  const handleGenerate = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'generate-preview',
          inputText,
          selectedFonts,
        } as PluginMessage,
      },
      '*'
    )
  }
  const clickableTextStyles: h.JSX.CSSProperties = {
    cursor: 'pointer',
    userSelect: 'none',
  }
  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Text>Preview Text:</Text>
      <VerticalSpace space="small" />
      <Textarea value={inputText} onValueInput={setInputText} placeholder="Enter preview text..." />
      <VerticalSpace space="medium" />

      <div style={flexContainerStyles}>
        <SegmentedControl
          options={[
            { value: 'all', children: 'All' },
            { value: 'google', children: 'Google Fonts' },
            { value: 'local', children: 'Local' },
          ]}
          value={fontFilter}
          onValueChange={setFontFilter}
        />
        {fontFilter === 'google' && (
          <SegmentedControl
            options={[
              { value: 'all', children: 'All' },
              { value: 'serif', children: 'Serif' },
              { value: 'sans-serif', children: 'Sans Serif' },
              { value: 'display', children: 'Display' },
              { value: 'handwriting', children: 'Handwriting' },
              { value: 'monospace', children: 'Monospace' },
            ]}
            value={category}
            onValueChange={setCategory}
          />
        )}
      </div>
      <VerticalSpace space="small" />
      <Textbox
        icon={<IconSearch32 />}
        value={searchTerm}
        onValueInput={setSearchTerm}
        placeholder="Search fonts..."
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Select Fonts ({selectedFonts.length} selected):</Text>
        <Button onClick={toggleAllFiltered} style={clickableTextStyles}>
          {filteredFonts.every((font) => selectedFonts.includes(font.family))
            ? 'Deselect All'
            : 'Select All'}
        </Button>

      </div>
      <div style={{ ...scrollableContainerStyles, marginBottom: '60px' }}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          filteredFonts.map((font) => (
            <Checkbox
              key={font.family}
              value={selectedFonts.includes(font.family)}
              onValueChange={() => toggleFont(font.family)}
            >
              {font.family}
            </Checkbox>
          ))
        )}
      </div>
      <div style={fixedBottomStyles}>
        <Button fullWidth onClick={handleGenerate} disabled={selectedFonts.length === 0}>
          Generate Preview
        </Button>
      </div>
    </Container>
  )
}

export default render(Plugin)
