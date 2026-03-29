import type { AppUser, SpringPage } from '../types'
import { api } from './client'

export async function fetchUsersPage(params: {
  page: number
  size: number
  search?: string
  sort?: string
}) {
  const { data } = await api.get<SpringPage<AppUser>>('/users', { params })
  return data
}

export async function fetchAllUsersForSelect() {
  const { data } = await api.get<SpringPage<AppUser>>('/users', {
    params: { page: 0, size: 500, sort: 'name,asc' },
  })
  return data.content
}

export async function createUser(body: { name: string; email: string }) {
  const { data } = await api.post<AppUser>('/users', body)
  return data
}

export async function updateUser(id: number, body: { name: string; email: string }) {
  const { data } = await api.put<AppUser>(`/users/${id}`, body)
  return data
}

export async function deleteUser(id: number) {
  await api.delete(`/users/${id}`)
}
