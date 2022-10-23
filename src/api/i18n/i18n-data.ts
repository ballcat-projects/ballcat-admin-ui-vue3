import httpClient from '@/utils/axios'
import type { I18nData, I18nDataDTO, I18nDataQO } from './types'

export function pageI18nData(query: I18nDataQO) {
  return httpClient.get('/i18n/i18n-data/page', {
    params: query
  })
}

export function createI18nData(data: I18nDataDTO) {
  return httpClient.post('/i18n/i18n-data', data)
}

export function removeI18nData(code: string, languageTag: string) {
  return httpClient.delete('/i18n/i18n-data', {
    params: {
      code: code,
      languageTag: languageTag
    }
  })
}

export function updateI18nData(data: I18nData) {
  return httpClient.put('/i18n/i18n-data', data)
}

export function exportExcel(params: I18nDataQO) {
  return httpClient.get('/i18n/i18n-data/export', { params, responseType: 'blob' })
}

export function importExcel() {
  return httpClient.postForm('i18n/i18n-data/import', null, {})
}
