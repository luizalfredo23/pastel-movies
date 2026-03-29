import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ActorsPage } from './pages/ActorsPage'
import { GenresPage } from './pages/GenresPage'
import { MoviesPage } from './pages/MoviesPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { UsersPage } from './pages/UsersPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/movies" replace />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="genres" element={<GenresPage />} />
          <Route path="actors" element={<ActorsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
