import { createApi } from 'unsplash-js'

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
  fetch // use native fetch api
})