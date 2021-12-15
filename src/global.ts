import React, {useMemo, useState} from 'react'
import { Config, Metadata } from './data-format-def'

const GlobalContext = React.createContext({
  config: {} as Config,
  metadata: {} as Metadata,
  root: '',
  width: 200,

  setRoot (data: string) {},
  setConfig (data: Config) {},
  setMetadata (data: Metadata) {},
  updateClientWidth () {}
})

const useGlobalContext = () => {
  const [config, setConfig] = useState({} as Config)
  const [metadata, setMetadata] = useState({} as Metadata)
  const [root, setRoot] = useState('')
  const [clientWidth, setClientWidth] = useState(document.body.clientWidth)

  const width = useMemo(() => {
    const width = clientWidth * 0.7 * 0.94
    return width > 400 ? 400 * 0.94 : (width < 330 ? 330 * 0.94 : width)
  } , [clientWidth])

  return {
    config,
    metadata,
    root,
    width,
    setRoot,
    setMetadata,
    setConfig,
    updateClientWidth () {
      setClientWidth(document.body.clientWidth)
    }
  }
}

const ImageCache: { [picId: string]: HTMLImageElement } = {}

export { GlobalContext }
export { useGlobalContext }
export { ImageCache }

