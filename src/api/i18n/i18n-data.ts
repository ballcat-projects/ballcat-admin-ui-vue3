import httpClient from '@/utils/axios'
import type { I18nData, I18nDataDTO, I18nDataQO, I18nImportData } from './types'
import type { FileObject } from '@/components/CropperModal/types'
import type { ImportMode } from '@/api/types'

export function pageI18nData(query: I18nDataQO) {
  return httpClient.get('/i18n/i18n-data/page', {
    params: query
  })
}

export function createI18nData(data: I18nDataDTO) {
  return httpClient.post('/i18n/i18n-data', data)
}

export function deleteI18nData(code: string, languageTag: string) {
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

export function exportI18nDataExcel(params: I18nDataQO) {
  return httpClient.get('/i18n/i18n-data/export', { params, responseType: 'blob' })
}

export function importI18nDataExcel(data: I18nImportData) {
  const { file, importMode } = data
  const formData = new FormData()
  // @ts-ignore
  formData.append('file', file, file.name)
  formData.append('importMode', importMode)
  return httpClient.postForm('i18n/i18n-data/import', formData)
}

export function downloadI18nDataExcelTemplate() {
  return httpClient.request({
    url: '/i18n/i18n-data/excel-template',
    method: 'get',
    responseType: 'blob'
  })
}
