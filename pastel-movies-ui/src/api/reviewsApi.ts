import type { Review, SpringPage } from '../types'
import { api } from './client'

export async function fetchReviewsPage(params: {
  page: number
  size: number
  movieId?: number
  userId?: number
  sort?: string
}) {
  const { data } = await api.get<SpringPage<Review>>('/reviews', { params })
  return data
}

export async function createReview(body: {
  rating: number
  comment?: string | null
  movieId: number
  userId: number
}) {
  const { data } = await api.post<Review>('/reviews', body)
  return data
}

export async function updateReview(
  id: number,
  body: {
    rating: number
    comment?: string | null
    movieId: number
    userId: number
  },
) {
  const { data } = await api.put<Review>(`/reviews/${id}`, body)
  return data
}

export async function deleteReview(id: number) {
  await api.delete(`/reviews/${id}`)
}
