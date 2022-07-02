import './Meanings.scss'

function Meanings({ meanings, className, ...rest }) {
  return (
    <div className={`meanings__container ${className ?? ''}`} {...rest}>
      <h3 className="meanings__title">Meanings</h3>
      <ul className="meanings__list">
        {meanings?.status === 'done' && Array.isArray(meanings.value)
          ? meanings.value?.map((meaning, idx) => (
              <li className="meaning" key={idx}>
                <h4 className="meaning__title">{meaning.partOfSpeech}</h4>
                <ol className="definitions__list">
                  {meaning.definitions?.map(({ definition, example, synonyms, antonyms }, idx) => (
                    <li key={idx} className="definition">
                      <p className="definition__text">{definition}</p>
                      {example && (
                        <p className="definition__example">
                          Example: <i>{example}</i>
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </li>
            )) ?? ''
          : meanings?.status === 'loading'
          ? 'Loading...'
          : 'Error'}
      </ul>
    </div>
  )
}

export default Meanings
