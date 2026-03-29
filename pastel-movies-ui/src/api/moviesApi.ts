import type { Movie, SpringPage } from '../types'
import { api } from './client'

export async function fetchAllMoviesForSelect() {
  const { data } = await api.get<SpringPage<Movie>>('/movies', {
    params: { page: 0, size: 500, sort: 'title,asc' },
  })
  return data.content
}

export async function fetchMoviesPage(params: {
  page: number
  size: number
  search?: string
  genreId?: number
  year?: number
  sort?: string
}) {
  const { data } = await api.get<SpringPage<Movie>>('/movies', { params })
  return data
}

export async function fetchMovie(id: number) {
  const { data } = await api.get<Movie>(`/movies/${id}`)
  return data
}

export async function createMovie(body: {
  title: string
  year: number
  duration: number
  synopsis?: string | null
  genreIds?: number[]
  actorIds?: number[]
}) {
  const { data } = await api.post<Movie>('/movies', body)
  return data
}

export async function updateMovie(
  id: number,
  body: {
    title: string
    year: number
    duration: number
    synopsis?: string | null
    genreIds?: number[]
    actorIds?: number[]
  },
) {
  const { data } = await api.put<Movie>(`/movies/${id}`, body)
  return data
}

export async function deleteMovie(id: number) {
  await api.delete(`/movies/${id}`)
}
