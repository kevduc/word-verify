import { useEffect, useState } from 'react'
import './App.scss'
import IconButton from './IconButton'
import wordList from '../../data/word-list.json'
import WordBucket from './WordBucket'
import Meanings from './Meanings'

const Categories = ['keep', 'discard']
const getInitialWords = () =>
  wordList.words.map((word, idx) => ({
    id: idx,
    value: word,
    category: 'none',
    meanings: { value: null, status: 'unfetched' },
  }))

const fetchDictionaryEntries = (word) => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  return fetch(url).then((res) => res.json())
}

function App() {
  const [words, setWords] = useState(null)

  const nextUncategorizedWord = words?.find((word) => word.category === 'none') ?? null
  const currentWord = nextUncategorizedWord
  const done = words !== null && nextUncategorizedWord === null

  const wordsCount = words?.length
  const uncategorizedWordsCount = words?.filter((word) => word.category === 'none').length

  const handleFetchDictionaryEntriesSuccess = (word, entries) => {
    const newWords = [...words]
    const newWord = newWords.find((w) => w.id === word.id)

    if (!Array.isArray(entries) && entries.resolution) {
      newWord.meanings.value = entries
      newWord.meanings.status = 'error'
    } else {
      newWord.meanings.value = entries.flatMap((entry) => entry.meanings)
      newWord.meanings.status = 'ready'
    }

    setWords(newWords)
  }

  const handleFetchDictionaryEntriesError = (word, error) => {
    console.error(error, word)
    const newWords = [...words]
    const newWord = newWords.find((w) => w.id === word.id)
    newWord.meanings.status = 'unknown-error'
    setWords(newWords)
  }

  const fetchWordMeanings = async (word) => {
    const newWords = [...words]
    const newWord = newWords.find((w) => w.id === word.id)
    if ((newWord.meanings ?? null) === null) newWord.meanings = { value: null, status: 'unfetched' }
    fetchDictionaryEntries(word.value)
      .then((entries) => handleFetchDictionaryEntriesSuccess(newWord, entries))
      .catch((e) => handleFetchDictionaryEntriesError(newWord, e))
    newWord.meanings.status = 'loading'
    setWords(newWords)
  }

  useEffect(() => {
    const storedWords = localStorage.getItem('words')
    let storedWordsParsed = null
    try {
      storedWordsParsed = storedWords ? JSON.parse(storedWords) : null
    } catch (e) {
      console.warn(e)
    }
    const initialWords = storedWordsParsed ?? getInitialWords()
    setWords(initialWords)
  }, [])

  useEffect(() => {
    if (words === null) return
    localStorage.setItem('words', JSON.stringify(words.map((word) => ({ ...word, meanings: {} }))))
  }, [words])

  useEffect(() => {
    if (currentWord === null) return
    if (['unfetched', 'error', 'unknown-error', null].includes(currentWord.meanings?.status ?? null)) {
      fetchWordMeanings(currentWord)
    }
  }, [currentWord])

  const assignToCategory = (word, category) => setWords([...words.filter((w) => word.id !== w.id), { ...word, category }])

  useEffect(() => {
    if (done) return

    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const category = Categories[{ ArrowLeft: 1, ArrowRight: 0 }[e.key]]
        assignToCategory(currentWord, category)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [assignToCategory, currentWord])

  const handleReset = () => {
    setWords(getInitialWords())
  }

  const handleWordClick = (word) => {
    setWords([{ ...word, category: 'none' }, ...words.filter((w) => w.id !== word.id)])
  }

  return (
    <main id="app">
      <div className="reset-button__container">
        <IconButton
          className="reset-button"
          title="Reset all categorization"
          icon="↻"
          type="warning"
          onClick={() => handleReset()}
        />
      </div>
      <div className="progress">
        <p className="progress__text">
          {done
            ? `Done all ${wordsCount ?? '?'} words!`
            : `${uncategorizedWordsCount ?? '?'} words left out of ${wordsCount ?? '?'}`}
        </p>
      </div>
      <div className="answer answer--no">
        <IconButton
          title="Discard (Left Arrow)"
          icon="✘"
          type="danger"
          onClick={() => assignToCategory(currentWord, 'discard')}
        />
      </div>
      <div className="word">
        <p id="word">{currentWord?.value ?? ''}</p>
      </div>
      <div className="answer answer--yes">
        <IconButton title="Keep (Right Arrow)" icon="✔" type="success" onClick={() => assignToCategory(currentWord, 'keep')} />
      </div>
      <div className="meanings">
        <Meanings meanings={currentWord?.meanings} />
      </div>
      <div className="words words--invalid">
        <WordBucket words={words} category="discard" title="Discarded" onWordClick={handleWordClick} />
      </div>
      <div className="words words--valid">
        <WordBucket words={words} category="keep" title="Kept" onWordClick={handleWordClick} />
      </div>
    </main>
  )
}

export default App
