import React, { RefObject } from 'react'
import { saveAs } from 'file-saver'

/**
 * SaveTextLink
 * input: filename, file content
 */
type SaveTextLinkProps = {
  filename: string
  fileContent: string
  class: string
}
type SaveTextLinkState = {
}

export class SaveTextLink extends React.Component<SaveTextLinkProps, SaveTextLinkState> {
  constructor (props: SaveTextLinkProps) {
    super(props)
  }
  createBlob (): Blob {
    return new Blob([this.props.fileContent], { type: "text/plain;charset=utf-8" })
  }
  save () {
    saveAs(this.createBlob(), this.props.filename)
  }
  render () {
    return (
      <a
        href="#"
        onClick={() => this.save()}
        className={this.props.class}
      >
        {this.props.children}
      </a>
    )
  }
}

/** ShowImage
 * input: image file blob : File
 * show: image
 */
type ShowLocalImageState = {
    imageBase64String: string
}
type ShowLocalImageProps = {
    imageFile: File | null
}
export class ShowLocalImage extends React.Component<ShowLocalImageProps, ShowLocalImageState> {
  constructor (props: ShowLocalImageProps) {
    super(props)
    this.state = {
        imageBase64String: ''
    }
  }
  transFileToBase64 (imageFile: File | null) {
    if (!imageFile) {
        return
    }
    const reads = new FileReader()
    reads.readAsDataURL(imageFile)
    reads.onload = (e) => {
      if (e.target?.result === this.state.imageBase64String) {
        return
      }
      this.setState({
        imageBase64String: e.target!.result as string
      })
    }
  }
  render () {
    this.transFileToBase64(this.props.imageFile)
    console.log('showimage repeat exec test')
    return (
      <img
        src={this.state.imageBase64String}
        alt=""
      ></img>
    )
  }
}

/** DirUploadInput
 * upload a dir, return a FileList
 * output: file list : FileList
 */
type DirUploadInputState = {
  files: FileList | null
}
type DirUploadInputProps = {
  handleOutput: (fileList: FileList) => void
}

export class DirUploadInput extends React.Component<DirUploadInputProps, DirUploadInputState> {
  selectDirInput: RefObject<HTMLInputElement>

  constructor (props: DirUploadInputProps) {
    super(props)
    this.selectDirInput = React.createRef()
    this.state = {
      files: null
    }
  }
  componentDidMount () {
    this.initSelectDirInput(this.selectDirInput.current)
  }
  initSelectDirInput (input: HTMLInputElement | null) {
    if (!input) {
      return
    }
    input.setAttribute('webkitdirectory', '')
    input.setAttribute('directory', '')
    input.setAttribute('multiple', '')
  }
  onGetFiles (event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      files: event.target.files
    })
    this.props.handleOutput(event.target.files as FileList)
  }
  render () {
    return (
      <div>
        <input
          type="file" name="file"
          ref={this.selectDirInput}
          onChange={this.onGetFiles.bind(this)}
        ></input>
      </div>
    )
  }
}

