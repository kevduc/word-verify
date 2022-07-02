import './WordBucket.scss'
import { useEffect, useRef } from 'react'

function WordBucket({ title, words, category, className, onWordClick, ...rest }) {
  const scrollContainer = useRef(null)

  const filteredWords = words?.filter((word) => word.category === category)

  useEffect(() => {
    if (scrollContainer === null) return
    const element = scrollContainer.current
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth',
    })
  }, [filteredWords])

  return (
    <div className={`word-bucket ${className ?? ''}`} {...rest}>
      <div className="word-bucket__container">
        <h3>{title}</h3>
        <div className="word-bucket__scroll-container" ref={scrollContainer}>
          <ul className="word-bucket__list">
            {filteredWords?.map((word) => (
              <li key={word.id} onClick={() => onWordClick()}>
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
