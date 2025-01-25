import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import './App.css'
import TopStatsPage from './components/topstats/TopStatsPage'
import PlaylistPage from './components/PlaylistStatsPage'

function App() {
  return (
    <div>
     <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/topstats' element={<TopStatsPage />} />
      <Route path='/playliststats' element={<PlaylistPage />} />
     </Routes>
    </div>
  )
}

export default App
