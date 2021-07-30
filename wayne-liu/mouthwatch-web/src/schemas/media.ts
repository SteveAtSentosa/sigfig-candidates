import { Media } from '#/types'
import { schema } from 'normalizr'

export const media = new schema.Entity<Media>('media')
export const medias = new schema.Array(media)
export const mapping = { media: medias }
