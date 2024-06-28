import { computed, defineComponent } from 'vue'
import { useProps } from '../../utils/props.ts'
import { useNameHelper } from '../../utils/namespace.ts'
import { isColor } from '../../utils/color.ts'
import { titleProps } from './props'

export default defineComponent({
  name: 'Title',
  props: titleProps,
  emits: [],
  setup(_props, { slots }) {
    const props = useProps('title', _props, {
      type: 'default',
      level: 5,
      top: false,
      marker: false,
      aligned: false,
      thin: false,
      markerType: null,
    })

    const nameHelper = useNameHelper('title')
    // const { isColorModifier } = useColor(['primary'])

    const coloredMarker = computed(() => isColor(props.markerType))
    const markerType = computed(() => props.markerType || props.type)
    const className = computed(() => {
      return {
        [nameHelper]: true,
        [`${nameHelper}-vars`]: true,
        [`${nameHelper}--inherit`]: props.inherit,
        [`${nameHelper}--${props.type}`]: props.type !== 'default',
        [`${nameHelper}--top`]: props.top,
        [`${nameHelper}--marker`]: props.marker,
        [`${nameHelper}--aligned`]: props.aligned,
        [`${nameHelper}--thin`]: props.thin,
        [`${nameHelper}--marker-${markerType.value}`]:
          !coloredMarker.value && markerType.value !== 'default',
      }
    })
    const level = computed(() => Math.max((Math.round(props.level), 1, 6) || 5))
    const style = computed(() => {
      return coloredMarker.value
        ? {
            [`${nameHelper}-marker-color`]: props.markerType,
          }
        : null
    })

    return () => {
      const CustomTag = `h${level.value}` as any

      return (
        <CustomTag class={className.value} style={style.value}>
          {slots.default?.()}
        </CustomTag>
      )
    }
  },
})
