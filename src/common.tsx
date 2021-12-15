import React, { RefObject, useEffect, useRef, useState } from 'react'
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
  className: string,
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
      className={props.className}
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
    $input.current.setAttribute('multiple', '')
  }, [$input])
  function onGetFiles (event: React.ChangeEvent<HTMLInputElement>) {
    props.handleOutput(event.target.files as FileList)
  }
  return (
    <div>
      <input
        type="file" name="file"
        ref={$input}
        onChange={onGetFiles}
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
type ImageOnCanvasState = {
}
export class ImageOnCanvas extends React.Component<ImageOnCanvasProps, ImageOnCanvasState> {
  canvasObj: RefObject<HTMLCanvasElement>

  constructor (props: ImageOnCanvasProps) {
    super(props)
    this.canvasObj = React.createRef()
  }
  componentDidMount () {
    this.props.imageObjs.forEach(e => {
      try {
        this.draw(e)
      } catch (err) {
        console.log(err.message)
      }
    })
  }
  draw (imageObj: HTMLImageElement) {
    const imageW = imageObj.width
    const imageH = imageObj.height
    const [canvasW, canvasH] = this.props.canvasSize
    const border = this.props.border
    this.canvasObj.current!.width = canvasW
    this.canvasObj.current!.height = canvasH
    const ctx = this.canvasObj.current!.getContext('2d')
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
  render () {
    return (
      <canvas
        ref={this.canvasObj}
      >
      </canvas>
    )
  }
}

type PopupProps = {
  content: string | null
}
type PopupState = {
}
export class Popup extends React.Component<PopupProps, PopupState> {
  constructor (props: PopupProps) {
    super(props)
  }
  onCloseBtnClick () {
    this.setState({
      isOpen: false
    })
  }
  componentDidUpdate () {
  }
  render () {
    const css: React.CSSProperties = {
      position: 'absolute',
      width: '100%',
      top: 0,
      left: 0,
      zIndex: 200,
      visibility: this.props.content === null ? 'hidden' : 'visible'
    }
    return (
      <div style={{position: 'relative'}}>
        <div
          className="popup"
          style={css}
        >
          {
            this.props.content
            ? <img style={{width: '100%'}} src={this.props.content} alt="" />
            : <div></div>
          }
        </div>
      </div>
    )
  }
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
