export type SingleArticleModel = {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: {
    username: string
    bio: string
    image: string
    following: boolean
  }
}

export type ArticleCommentModel = {
  id: number
  createdAt: string
  updatedAt: string
  body: string
  author: {
    username: string
    bio: string
    image: string
    following: boolean
  }
}

export type UserModel = {
  email: string
  token: string
  username: string
  bio: string
  image: string
}

export type ProfileModel = {
  username: string
  bio: string
  image: string
  following: boolean
}
