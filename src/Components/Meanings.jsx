import './Meanings.scss'

function Meanings({ meanings, className, ...rest }) {
  return (
    <div className={`meanings__container ${className ?? ''}`} {...rest}>
      <h3 className="meanings__title">Meanings</h3>
      {(() => {
        switch (meanings?.status ?? null) {
          case null:
            return null
          case 'unfetched':
          case 'loading': {
            return <p className="meanings__status">Loading...</p>
          }
          case 'ready': {
            return (
              <ul className="meanings__list">
                {meanings?.value?.map((meaning, idx) => (
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
                )) ?? ''}
              </ul>
            )
          }
          case 'error': {
            // Showing only title prop for error value for now
            return Object.entries({ title: meanings?.value?.title }).map(([key, value], i) => (
              <p className="meanings__status meanings__status--warning" key={key}>
                {value ?? 'No meaning found'}
                {i === 0 ? ' 🤷‍♂️' : ''}
              </p>
            ))
          }
          default: {
            return <p className="meanings__status meanings__status--error">Something went wrong, try again later</p>
          }
        }
      })()}
    </div>
  )
}

export default Meanings
