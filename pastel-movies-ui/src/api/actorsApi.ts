import type { Actor, SpringPage } from '../types'
import { api } from './client'

export async function fetchActorsPage(params: {
  page: number
  size: number
  search?: string
  sort?: string
}) {
  const { data } = await api.get<SpringPage<Actor>>('/actors', { params })
  return data
}

export async function fetchAllActorsForSelect() {
  const { data } = await api.get<SpringPage<Actor>>('/actors', {
    params: { page: 0, size: 500, sort: 'name,asc' },
  })
  return data.content
}

export async function createActor(body: { name: string }) {
  const { data } = await api.post<Actor>('/actors', body)
  return data
}

export async function updateActor(id: number, body: { name: string }) {
  const { data } = await api.put<Actor>(`/actors/${id}`, body)
  return data
}

export async function deleteActor(id: number) {
  await api.delete(`/actors/${id}`)
}
