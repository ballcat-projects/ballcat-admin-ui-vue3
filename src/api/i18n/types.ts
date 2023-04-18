import type { ImportMode } from '@/api/types'
import type { UploadFile } from 'ant-design-vue/lib/upload/interface'

export interface I18nDataQO {
  // 国际化标识
  code?: string
  // 文本值
  message?: string
  // 语言标签
  languageTag?: string
}

export interface LanguageText {
  // 语言标签
  languageTag: string
  // 文本值
  message: string
}

export interface I18nBaseData {
  // 唯一标识
  code: string
  // 备注
  remarks?: string
}

export interface I18nData extends LanguageText, I18nBaseData {}

/**
 * i18nData新建修改的传输对象
 */
export interface I18nDataDTO extends I18nBaseData {
  languageTexts: LanguageText[]
}

/**
 * 角色分页视图对象
 */
export interface I18nDataPageVO extends I18nBaseData, LanguageText {
  id: number
  // 创建时间
  createTime?: string
}

export interface I18nImportData {
  // 文件内容
  file?: UploadFile
  // 导入模式
  importMode: ImportMode
}
