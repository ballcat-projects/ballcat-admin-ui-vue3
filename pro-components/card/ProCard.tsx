import Card from './components/Card'
import type { CardType, CardProps } from './types'

export type ProCardProps = CardProps

export type ProCardType = CardType & {
  isProCard: boolean
  Group: typeof Group
}

const Group = (props: CardProps) => <Card bodyStyle={{ padding: 0 }} {...props} />

// 当前不对底层 Card 做封装，仅挂载子组件，直接导出
// @ts-ignore
const ProCard: ProCardType = Card

ProCard.isProCard = true
ProCard.Group = Group

export default ProCard
