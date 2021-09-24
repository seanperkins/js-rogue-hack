import {useEffect} from 'react'

interface IUseEventHandlersProps {
  onClick?: (e: MouseEvent) => void
  onKeydown?: (e: KeyboardEvent) => void
}

export default function useEventHandlers({
  onClick,
  onKeydown,
}: IUseEventHandlersProps) {
  useEffect(() => {
    function _onClick(e) {
      onClick && onClick(e)
    }

    function _onKeydown(e) {
      onKeydown && onKeydown(e)
    }
    const canvas = document.getElementsByTagName('canvas')[0]
    canvas.addEventListener('click', _onClick)
    window.addEventListener('keydown', _onKeydown)
    return () => {
      canvas.removeEventListener('click', _onClick)
      window.removeEventListener('keydown', _onKeydown)
    }
  }, [onClick, onKeydown])

  return null
}
