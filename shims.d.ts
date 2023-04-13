declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@ckpack/vue-color' {
  import type { Component } from 'vue'
  const Alpha: Component
  const Checkboard: Component
  const Chrome: Component
  const Compact: Component
  const EditableInput: Component
  const Grayscale: Component
  const Hue: Component
  const Material: Component
  const Photoshop: Component
  const Saturation: Component
  const Sketch: Component
  const Slider: Component
  const Swatches: Component
  const Twitter: Component
}
