<template>
  <div>
    <img ref="imageRef" :src="props.src" :alt="props.alt" :style="[imageStyle, props.imgStyle]" />
  </div>
</template>

<script setup lang="ts">
import Cropper from 'cropperjs'
import type SetDataOptions from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { onMounted, ref, toRaw } from 'vue'
import type { CSSProperties, PropType } from 'vue'

/* Ensure the size of the image fit the container perfectly */
const imageStyle = {
  display: 'block',
  /* This rule is very important, please don't ignore this */
  maxWidth: '100%'
}

const props = defineProps({
  // custom props
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'image'
  },
  imgStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },

  // ========= CropperJS options =======
  // Define the view mode of the cropper
  viewMode: {
    type: Number as PropType<Cropper.ViewMode>, // 0, 1, 2, 3
    default: 0
  },

  // Define the dragging mode of the cropper
  dragMode: {
    type: String as PropType<Cropper.DragMode>, // 'crop', 'move' or 'none'
    default: 'crop'
  },

  // Define the initial aspect ratio of the crop box
  initialAspectRatio: {
    type: Number,
    default: NaN
  },

  // Define the aspect ratio of the crop box
  aspectRatio: {
    type: Number,
    default: NaN
  },

  // An object with the previous cropping result data
  data: {
    type: Object as PropType<SetDataOptions>,
    default: undefined
  },

  // A selector for adding extra containers to preview
  preview: {
    type: String,
    default: ''
  },

  // Re-render the cropper when resize the window
  responsive: {
    type: Boolean,
    default: true
  },

  // Restore the cropped area after resize the window
  restore: {
    type: Boolean,
    default: true
  },

  // Check if the current image is a cross-origin image
  checkCrossOrigin: {
    type: Boolean,
    default: true
  },

  // Check the current image's Exif Orientation information
  checkOrientation: {
    type: Boolean,
    default: true
  },

  // Show the black modal
  modal: {
    type: Boolean,
    default: true
  },

  // Show the dashed lines for guiding
  guides: {
    type: Boolean,
    default: true
  },

  // Show the center indicator for guiding
  center: {
    type: Boolean,
    default: true
  },

  // Show the white modal to highlight the crop box
  highlight: {
    type: Boolean,
    default: true
  },

  // Show the grid background
  background: {
    type: Boolean,
    default: true
  },

  // Enable to crop the image automatically when initialize
  autoCrop: {
    type: Boolean,
    default: true
  },

  // Define the percentage of automatic cropping area when initializes
  autoCropArea: {
    type: Number,
    default: 0.8
  },

  // Enable to move the image
  movable: {
    type: Boolean,
    default: true
  },

  // Enable to rotate the image
  rotatable: {
    type: Boolean,
    default: true
  },

  // Enable to scale the image
  scalable: {
    type: Boolean,
    default: true
  },

  // Enable to zoom the image
  zoomable: {
    type: Boolean,
    default: true
  },

  // Enable to zoom the image by dragging touch
  zoomOnTouch: {
    type: Boolean,
    default: true
  },

  // Enable to zoom the image by wheeling mouse
  zoomOnWheel: {
    type: Boolean,
    default: true
  },

  // Define zoom ratio when zoom the image by wheeling mouse
  wheelZoomRatio: {
    type: Number,
    default: 0.1
  },

  // Enable to move the crop box
  cropBoxMovable: {
    type: Boolean,
    default: true
  },

  // Enable to resize the crop box
  cropBoxResizable: {
    type: Boolean,
    default: true
  },

  // Toggle drag mode between "crop" and "move" when click twice on the cropper
  toggleDragModeOnDblclick: {
    type: Boolean,
    default: true
  },

  // Size limitation
  minCanvasWidth: {
    type: Number,
    default: 0
  },
  minCanvasHeight: {
    type: Number,
    default: 0
  },
  minCropBoxWidth: {
    type: Number,
    default: 0
  },
  minCropBoxHeight: {
    type: Number,
    default: 0
  },
  minContainerWidth: {
    type: Number,
    default: 200
  },
  minContainerHeight: {
    type: Number,
    default: 100
  },

  // Shortcuts of events
  ready: {
    type: Function as PropType<(event: Cropper.ReadyEvent<EventTarget>) => void>,
    default: undefined
  },
  cropstart: {
    type: Function as PropType<(event: Cropper.CropStartEvent) => void>,
    default: undefined
  },
  cropmove: {
    type: Function as PropType<(event: Cropper.CropMoveEvent) => void>,
    default: undefined
  },
  cropend: {
    type: Function as PropType<(event: Cropper.CropEndEvent) => void>,
    default: undefined
  },
  crop: {
    type: Function as PropType<(event: Cropper.CropEvent) => void>,
    default: undefined
  },
  zoom: {
    type: Function as PropType<(event: Cropper.ZoomEvent) => void>,
    default: undefined
  }
})

const imageRef = ref()

let cropper: Cropper
onMounted(() => {
  cropper = new Cropper(imageRef.value, toRaw(props) as unknown as Cropper.Options)
})

