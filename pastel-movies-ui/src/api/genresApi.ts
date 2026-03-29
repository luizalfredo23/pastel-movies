import type { Genre, SpringPage } from '../types'
import { api } from './client'

export async function fetchGenresPage(params: {
  page: number
  size: number
  search?: string
  sort?: string
}) {
  const { data } = await api.get<SpringPage<Genre>>('/genres', { params })
  return data
}

export async function fetchAllGenresForSelect() {
  const { data } = await api.get<SpringPage<Genre>>('/genres', {
    params: { page: 0, size: 500, sort: 'name,asc' },
  })
  return data.content
}

export async function createGenre(body: { name: string }) {
  const { data } = await api.post<Genre>('/genres', body)
  return data
}

export async function updateGenre(id: number, body: { name: string }) {
  const { data } = await api.put<Genre>(`/genres/${id}`, body)
  return data
}

export async function deleteGenre(id: number) {
  await api.delete(`/genres/${id}`)
}
