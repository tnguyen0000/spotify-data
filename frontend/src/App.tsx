import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import './App.css'
import TopStatsPage from './components/topstatsPage/TopStatsPage'
import PlaylistPage from './components/playlistPage/PlaylistsPage'
import PlaylistStatPage from './components/playlistPage/PlayListStatPage'

function App() {
  return (
    <div>
     <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/topstats' element={<TopStatsPage />} />
      <Route path='/playliststats' element={<PlaylistPage />} />
      <Route path='/playliststats/stat' element={<PlaylistStatPage />} />
     </Routes>
    </div>
  )
}

export default App
