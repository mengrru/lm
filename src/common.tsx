import React, { useEffect, useRef, useState } from 'react'
import { saveAs } from 'file-saver'
import { getImageValidRegion } from './utils'
import {withRouter} from 'react-router'

/**
 * SaveTextLink
 * input: filename, file content
 */
type SaveTextLinkProps = {
  filename: string
  fileContent: string
  children: React.ReactNode
}

export function SaveTextLink (props: SaveTextLinkProps) {
  function createBlob (): Blob {
    return new Blob([props.fileContent], { type: "text/plain;charset=utf-8" })
  }
  function save () {
    saveAs(createBlob(), props.filename)
  }
  return (
    <a
      href="#"
      onClick={() => save()}
    >
      {props.children}
    </a>
  )
}

/** ShowImage
 * input: image file blob : File
 * show: image
 */
type ShowLocalImageProps = {
    imageFile: File | null
}
export function ShowLocalImage (props: ShowLocalImageProps) {
  const [imageBase64String, setImageBase64String] = useState('')

  function transFileToBase64 (imageFile: File | null) {
    if (!imageFile) {
        return
    }
    const reads = new FileReader()
    reads.readAsDataURL(imageFile)
    reads.onload = (e) => {
      if (e.target?.result === imageBase64String) {
        return
      }
      setImageBase64String(e.target!.result as string)
    }
  }
  transFileToBase64(props.imageFile)
  console.log('showimage repeat exec test')
  return (
    <img
      src={imageBase64String}
      alt=""
    ></img>
  )
}

/** DirUploadInput
 * upload a dir, return a FileList
 * output: file list : FileList
 */
type DirUploadInputProps = {
  handleOutput: (fileList: FileList) => void
}

export function DirUploadInput (props: DirUploadInputProps) {
  const $input: React.MutableRefObject<HTMLInputElement | null> = useRef(null)

  useEffect(() => {
    if (!$input.current) {
      return
    }
    $input.current.setAttribute('webkitdirectory', '')
    $input.current.setAttribute('directory', '')
  }, [$input])

  return (
    <div>
      <input
        type="file" name="file"
        ref={$input}
        multiple
        onChange={e => props.handleOutput(e.target.files as FileList)}
      ></input>
    </div>
  )
}

/**
 * ImageOnCanvas
 * show a image on canvas
 */
type ImageOnCanvasProps = {
  // change imageObj to pathArr or def a new component to pack this component
  imageObjs: HTMLImageElement[],
  canvasSize: [number, number],
  border: number
}
export function ImageOnCanvas (props: ImageOnCanvasProps) {
  const $canvas = useRef(document.createElement('canvas'))

  useEffect(() => {
    props.imageObjs.forEach(e => {
      try {
        draw(e)
      } catch (err) {
        console.log(err.message)
      }
    })
  })
  function draw (imageObj: HTMLImageElement) {
    const imageW = imageObj.width
    const imageH = imageObj.height
    const [canvasW, canvasH] = props.canvasSize
    const border = props.border
    $canvas.current!.width = canvasW
    $canvas.current!.height = canvasH
    const ctx = $canvas.current!.getContext('2d')
    ctx?.drawImage(imageObj, 0, 0, canvasW, canvasH)
    const [sx, sy, sWidth, sHeight] = getImageValidRegion(ctx!.getImageData(0, 0, canvasW, canvasH))
    ctx?.clearRect(0, 0, canvasW, canvasH)
    let canvasRegion: [number, number, number, number]
    if (sWidth > sHeight) {
      canvasRegion = [
        border, 
        (canvasH - (canvasW - 2 * border) / sWidth * sHeight) / 2,
        canvasW - 2 * border,
        (canvasW - 2 * border) / sWidth * sHeight
      ]
    } else {
      canvasRegion = [
        (canvasW - (canvasH - 2 * border) / sHeight * sWidth) / 2,
        border, 
        (canvasH - 2 * border) / sHeight * sWidth,
        canvasH - 2 * border
      ]
    }
    ctx!.drawImage(
      imageObj,
      sx / canvasW * imageW,
      sy / canvasH * imageH,
      sWidth / canvasW * imageW,
      sHeight / canvasH * imageH,
      ...canvasRegion
    )
  }
  return (
    <canvas ref={$canvas}></canvas>
  )
}

type PopupProps = {
  content: string | null
}
export function Popup (props: PopupProps) {
  const css: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 200,
    visibility: props.content === null ? 'hidden' : 'visible'
  }
  return (
    <div style={{position: 'relative'}}>
      <div className="popup" style={css} >
        {
          props.content
            ? <img style={{width: '100%'}} src={props.content} alt="" />
            : <div></div>
        }
      </div>
    </div>
  )
}

function ScrollToTop ({ history }: any) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0)
    })
    return () => unlisten()
  })
  return (null)
}

export const ScrollToTopUsedInRouter = withRouter(ScrollToTop)
