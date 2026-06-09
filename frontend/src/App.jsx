import { useState, useEffect } from 'react'
import RestaurantCard from './components/RestaurantCard'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [visitFilter, setVisitFilter] = useState('all')
  const [genreFilter, setGenreFilter] = useState('all')

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'restaurants.json')
      .then(r => r.json())
      .then(setRestaurants)
      .catch(console.error)
  }, [])

  const genres = ['all', ...new Set(restaurants.map(r => r.genre))]

  const filtered = restaurants
    .filter(r => {
      if (visitFilter === 'visited') return r.visited
      if (visitFilter === 'unvisited') return !r.visited
      return true
    })
    .filter(r => genreFilter === 'all' || r.genre === genreFilter)

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
      </div>

      <div className="grid">
        {filtered.map(r => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  )
}

export default App
