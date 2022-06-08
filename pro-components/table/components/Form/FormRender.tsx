import type { BaseQueryFilterProps } from '#/form/layouts/QueryFilter'

export type SearchConfig = BaseQueryFilterProps & {
  filterType?: 'query' | 'light'
}
