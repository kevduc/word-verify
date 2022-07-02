import { useEffect, useState } from 'react'
import './App.scss'
import IconButton from './IconButton'
import wordList from '../../data/word-list.json'
import WordBucket from './WordBucket'

const Categories = ['keep', 'discard']

function App() {
  const [words, setWords] = useState(null)
  const nextUncategorizedWord = words?.find((word) => word.category === 'none') ?? null
  const currentWord = nextUncategorizedWord
  const done = words !== null && nextUncategorizedWord === null

  const wordsCount = words?.length
  const uncategorizedWordsCount = words?.filter((word) => word.category === 'none').length

  useEffect(() => {
    setWords(wordList.words.map((word, idx) => ({ id: idx, value: word, category: 'none' })))
  }, [])

  const assignToCategory = (category) => {
    const newWords = [...words]
    newWords.find((word) => word.id === currentWord.id).category = category
    setWords(newWords)
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
  }, [assignToCategory])

  return (
    <main id="app">
      <div className="progress">
        {done
          ? `Done all ${wordsCount ?? '?'} words!`
          : `${uncategorizedWordsCount ?? '?'} words left out of ${wordsCount ?? '?'}`}
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
