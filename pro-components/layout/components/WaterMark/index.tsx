import type { CSSProperties, PropType } from 'vue'
import { getPrefixCls } from '../../RouteContext'

export type WaterMarkProps = {
  /** 水印样式 */
  markStyle?: CSSProperties
  /** 水印类名 */
  markClassName?: string
  /** 水印之间的水平间距 */
  gapX?: number
  /** 水印之间的垂直间距 */
  gapY?: number
  /** 追加的水印元素的z-index */
  zIndex?: number
  /** 水印的宽度 */
  width?: number
  /** 水印的高度 */
  height?: number
  /** 水印在canvas 画布上绘制的垂直偏移量，正常情况下，水印绘制在中间位置, 即 offsetTop = gapY / 2 */
  offsetTop?: number // 水印图片距离绘制 canvas 单元的顶部距离
  /** 水印在canvas 画布上绘制的水平偏移量, 正常情况下，水印绘制在中间位置, 即 offsetTop = gapX / 2 */
  offsetLeft?: number
  /** 水印绘制时，旋转的角度，单位 ° */
  rotate?: number
  /** ClassName 前缀 */
  prefixCls?: string
  /** 高清印图片源, 为了高清屏幕显示，建议使用 2倍或3倍图，优先使用图片渲染水印。 */
  image?: string
  /** 水印文字内容 */
  content?: string | string[]
  /** 文字颜色 */
  fontColor?: string
  /** 文字样式 */
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
  /** 文字族 */
  fontFamily?: string
  /** 文字粗细 */
  fontWeight?: 'normal' | 'light' | 'weight' | number
  /** 文字大小 */
  fontSize?: number | string
}

const waterMarkProps = {
  markStyle: {
    type: Object as PropType<WaterMarkProps['markStyle']>,
    default: () => undefined
  },
  markClassName: {
    type: String as PropType<WaterMarkProps['markClassName']>,
    default: ''
  },
  gapX: {
    type: Number,
    default: 212
  },
  gapY: {
    type: Number,
    default: 222
  },
  // antd 内容层 zIndex 基本上在 10 以下 https://github.com/ant-design/ant-design/blob/6192403b2ce517c017f9e58a32d58774921c10cd/components/style/themes/default.less#L335
  zIndex: {
    type: Number,
    default: 9
  },
  width: {
    type: Number,
    default: 120
  },
  height: {
    type: Number,
    default: 64
  },
  offsetTop: {
    type: Number,
    default: undefined
  },
  offsetLeft: {
    type: Number,
    default: undefined
  },
  // 默认旋转 -22 度
  rotate: {
    type: Number,
    default: -22
  },
  prefixCls: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  content: {
    type: [String, Array] as PropType<WaterMarkProps['content']>,
    default: ''
  },
  fontColor: {
    type: String,
    default: 'rgba(0,0,0,.15)'
  },
  fontStyle: {
    type: String,
    default: 'normal'
  },
  fontFamily: {
    type: String,
    default: 'sans-serif'
  },
  fontWeight: {
    type: [Number, String] as PropType<WaterMarkProps['fontWeight']>,
    default: 'normal'
  },
  fontSize: {
    type: [Number, String] as PropType<WaterMarkProps['fontSize']>,
    default: 16
  }
}

/**
 * 返回当前显示设备的物理像素分辨率与CSS像素分辨率之比
 *
 * @param context
 * @see api 有些废弃了，其实类型 CanvasRenderingContext2D
 */
const getPixelRatio = (context: any) => {
  if (!context) {
    return 1
  }
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1
  return (window.devicePixelRatio || 1) / backingStore
}

const WaterMark = defineComponent({
  name: 'WaterMark',
  props: waterMarkProps,
  setup(props, { slots, attrs }) {
    const prefixCls = getPrefixCls('pro-layout-watermark', props.prefixCls)
    const wrapperCls = [`${prefixCls}-wrapper`, attrs.class]
    const waterMakrCls = [prefixCls, props.markClassName]
    const base64Url = ref('')

    watchEffect(() => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const ratio = getPixelRatio(ctx)

      const canvasWidth = `${(props.gapX + props.width) * ratio}px`
      const canvasHeight = `${(props.gapY + props.height) * ratio}px`
      const canvasOffsetLeft = props.offsetLeft || props.gapX / 2
      const canvasOffsetTop = props.offsetTop || props.gapY / 2

      canvas.setAttribute('width', canvasWidth)
      canvas.setAttribute('height', canvasHeight)

      if (ctx) {
        // 旋转字符 rotate
        ctx.translate(canvasOffsetLeft * ratio, canvasOffsetTop * ratio)
        ctx.rotate((Math.PI / 180) * Number(props.rotate))
        const markWidth = props.width * ratio
        const markHeight = props.height * ratio

        if (props.image) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.referrerPolicy = 'no-referrer'
          img.src = props.image
          img.onload = () => {
            ctx.drawImage(img, 0, 0, markWidth, markHeight)
            base64Url.value = canvas.toDataURL()
          }
        } else if (props.content) {
          const markSize = Number(props.fontSize) * ratio
          ctx.font = `${props.fontStyle} normal ${props.fontWeight} ${markSize}px/${markHeight}px ${props.fontFamily}`
          ctx.fillStyle = props.fontColor
          if (Array.isArray(props.content)) {
            props.content?.forEach((item: string, index: number) =>
              ctx.fillText(item, 0, index * 50)
            )
          } else {
            ctx.fillText(props.content, 0, 0)
          }
          base64Url.value = canvas.toDataURL()
        }
      } else {
        // eslint-disable-next-line no-console
        console.error('当前环境不支持Canvas')
      }
    })

    return () => (
      <div
        style={{
          position: 'relative',
          ...(attrs.style as CSSProperties)
        }}
        class={wrapperCls}
      >
        {slots.default?.()}
        <div
          class={waterMakrCls}
          style={{
            zIndex: props.zIndex,
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundSize: `${props.gapX + props.width}px`,
            pointerEvents: 'none',
            backgroundRepeat: 'repeat',
            ...(base64Url
              ? {
                  backgroundImage: `url('${base64Url}')`
                }
              : null),
            ...props.markStyle
          }}
        />
      </div>
    )
  }
})

export default WaterMark
