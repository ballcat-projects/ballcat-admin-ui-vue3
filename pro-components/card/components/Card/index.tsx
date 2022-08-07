import './index.less'

import { Grid, Tabs } from 'ant-design-vue'
import 'ant-design-vue/es/grid/style/index.less'
import 'ant-design-vue/es/tabs/style/index.less'

import { RightOutlined } from '@ant-design/icons-vue'

import type { Breakpoint, Gutter } from '../../types'

import Loading from '../Loading'
import Actions from '../Actions'
import { getPrefixCls } from '#/layout/RouteContext'
import { defineComponent, watchEffect } from 'vue'
import type { CSSProperties } from 'vue'

const { useBreakpoint } = Grid

import { useToggle } from '@vueuse/core'
import { cardProps } from '../../types'
import LabelIconTip from '../../../utils/components/LabelIconTip'

const Card = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Card',
  slots: ['loading'],
  props: cardProps(),
  setup(props, { attrs, slots }) {
    const screens = useBreakpoint()

    const [collapsed, setCollapsed] = useToggle(false)
    watchEffect(() => {
      props.collapsed && (collapsed.value = props.collapsed)
    })

    // 顺序决定如何进行响应式取值，按最大响应值依次取值，请勿修改。
    const responsiveArray: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']

    /**
     * 根据响应式获取 gutter, 参考 antd 实现
     *
     * @param gut
     */
    const getNormalizedGutter = (gut: Gutter | Gutter[]) => {
      const results: [number, number] = [0, 0]
      const normalizedGutter = Array.isArray(gut) ? gut : [gut, 0]
      normalizedGutter.forEach((g, index) => {
        if (typeof g === 'object') {
          for (let i = 0; i < responsiveArray.length; i += 1) {
            const breakpoint: Breakpoint = responsiveArray[i]
            if (screens.value[breakpoint] && g[breakpoint] !== undefined) {
              results[index] = g[breakpoint] as number
              break
            }
          }
        } else {
          results[index] = g || 0
        }
      })
      return results
    }

    /**
     * 根据条件返回 style，负责返回空对象
     *
     * @param withStyle 是否符合条件
     * @param appendStyle 如果符合条件要返回的 style 属性
     */
    const getStyle = (withStyle: boolean, appendStyle: CSSProperties) => {
      return withStyle ? appendStyle : {}
    }

    // const getColSpanStyle = (colSpan: CardProps['colSpan']) => {
    //   let span = colSpan
    //
    //   // colSpan 响应式
    //   if (typeof colSpan === 'object') {
    //     for (let i = 0; i < responsiveArray.length; i += 1) {
    //       const breakpoint: Breakpoint = responsiveArray[i]
    //       if (screens.value[breakpoint] && colSpan[breakpoint] !== undefined) {
    //         span = colSpan[breakpoint]
    //         break
    //       }
    //     }
    //   }
    //
    //   // 当 colSpan 为 30% 或 300px 时
    //   const colSpanStyle = getStyle(typeof span === 'string' && /\d%|\dpx/i.test(span), {
    //     width: span as string,
    //     flexShrink: 0
    //   })
    //
    //   return { span, colSpanStyle }
    // }

    const prefixCls = getPrefixCls('pro-card')

    const [horizonalGutter, verticalGutter] = getNormalizedGutter(props.gutter)

    // 判断是否套了卡片，如果套了的话将自身卡片内部内容的 padding 设置为0
    const containProCard = false
    // const childrenArray = React.Children.toArray(children) as ProCardChildType[]
    //
    // const childrenModified = childrenArray.map((element, index) => {
    //   if (element?.type?.isProCard) {
    //     containProCard = true
    //
    //     // 宽度
    //     const { colSpan } = element.props
    //     const { span, colSpanStyle } = getColSpanStyle(colSpan)
    //
    //     const columnClassName = [
    //       [`${prefixCls}-col`],
    //       {
    //         [`${prefixCls}-split-vertical`]:
    //           split === 'vertical' && index !== childrenArray.length - 1,
    //         [`${prefixCls}-split-horizontal`]:
    //           split === 'horizontal' && index !== childrenArray.length - 1,
    //         [`${prefixCls}-col-${span}`]: typeof span === 'number' && span >= 0 && span <= 24
    //       }
    //     ]
    //
    //     return (
    //       <div
    //         style={{
    //           ...colSpanStyle,
    //           ...getStyle(horizonalGutter! > 0, {
    //             paddingRight: horizonalGutter / 2,
    //             paddingLeft: horizonalGutter / 2
    //           }),
    //           ...getStyle(verticalGutter! > 0, {
    //             paddingTop: verticalGutter / 2,
    //             paddingBottom: verticalGutter / 2
    //           })
    //         }}
    //         key={`pro-card-col-${element?.key || index}`}
    //         class={columnClassName}
    //       >
    //         {React.cloneElement(element)}
    //       </div>
    //     )
    //   }
    //   return element
    // })

    const cardCls = [
      `${prefixCls}`,
      attrs.class,
      {
        [`${prefixCls}-border`]: props.bordered,
        [`${prefixCls}-contain-card`]: containProCard,
        [`${prefixCls}-loading`]: props.loading,
        [`${prefixCls}-split`]: props.split === 'vertical' || props.split === 'horizontal',
        [`${prefixCls}-ghost`]: props.ghost,
        [`${prefixCls}-hoverable`]: props.hoverable,
        [`${prefixCls}-size-${props.size}`]: props.size,
        [`${prefixCls}-type-${props.type}`]: props.type,
        [`${prefixCls}-collapse`]: collapsed.value,
        [`${prefixCls}-checked`]: props.checked
      }
    ]

    const bodyCls = [
      `${prefixCls}-body`,
      {
        [`${prefixCls}-body-center`]: props.layout === 'center',
        [`${prefixCls}-body-direction-column`]:
          props.split === 'horizontal' || props.direction === 'column',
        [`${prefixCls}-body-wrap`]: props.wrap && containProCard
      }
    ]

    const cardBodyStyle = {
      ...getStyle(horizonalGutter! > 0, {
        marginRight: -horizonalGutter / 2,
        marginLeft: -horizonalGutter / 2
      }),
      ...getStyle(verticalGutter! > 0, {
        marginTop: -verticalGutter / 2,
        marginBottom: -verticalGutter / 2
      }),
      ...props.bodyStyle
    }

    const loadingDOM = slots.loading ? (
      slots.loading()
    ) : (
      <Loading
        prefix={prefixCls}
        // @ts-ignore
        style={
          props.bodyStyle.padding === 0 || props.bodyStyle.padding === '0px'
            ? { padding: 24 }
            : undefined
        }
      />
    )

    // 非受控情况下展示
    const collapsibleButton =
      props.collapsible &&
      props.collapsed === undefined &&
      (props.collapsibleIconRender ? (
        props.collapsibleIconRender({ collapsed: collapsed.value })
      ) : (
        <RightOutlined
          rotate={!collapsed.value ? 90 : undefined}
          class={`${prefixCls}-collapsible-icon`}
        />
      ))

    return () => (
      <div
        class={cardCls}
        style={attrs.style as CSSProperties}
        onClick={e => {
          props.onChecked?.(e)
          props?.onClick?.(e)
        }}
      >
        {(props.title || props.extra || collapsibleButton) && (
          <div
            class={[
              `${prefixCls}-header`,
              {
                [`${prefixCls}-header-border`]: props.headerBordered || props.type === 'inner',
                [`${prefixCls}-header-collapsible`]: collapsibleButton
              }
            ]}
            style={props.headStyle}
            onClick={() => {
              if (collapsibleButton) setCollapsed(!collapsed)
            }}
          >
            <div class={`${prefixCls}-title`}>
              {collapsibleButton}
              <LabelIconTip
                label={props.title}
                tooltip={props.tooltip || props.tip}
                subTitle={props.subTitle}
              />
            </div>
            {props.extra && <div class={`${prefixCls}-extra`}>{props.extra}</div>}
          </div>
        )}
        {props.tabs ? (
          <div class={`${prefixCls}-tabs`}>
            <Tabs onChange={props.tabs.onChange} {...props.tabs}>
              {props.loading ? loadingDOM : slots.default?.()}
            </Tabs>
          </div>
        ) : (
          <div class={bodyCls} style={cardBodyStyle}>
            {props.loading ? loadingDOM : slots.default?.()}
          </div>
        )}
        {<Actions actions={props.actions} prefixCls={prefixCls} />}
      </div>
    )
  }
})

export default Card
