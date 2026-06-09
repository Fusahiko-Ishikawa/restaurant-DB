import { useState, useEffect } from 'react'
import RestaurantCard from './components/RestaurantCard'

const SITUATIONS = ['一人で行きやすい', 'デート向き', '宴会向き', '接待・商談向き']

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [visitFilter, setVisitFilter] = useState('all')
  const [genreFilter, setGenreFilter] = useState('all')
  const [situationFilter, setSituationFilter] = useState('all')
  const [kidsOverrides, setKidsOverrides] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rdb-kids') || '{}') }
    catch { return {} }
  })
  const [updatedOverrides, setUpdatedOverrides] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rdb-updated') || '{}') }
    catch { return {} }
  })

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'restaurants.json')
      .then(r => r.json())
      .then(setRestaurants)
      .catch(console.error)
  }, [])

  const getKids = (r) =>
    r.id in kidsOverrides ? kidsOverrides[r.id] : r.kids_friendly

  const getUpdated = (r) =>
    updatedOverrides[r.id] || r.updated_date

  const toggleKids = (id, current) => {
    const next = current === null ? true : current === true ? false : null
    const newKids = { ...kidsOverrides }
    if (next === null) delete newKids[id]
    else newKids[id] = next
    setKidsOverrides(newKids)
    localStorage.setItem('rdb-kids', JSON.stringify(newKids))

    const newUpdated = { ...updatedOverrides, [id]: today() }
    setUpdatedOverrides(newUpdated)
    localStorage.setItem('rdb-updated', JSON.stringify(newUpdated))
  }

  const genres = ['all', ...new Set(restaurants.map(r => r.genre))]

  const filtered = restaurants
    .filter(r => {
      if (visitFilter === 'visited') return r.visited
      if (visitFilter === 'unvisited') return !r.visited
      return true
    })
    .filter(r => genreFilter === 'all' || r.genre === genreFilter)
    .filter(r => {
      if (situationFilter === 'all') return true
      if (situationFilter === '子連れ可') return getKids(r) === true
      return r.situation?.includes(situationFilter)
    })

  return (
    <div className="app">
      <header className="header">
        <h1>レストランDB</h1>
        <p className="subtitle">{filtered.length} 件表示</p>
      </header>

      <div className="filters">
        <div className="filter-row">
          <span className="filter-label">訪問</span>
          {[
            { value: 'all', label: 'すべて' },
            { value: 'visited', label: '訪問済み' },
            { value: 'unvisited', label: '未訪問' },
          ].map(({ value, label }) => (
            <button
              key={value}
              className={`filter-btn ${visitFilter === value ? 'active' : ''}`}
              onClick={() => setVisitFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="filter-row">
          <span className="filter-label">ジャンル</span>
          {genres.map(g => (
            <button
              key={g}
              className={`filter-btn ${genreFilter === g ? 'active' : ''}`}
              onClick={() => setGenreFilter(g)}
            >
              {g === 'all' ? 'すべて' : g}
            </button>
          ))}
        </div>

        <div className="filter-row">
          <span className="filter-label">場面</span>
          {['all', ...SITUATIONS, '子連れ可'].map(s => (
            <button
              key={s}
              className={`filter-btn ${situationFilter === s ? 'active' : ''}`}
              onClick={() => setSituationFilter(s)}
            >
              {s === 'all' ? 'すべて' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid">
        {filtered.map(r => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            kidsOk={getKids(r)}
            onToggleKids={() => toggleKids(r.id, getKids(r))}
            updatedDate={getUpdated(r)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
