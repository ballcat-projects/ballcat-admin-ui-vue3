import type Cropper from 'cropperjs'

export interface VueCropperInstance {
  clear(): Cropper
  crop(): Cropper
  destroy(): Cropper
  disable(): Cropper
  enable(): Cropper
  getCanvasData(): Cropper.CanvasData
  getContainerData(): Cropper.ContainerData
  getCropBoxData(): Cropper.CropBoxData
  getCroppedCanvas(options?: Cropper.GetCroppedCanvasOptions): HTMLCanvasElement
  getData(rounded?: boolean): Cropper.Data
  getImageData(): Cropper.ImageData
  move(offsetX: number, offsetY?: number): Cropper
  moveTo(x: number, y?: number): Cropper
  replace(url: string, onlyColorChanged?: boolean): Cropper
  reset(): Cropper
  rotate(degree: number): Cropper
  rotateTo(degree: number): Cropper
  scale(scaleX: number, scaleY?: number): Cropper
  scaleX(scaleX: number): Cropper
  scaleY(scaleY: number): Cropper
  setAspectRatio(aspectRatio: number): Cropper
  setCanvasData(data: Cropper.SetCanvasDataOptions): Cropper
  setCropBoxData(data: Cropper.SetCropBoxDataOptions): Cropper
  setData(data: Cropper.SetDataOptions): Cropper
  setDragMode(dragMode: Cropper.DragMode): Cropper
  zoom(ratio: number): Cropper
  zoomTo(ratio: number, pivot?: { x: number; y: number }): Cropper

  flipX(): void
  flipY(): void
}
