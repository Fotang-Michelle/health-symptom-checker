import { useState } from 'react'
import styles from './SymptomForm.module.css'

const SYMPTOM_CATEGORIES = {
  'General': ['Fever', 'Fatigue', 'Chills', 'Night sweats', 'Weight loss'],
  'Head & Throat': ['Headache', 'Sore throat', 'Runny nose', 'Congestion', 'Dizziness'],
  'Chest & Heart': ['Chest pain', 'Shortness of breath', 'Palpitations', 'Cough'],
  'Digestive': ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Loss of appetite'],
  'Muscles & Joints': ['Muscle aches', 'Joint pain', 'Back pain', 'Weakness'],
  'Skin': ['Rash', 'Itching', 'Swelling', 'Pale skin', 'Yellowing of skin'],
}

export default function SymptomForm({ onSubmit, loading }) {
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')

  const toggle = (symptom) => {
    setSelected(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(selected)
  }

  const filteredCategories = Object.entries(SYMPTOM_CATEGORIES).reduce((acc, [cat, symptoms]) => {
    const filtered = symptoms.filter(s =>
      s.toLowerCase().includes(search.toLowerCase())
    )
    if (filtered.length) acc[cat] = filtered
    return acc
  }, {})

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          placeholder="Search symptoms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      {selected.length > 0 && (
        <div className={styles.selectedBar}>
          <span className={styles.selectedLabel}>{selected.length} selected</span>
          <div className={styles.pills}>
            {selected.map(s => (
              <button key={s} type="button" className={styles.pill} onClick={() => toggle(s)}>
                {s} ×
              </button>
            ))}
          </div>
          <button type="button" className={styles.clearBtn} onClick={() => setSelected([])}>
            Clear all
          </button>
        </div>
      )}

      <div className={styles.categories}>
        {Object.entries(filteredCategories).map(([category, symptoms]) => (
          <div key={category} className={styles.category}>
            <h3 className={styles.categoryTitle}>{category}</h3>
            <div className={styles.grid}>
              {symptoms.map(symptom => (
                <label
                  key={symptom}
                  className={`${styles.item} ${selected.includes(symptom) ? styles.checked : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(symptom)}
                    onChange={() => toggle(symptom)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkmark}>
                    {selected.includes(symptom) ? '✓' : ''}
                  </span>
                  <span className={styles.symptomName}>{symptom}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        {!Object.keys(filteredCategories).length && (
          <p className={styles.noResults}>No symptoms match "{search}"</p>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading || !selected.length}
      >
        {loading
          ? <span className={styles.spinner}>Analyzing symptoms...</span>
          : <>Analyze {selected.length > 0
              ? `${selected.length} symptom${selected.length > 1 ? 's' : ''}`
              : 'symptoms'
            }</>
        }
      </button>
    </form>
  )
}