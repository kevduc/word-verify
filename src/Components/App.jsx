import { useEffect, useState } from 'react'
import './App.scss'
import IconButton from './IconButton'
import wordList from '../../data/word-list.json'
import WordBucket from './WordBucket'

const Categories = ['keep', 'discard']

function App() {
  const [words, setWords] = useState(null)
  const [wordIdx, setWordIdx] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setWords(wordList.words.map((word) => ({ value: word, category: 'none' })))
    setWordIdx(0)
  }, [])

  const assignToCategory = (category) => {
    const newWords = [...words]
    newWords[wordIdx].category = category
    setWords(newWords)

    const newWordIdx = wordIdx + 1

    if (newWordIdx >= words.length) {
      setDone(true)
    } else {
      setWordIdx(newWordIdx)
    }
  }

  useEffect(() => {
    if (done) return

    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const category = Categories[{ ArrowLeft: 1, ArrowRight: 0 }[e.key]]
        assignToCategory(category)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [words, wordIdx, done, setDone, setWordIdx, setWords])

  const currentWord = words?.[wordIdx] ?? null

  return (
    <main id="app">
      <div className="progress">
        {done ? `Done all ${words?.length ?? '?'} words!` : `Word ${wordIdx ?? '?'} out of ${words?.length ?? '?'}`}
      </div>
      <div className="answer answer--no">
        <IconButton icon="✘" type="danger" onClick={() => assignToCategory('discard')} />
      </div>
      <div className="word">
        <p id="word">{currentWord?.value ?? ''}</p>
      </div>
      <div className="answer answer--yes">
        <IconButton icon="✔" type="success" onClick={() => assignToCategory('keep')} />
      </div>
      <div className="definition">
        <h3>Definition</h3>
        <p>{currentWord?.definition ?? ''}</p>
      </div>
      <div className="words words--invalid">
        <WordBucket words={words} category="discard" title="Discarded" />
      </div>
      <div className="words words--valid">
        <WordBucket words={words} category="keep" title="Kept" />
      </div>
    </main>
  )
}

export default App
