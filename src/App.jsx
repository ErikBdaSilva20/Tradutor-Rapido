import { useEffect, useState } from 'react'

const languages = [
  { code: 'en', name: 'Inglês' },
  { code: 'es', name: 'Espanhol' },
  { code: 'fr', name: 'Francês' },
  { code: 'de', name: 'Alemão' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
]
function App() {
  const [sourceLang, setSourceLang] = useState('pt')
  const [targetLang, setTargetLang] = useState('en')
  const [sourceText, setsourceText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [translatedText, setTranslatedText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (sourceText) {
      const delay = setTimeout(() => {
        handleTranslate()
      }, 500)
      return () => clearTimeout(delay)
    } else {
      setTranslatedText('') // limpa tradução se texto vazio
    }
  }, [sourceText, sourceLang, targetLang])

  const handleTranslate = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${sourceText}&langpair=${sourceLang}|${targetLang}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP ERROR ${response.status}`)
      }

      const data = await response.json()
      setTranslatedText(data.responseData.translatedText)
    } catch (err) {
      setError(`Erro ao tentar traduzir: ${err.message}, tente novamente`)
      setTranslatedText('')
    } finally {
      setIsLoading(false)
    }
  }

  const swapTranslate = () => {
    const oldSourceLang = sourceLang
    const oldTargetLang = targetLang
    const oldSourceText = sourceText
    const oldTranslatedText = translatedText

    setSourceLang(oldTargetLang)
    setTargetLang(oldSourceLang)
    setsourceText(oldTranslatedText)
    setTranslatedText(oldSourceText)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-withe  shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <h1 className="text-headerColor text-2xl font-bold">
            Tradutor - DevClub
          </h1>
        </div>
      </header>

      <main className="flex-grow flex item-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden max-h-80">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <select
              value={sourceLang}
              onChange={event => setSourceLang(event.target.value)}
              className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
              onClick={swapTranslate}
            >
              <svg
                className="w-5 h-5 text-headerColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            <select
              value={targetLang}
              onChange={event => setTargetLang(event.target.value)}
              className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <textarea
                value={sourceText}
                onChange={event => {
                  setsourceText(event.target.value)
                }}
                placeholder={'Digite o texto'}
                className="w-full h-56 text-lg text-textColor bg-transparent resize-none border-none outline-none"
              ></textarea>
            </div>

            <div className=" relative p-4 bg-secondaryBackground border-l border-gray-200">
              {isLoading ? (
                <div className=" absolute flex items-center justify-center inset-0">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
                </div>
              ) : (
                <p className="text-lg text-textColor whitespace-pre-wrap">
                  {translatedText}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      {error && (
        <div className="p-4 bg-red-100 border-t border-red-400 text-red-700 font-semibold rounded-b flex justify-center">
          {error}
        </div>
      )}
      <footer className="bg-white border-t border-gray-300 mt-auto  ">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center text-sm text-headerColor justify-center">
          {' '}
          &copy; {new Date().getFullYear()}Tradutor - DevClub
        </div>
      </footer>
    </div>
  )
}

export default App
