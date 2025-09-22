// Test utility to verify language configuration implementation
// This file is for testing purposes only

export interface TestScenario {
  name: string
  config: {
    bilingual_enabled: boolean
    default_language: 'id' | 'en'
    language_switcher_enabled: boolean
    auto_detect_language: boolean
  }
  expected: {
    canSwitchLanguage: boolean
    availableLanguages: ('id' | 'en')[]
    initialLanguageWithoutSaved: 'id' | 'en' // when no localStorage
    initialLanguageWithBrowserId: 'id' | 'en' // when browser is Indonesian
    initialLanguageWithBrowserEn: 'id' | 'en' // when browser is English
  }
}

export const testScenarios: TestScenario[] = [
  {
    name: "Full bilingual with English default and auto-detect",
    config: {
      bilingual_enabled: true,
      default_language: 'en',
      language_switcher_enabled: true,
      auto_detect_language: true
    },
    expected: {
      canSwitchLanguage: true,
      availableLanguages: ['id', 'en'],
      initialLanguageWithoutSaved: 'en', // Should detect browser, but fallback to default if same
      initialLanguageWithBrowserId: 'id', // Should detect Indonesian browser
      initialLanguageWithBrowserEn: 'en'  // Browser matches default
    }
  },
  {
    name: "Full bilingual with Indonesian default and auto-detect",
    config: {
      bilingual_enabled: true,
      default_language: 'id',
      language_switcher_enabled: true,
      auto_detect_language: true
    },
    expected: {
      canSwitchLanguage: true,
      availableLanguages: ['id', 'en'],
      initialLanguageWithoutSaved: 'id',
      initialLanguageWithBrowserId: 'id', // Browser matches default
      initialLanguageWithBrowserEn: 'en'  // Should detect English browser
    }
  },
  {
    name: "Full bilingual without auto-detect",
    config: {
      bilingual_enabled: true,
      default_language: 'en',
      language_switcher_enabled: true,
      auto_detect_language: false
    },
    expected: {
      canSwitchLanguage: true,
      availableLanguages: ['id', 'en'],
      initialLanguageWithoutSaved: 'en', // Always use default
      initialLanguageWithBrowserId: 'en', // Ignore browser preference
      initialLanguageWithBrowserEn: 'en'
    }
  },
  {
    name: "Bilingual enabled but switcher disabled",
    config: {
      bilingual_enabled: true,
      default_language: 'id',
      language_switcher_enabled: false,
      auto_detect_language: true
    },
    expected: {
      canSwitchLanguage: false, // Switcher disabled
      availableLanguages: ['id', 'en'],
      initialLanguageWithoutSaved: 'id',
      initialLanguageWithBrowserId: 'id',
      initialLanguageWithBrowserEn: 'en' // Still auto-detect on first load
    }
  },
  {
    name: "Monolingual Indonesian only",
    config: {
      bilingual_enabled: false,
      default_language: 'id',
      language_switcher_enabled: true, // Ignored when bilingual disabled
      auto_detect_language: true // Ignored when bilingual disabled
    },
    expected: {
      canSwitchLanguage: false, // No bilingual support
      availableLanguages: ['id'], // Only default language
      initialLanguageWithoutSaved: 'id',
      initialLanguageWithBrowserId: 'id',
      initialLanguageWithBrowserEn: 'id' // Force default language
    }
  },
  {
    name: "Monolingual English only",
    config: {
      bilingual_enabled: false,
      default_language: 'en',
      language_switcher_enabled: true,
      auto_detect_language: true
    },
    expected: {
      canSwitchLanguage: false,
      availableLanguages: ['en'],
      initialLanguageWithoutSaved: 'en',
      initialLanguageWithBrowserId: 'en',
      initialLanguageWithBrowserEn: 'en'
    }
  }
]

export const runLanguageConfigTests = () => {
  console.log('🧪 Language Configuration Test Scenarios:')
  console.table(testScenarios.map(scenario => ({
    Scenario: scenario.name,
    'Can Switch': scenario.expected.canSwitchLanguage,
    'Available Languages': scenario.expected.availableLanguages.join(', '),
    'Default Initial': scenario.expected.initialLanguageWithoutSaved
  })))
}