defineExpose({
  // Clear the crop box
  clear() {
    return cropper?.clear()
  },

  // Show the crop box manually
  crop() {
    return cropper?.crop()
  },

  /**
   * Destroy the cropper and remove the instance from the image
   * @returns {Cropper} this
   */
  destroy() {
    return cropper?.destroy()
  },

  // Disable (freeze) the cropper
  disable() {
    return cropper?.disable()
  },

  // Enable (unfreeze) the cropper
  enable() {
    return cropper?.enable()
  },

  /**
   * Get the canvas position and size data.
   * @returns {Object} The result canvas data.
   */
  getCanvasData() {
    return cropper?.getCanvasData()
  },

  /**
   * Get the container size data.
   * @returns {Object} The result container data.
   */
  getContainerData() {
    return cropper?.getContainerData()
  },

  /**
   * Get the crop box position and size data.
   * @returns {Object} The result crop box data.
   */
  getCropBoxData() {
    return cropper?.getCropBoxData()
  },

  /**
   * Get a canvas drawn the cropped image.
   * @param {Object} [options={}] - The config options.
   * @returns {HTMLCanvasElement} - The result canvas.
   */
  getCroppedCanvas(options?: Cropper.GetCroppedCanvasOptions) {
    return cropper?.getCroppedCanvas(options)
  },

  /**
   * Get the cropped area position and size data (base on the original image)
   * @param {boolean} [rounded=false] - Indicate if round the data values or not.
   * @returns {Object} The result cropped data.
   */
  getData(rounded?: boolean) {
    return cropper?.getData(rounded)
  },

  /**
   * Get the image position and size data.
   * @returns {Object} The result image data.
   */
  getImageData() {
    return cropper?.getImageData()
  },

  /**
   * Move the canvas with relative offsets
   * @param {number} offsetX - The relative offset distance on the x-axis.
   * @param {number} [offsetY=offsetX] - The relative offset distance on the y-axis.
   * @returns {Cropper} this
   */
  move(offsetX: number, offsetY?: number) {
    return cropper?.move(offsetX, offsetY)
  },

  /**
   * Move the canvas to an absolute point
   * @param {number} x - The x-axis coordinate.
   * @param {number} [y=x] - The y-axis coordinate.
   * @returns {Cropper} this
   */
  moveTo(x: number, y?: number) {
    return cropper?.moveTo(x, y)
  },

  /**
   * Replace the image's src and rebuild the cropper
   * @param {string} url - The new URL.
   * @param {boolean} [hasSameSize] - Indicate if the new image has the same size as the old one.
   * @returns {Cropper} this
   */
  replace(url: string, hasSameSize?: boolean) {
    return cropper?.replace(url, hasSameSize)
  },

  // Reset the image and crop box to their initial states
  reset() {
    return cropper?.reset()
  },

  /**
   * Rotate the canvas with a relative degree
   * @param {number} degree - The rotate degree.
   * @returns {Cropper} this
   */
  rotate(degree: number) {
    return cropper?.rotate(degree)
  },

  /**
   * Rotate the canvas to an absolute degree
   * @param {number} degree - The rotate degree.
   * @returns {Cropper} this
   */
  rotateTo(degree: number) {
    return cropper?.rotateTo(degree)
  },

  /**
   * Scale the image
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
   * @returns {Cropper} this
   */
  scale(scaleX: number, scaleY?: number) {
    return cropper?.scale(scaleX, scaleY)
  },

  /**
   * Scale the image on the x-axis.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @returns {Cropper} this
   */
  scaleX(scaleX: number) {
    cropper.scaleX(-1)
    cropper.scaleX(-1)
    return cropper?.scaleX(scaleX)
  },

  /**
   * Scale the image on the y-axis.
   * @param {number} scaleY - The scale ratio on the y-axis.
   * @returns {Cropper} this
   */
  scaleY(scaleY: number) {
    return cropper?.scaleY(scaleY)
  },

  /**
   * Change the aspect ratio of the crop box.
   * @param {number} aspectRatio - The new aspect ratio.
   * @returns {Cropper} this
   */
  setAspectRatio(aspectRatio: number) {
    return cropper?.setAspectRatio(aspectRatio)
  },

  /**
   * Set the canvas position and size with new data.
   * @param {Object} data - The new canvas data.
   * @returns {Cropper} this
   */
  setCanvasData(data: Cropper.SetCanvasDataOptions) {
    return cropper?.setCanvasData(data)
  },

  /**
   * Set the crop box position and size with new data.
   * @param {Object} data - The new crop box data.
   * @returns {Cropper} this
   */
  setCropBoxData(data: Cropper.SetCropBoxDataOptions) {
    return cropper?.setCropBoxData(data)
  },

  /**
   * Set the cropped area position and size with new data
   * @param {Object} data - The new data.
   * @returns {Cropper} this
   */
  setData(data: Cropper.SetDataOptions) {
    return cropper?.setData(data)
  },

  /**
   * Change the drag mode.
   * @param {string} dragMode - The new drag mode.
   * @returns {Cropper} this
   */
  setDragMode(dragMode: Cropper.DragMode) {
    return cropper?.setDragMode(dragMode)
  },

  /**
   * Zoom the canvas with a relative ratio
   * @param {number} ratio - The target ratio.
   * @returns {Cropper} this
   */
  zoom(ratio: number) {
    return cropper?.zoom(ratio)
  },

  /**
   * Zoom the canvas to an absolute ratio
   * @param {number} ratio - The target ratio.
   * @param {Object} pivot - The zoom pivot point coordinate.
   * @returns {Cropper} this
   */
  zoomTo(ratio: number, pivot?: { x: number; y: number }) {
    return cropper?.zoomTo(ratio, pivot)
  },

  /**
   * flip the image horizontally
   */
  flipX() {
    const { scaleX } = cropper.getData()
    cropper.scaleX(-scaleX)
  },

  /**
   * flip the image vertically
   */
  flipY() {
    const { scaleY } = cropper.getData()
    cropper.scaleY(-scaleY)
  }
})
</script>
