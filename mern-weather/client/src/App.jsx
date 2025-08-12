import { useEffect, useMemo, useState } from 'react'
import './App.css'

function useApi() {
  async function getJson(path, params = undefined) {
    const url = new URL(path, window.location.origin)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return res.json()
  }
  async function postJson(path, body) {
    const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return res.json()
  }
  async function del(path) {
    const res = await fetch(path, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) throw new Error(`Request failed: ${res.status}`)
  }
  return { getJson, postJson, del }
}

function formatDay(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { weekday: 'short' })
}

function App() {
  const api = useApi()
  const [query, setQuery] = useState('')
  const [locations, setLocations] = useState([])
  const [selected, setSelected] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Load favorites
  useEffect(() => {
    api.getJson('/api/favorites').then((r) => setFavorites(r.favorites || [])).catch(() => {})
  }, [])

  async function onSearch() {
    setError('')
    setLocations([])
    if (!query.trim()) return
    setLoading(true)
    try {
      const r = await api.getJson('/api/geocode', { query })
      setLocations(r.results)
    } catch (e) {
      setError('Failed to search locations')
    } finally {
      setLoading(false)
    }
  }

  async function loadForecast(lat, lon) {
    setError('')
    setForecast(null)
    setLoading(true)
    try {
      const r = await api.getJson('/api/forecast', { lat: String(lat), lon: String(lon) })
      setForecast(r.forecast)
    } catch (e) {
      setError('Failed to load forecast')
    } finally {
      setLoading(false)
    }
  }

  async function selectLocation(loc) {
    setSelected(loc)
    await loadForecast(loc.latitude, loc.longitude)
  }

  async function saveFavorite() {
    if (!selected) return
    try {
      const r = await api.postJson('/api/favorites', selected)
      if (r.favorite) setFavorites((prev) => [r.favorite, ...prev])
    } catch {}
  }

  async function removeFavorite(id) {
    try {
      await api.del(`/api/favorites/${id}`)
      setFavorites((prev) => prev.filter((f) => f._id !== id))
    } catch {}
  }

  const dailyCards = useMemo(() => {
    const daily = forecast?.daily
    if (!daily?.time) return null
    return daily.time.map((dateStr, idx) => (
      <div className="dayCard" key={dateStr}>
        <div>{formatDay(dateStr)}</div>
        <div className="small">{dateStr}</div>
        <div style={{ marginTop: 6, fontSize: 18 }}>
          {Math.round(daily.temperature_2m_min[idx])}° / {Math.round(daily.temperature_2m_max[idx])}°
        </div>
        <div className="small">precip: {daily.precipitation_sum[idx] ?? 0} mm</div>
      </div>
    ))
  }, [forecast])

  return (
    <div className="app">
      <div className="header">
        <h1>Weather</h1>
        <div className="subtitle">Search a city and view a 5-day forecast</div>
      </div>

      <div className="searchRow">
        <input className="input" placeholder="Search city..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
        <button className="button" onClick={onSearch}>Search</button>
      </div>

      {!!error && <div style={{ color: '#ffb4b4', marginBottom: 10 }}>{error}</div>}

      <div className="grid">
        <div className="card">
          {!selected && <div className="small">Choose a location to see the forecast</div>}

          {selected && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600 }}>
                  {selected.name}
                  {selected.admin1 ? `, ${selected.admin1}` : ''} {selected.country ? `(${selected.country})` : ''}
                </div>
                <button className="button" onClick={saveFavorite}>Save Favorite</button>
              </div>
              <hr />
              {loading && <div>Loading...</div>}
              {forecast && (
                <div>
                  <div style={{ fontSize: 14 }} className="small">
                    Current: {forecast.current_weather?.temperature ?? '—'}°
                  </div>
                  <div className="forecastRow">{dailyCards}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Search Results</div>
          {loading && !selected && <div>Loading...</div>}
          {!loading && locations.map((loc) => (
            <div key={`${loc.id}-${loc.latitude}-${loc.longitude}`} className="locationItem" onClick={() => selectLocation(loc)}>
              {loc.name}
              {loc.admin1 ? `, ${loc.admin1}` : ''} {loc.country ? `(${loc.country})` : ''}
              <div className="small">{loc.latitude}, {loc.longitude}</div>
            </div>
          ))}
          {!loading && !locations.length && <div className="small">No results</div>}
          <hr />
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Favorites</div>
          {!favorites.length && <div className="small">None saved</div>}
          {favorites.map((f) => (
            <div key={f._id} className="favItem">
              <div>
                {f.name}
                <div className="small">{f.latitude}, {f.longitude}</div>
              </div>
              <button className="remove" onClick={() => removeFavorite(f._id)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
