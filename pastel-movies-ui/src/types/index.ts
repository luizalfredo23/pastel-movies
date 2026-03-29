export interface SpringPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface NamedId {
  id: number
  name: string
}

export interface Genre {
  id: number
  name: string
}

export interface Actor {
  id: number
  name: string
}

export interface AppUser {
  id: number
  name: string
  email: string
}

export interface Review {
  id: number
  rating: number
  comment: string | null
  movieId: number
  movieTitle: string
  userId: number
  userName: string
}

export interface Movie {
  id: number
  title: string
  year: number
  duration: number
  synopsis: string | null
  genres: NamedId[]
  actors: NamedId[]
  reviews: Review[]
}

export interface ApiErrorBody {
  timestamp?: string
  status: number
  message: string
  errors?: Record<string, string>
}
