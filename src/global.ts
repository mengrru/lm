import React, {useState} from 'react'
import { Config, Metadata } from './data-format-def'

const actualWidth = document.body.clientWidth * 0.7 * 0.94

const GlobalContext = React.createContext({
  config: {} as Config,
  metadata: {} as Metadata,
  root: '',
  width: 200,

  setRoot (data: string) {},
  setConfig (data: Config) {},
  setMetadata (data: Metadata) {},
  setWidth (data: number) {}
})

const useGlobalContext = () => {
  const [config, setConfig] = useState({} as Config)
  const [metadata, setMetadata] = useState({} as Metadata)
  const [root, setRoot] = useState('')
  const [width, setWidth] = useState(
    actualWidth > 400
      ? 400 * 0.94
      : (actualWidth < 330 
          ? 330 * 0.94
          : actualWidth)
  )

  return {
    config,
    metadata,
    root,
    width,
    setRoot,
    setMetadata,
    setConfig,
    setWidth
  }
}

const ImageCache: { [picId: string]: HTMLImageElement } = {}

export { GlobalContext }
export { useGlobalContext }
export { ImageCache }

