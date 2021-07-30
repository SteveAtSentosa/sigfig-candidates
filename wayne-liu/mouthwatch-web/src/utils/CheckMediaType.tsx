import { Media } from '#/types'
import config from '#/config'

export const isImage = (preview: Media) => {
  return preview.mime_type.includes('image')
}

export const isVideo = (preview: Media) => {
  return preview.mime_type.includes('video')
}

export const isDocument = (preview: Media) => {
  return preview.mime_type.includes('application') || preview.mime_type.includes('text')
}

export const isAudio = (preview: Media) => {
  return preview.mime_type.includes('audio')
}

export const isXray = (preview: Media) => {
  return preview.mime_type.includes('image')
}

export const isPDF = (preview: Media) => {
  return preview.mime_type.includes('pdf')
}

export const isSTL = (preview: Media) => {
  // the STL files have application/octect as their type
  return preview.file_name.includes('.stl')
}

export const convertToTeledentExamType = (file: File) => {

  if (file.type.includes('image')) {
    return 'exam-img'
  } else if (file.type.includes('video')) {
    return 'exam-vid'
  } else if (file.type.includes('application') || file.type.includes('text')) {
    return 'exam-doc'
  } else if (file.type.includes('audio')) {
    return 'exam-audio'
  }
}

export const convertToTeledentChatType = (file: File) => {

  if (file.type.includes('image')) {
    return 'chat-img'
  } else if (file.type.includes('video')) {
    return 'chat-vid'
  } else if (file.type.includes('application') || file.type.includes('text')) {
    return 'chat-pdf'
  } else if (file.type.includes('audio')) {
    return 'chat-audio'
  }
}

export const getCompressedThumbnailPreview = (media: Media, token: string) => {
  if (isVideo(media) || isImage(media)) {
    return getLambdaMediaSrc(media.id, token, 'thumbnail')
  } else if (isXray(media)) {
    return '/static/images/mediaVid.png'
  } else if (isSTL(media)) {
    return '/static/images/mediaStl.png'
  } else if (isPDF(media)) {
    return '/static/images/media_doc.svg'
  } else if (isDocument(media)) {
    return '/static/images/mediaDoc.svg'
  } else if (isAudio(media)) {
    return '/static/images/mediaMp3.svg'
  }
}

type MediaSrcTypeOptions = 'thumbnail' | 'original'

export const getLambdaVideoMediaSrc = (mediaId: string, token: string) => {
  return `${config.api.lambdaUrl}/media/${mediaId}?authToken=${token}&format=mp4`
}

type PDFOptions = { type: 'application/pdf', disposition: 'inline' | 'attachment' }

export const getLambdaPDFMediaSrc = (mediaId: string, token: string, urlParams: PDFOptions = { type: 'application/pdf', disposition: 'attachment' }) => {
  const baseUrl = getLambdaMediaSrc(mediaId, token)
  const props = Object.keys(urlParams)
  const params = props.map(prop => `&${prop}=${urlParams[prop]}`).join('')
  return `${baseUrl}${params}`
}

export const getLambdaMediaSrc = (mediaId: string, token: string, type: MediaSrcTypeOptions = 'original') => {
  return `${config.api.lambdaUrl}/media/${mediaId}${type === 'thumbnail' ? '/thumbnail' : ''}?authToken=${token}`
}

export const getLambdaGroupLogoSrc = (groupId: string) => {
  return `${config.api.lambdaUrl}/groups/${groupId}/logo`
}
