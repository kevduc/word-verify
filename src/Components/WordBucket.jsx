import './WordBucket.scss'
import { useEffect, useRef, useState } from 'react'

function WordBucket({ title, words, category, className, onWordClick, ...rest }) {
  const scrollContainer = useRef(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)

  const filteredWords = words?.filter((word) => word.category === category)

  const handleScroll = (evt) => {
    console.log(evt)
    setIsScrolledToBottom(Math.abs(evt.target.scrollHeight - evt.target.scrollTop - evt.target.clientHeight) < 5)
  }

  useEffect(() => {
    if (scrollContainer === null) return
    const element = scrollContainer.current
    if (isScrolledToBottom) {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'instant',
      })
    }
  }, [filteredWords, isScrolledToBottom])

  return (
    <div className={`word-bucket ${className ?? ''}`} {...rest}>
      <div className="word-bucket__container">
        <h3>{title}</h3>
        <div className="word-bucket__scroll-container" ref={scrollContainer} onScroll={handleScroll}>
          <ul className="word-bucket__list">
            {filteredWords?.map((word) => (
              <li key={word.id} onClick={() => onWordClick(word)} title="Click to re-categorize">
                {word.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WordBucket
