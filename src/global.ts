import React, {useState} from 'react'
import { Config, Metadata } from './data-format-def'

const GlobalContext = React.createContext({
    config: {} as Config,
    metadata: {} as Metadata,
    root: '',

    setRoot (data: string) {},
    setConfig (data: Config) {},
    setMetadata (data: Metadata) {},
})

const useGlobalContext = () => {
    const [config, setConfig] = useState({} as Config)
    const [metadata, setMetadata] = useState({} as Metadata)
    const [root, setRoot] = useState('')

    return {
        config,
        metadata,
        root,
        setRoot,
        setMetadata,
        setConfig,
    }
}

const ImageCache: { [picId: string]: HTMLImageElement } = {}

export { GlobalContext }
export { useGlobalContext }
export { ImageCache }

export default {
    imageCache: {}
} as {
    config?: Config,
    metadata?: Metadata,
    root?: string,
    imageCache: {
        [picId: string]: HTMLImageElement
    }
}
