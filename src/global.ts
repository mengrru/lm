import { Config, Metadata } from './data-format-def'
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