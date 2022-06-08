export function hasClass(dom: HTMLElement, className: string) {
  className = className.replace(/^\s|\s$/g, '')

  return (
    (' ' + ((dom || {}).className || '').replace(/\s/g, ' ') + ' ').indexOf(
      ' ' + className + ' '
    ) >= 0
  )
}
