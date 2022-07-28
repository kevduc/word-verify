import { useEffect, useState } from 'react'
import './App.scss'
import wordList from '../../data/word-list.json'

import IconButton from './IconButton'
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

  const handleFetchDictionaryEntriesSuccess = (wordId, entries) => {
    const newMeanings =
      !Array.isArray(entries) && entries.resolution
        ? { value: entries, status: 'error' }
        : { value: entries.flatMap((entry) => entry.meanings), status: 'ready' }
    setWords((words) => words.map((w) => (w.id === wordId ? { ...w, meanings: newMeanings } : w)))
  }

  const handleFetchDictionaryEntriesError = (wordId, error) => {
    console.error(error, wordId)
    const unknownMeanings = { value: null, status: 'unknown-error' }
    setWords((words) =>
      words.map((w) =>
        w.id === wordId
          ? { ...w, meanings: (w.meanings?.value ?? null) !== null ? { ...w.meanings, status: 'outdated' } : unknownMeanings }
          : w
      )
    )
  }

  const fetchWordMeanings = async (word) => {
    setWords((words) => words.map((w) => (w.id === word.id ? { ...w, meanings: { ...w.meanings, status: 'loading' } } : w)))
    fetchDictionaryEntries(word.value)
      .then((entries) => handleFetchDictionaryEntriesSuccess(word.id, entries))
      .catch((e) => handleFetchDictionaryEntriesError(word.id, e))
  }

  // Initialize words from local storage
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

  // Save words in local storage
  useEffect(() => {
    if (words === null) return
    localStorage.setItem('words', JSON.stringify(words.map((word) => ({ ...word, meanings: {} }))))
  }, [words])

  // Fetch currentWord definition if needed
  useEffect(() => {
    if (currentWord === null) return
    if (['outdated', 'unfetched', 'error', 'unknown-error', null].includes(currentWord.meanings?.status ?? null)) {
      fetchWordMeanings(currentWord)
    }
  }, [currentWord?.id])

  const assignToCategory = (word, category) => {
    if (word === null) return
    setWords((words) => [...words.filter((w) => word.id !== w.id), { ...word, category }])
  }

  // Setup key presses event handlers
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
    setWords((words) => [{ ...word, category: 'none' }, ...words.filter((w) => w.id !== word.id)])
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
          disabled={done ? 'true' : ''}
        />
      </div>
      <div className="word">
        <p id="word">{currentWord?.value ?? ''}</p>
      </div>
      <div className="answer answer--yes">
        <IconButton
          title="Keep (Right Arrow)"
          icon="✔"
          type="success"
          onClick={() => assignToCategory(currentWord, 'keep')}
          disabled={done ? 'true' : ''}
        />
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
