import './Meanings.scss'

function Meanings({ meanings, className, ...rest }) {
  return (
    <div className={`meanings__container ${className ?? ''}`} {...rest}>
      <h3 className="meanings__title">Meanings</h3>

      {meanings?.status === 'done' && Array.isArray(meanings.value) ? (
        <ul className="meanings__list">
          {meanings.value?.map((meaning, idx) => (
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
      ) : meanings?.status === 'loading' ? (
        'Loading...'
      ) : meanings?.status === 'error' ? (
        Object.entries(meanings.value).map(([key, value], i) => (
          <p className="meanings_error-message" key={key}>
            {value}
            {i === 0 ? ' 🤷‍♂️' : ''}
          </p>
        ))
      ) : (
        'Unknown Error'
      )}
    </div>
  )
}

export default Meanings
