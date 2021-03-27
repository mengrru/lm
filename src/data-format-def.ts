type PathHash = string
type Path = string
type PicPosition = [number, number] // percentage
type PicSize = [number, number] // percentage
type ArrayIndex = number

/**
 * pics-metadata.json
 */
export type PicMetadata = {
    id: PathHash
    path: string
    miniPath: string
}
export type PicsMetadata = PicMetadata[]

/**
 * config.json
 */
export type Config = {
    info: {
        author: {
            name: string
            email: string
            website: string
        }
        interface: {
            headImg: Path
            footerImg: Path
            backgroundImg: Path
            footerText: string
            previewWidth: number
            previewHeight: number
        }
        inherentPic: PathHash
        cover: Path
        title: string
    }
    sources: {
        info: {
            title: string
            icon: Path
            defaultPic: PathHash
            allowBlank: boolean
        }
        items: {
            title: string
            pics: {
                picId: PathHash
                defaultPosition:  PicPosition
            }[]
        }[]
    }[]
}

/**
 * user output data
 */
export type UserOutputData = {
    sourceId: ArrayIndex
    itemId: ArrayIndex
    pics: {
        picId: PathHash
        position: PicPosition
        size: PicSize
    }[]
}[]