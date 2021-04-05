export type PathHash = string
export type FullPath = string // sourceName/*
export type PicPath = string // PIC_DIR/CategoryName/picName
export type PicMiniPath = string // PIC_DIR/CategoryName/MINI_DIR/picName
export type PicPosition = [number, number] // percentage
export type PicSize = [number, number] // percentage
export type ArrayIndex = number

export const MINI_DIR = 'mini'
export const PICS_DIR = 'pics'
export const CONFIG_FILENAME = 'config.json'
export const METADATA_FILENAME = 'metadata.json'

/**
 * metadata.json
 */
export type PicMetadata = {
    id: PathHash
    path: PicPath
    miniPath?: PicMiniPath
    filename: string
}
export type PicsMetadata = {
    [id: string]: PicMetadata
}
export type Metadata = {
    hash: string,
    data: PicsMetadata
}

/**
 * config.json
 */
export type Config = {
    root: string
    info: {
        author: {
            name: string
            email: string
            website: string
        }
        interface: {
            headImg: FullPath
            footerImg: FullPath
            backgroundImg: FullPath
            footerText: string
            previewWidth: number
            previewHeight: number
        }
        cover: FullPath
        title: string
    }
    category: {
        info: {
            title: string
            icon: FullPath
            defaultPic: PathHash
            allowBlank: boolean
            hide: boolean
            index: number
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
 * form data
 */
export type ConfigFromForm = {
    info: {
        author: {
            name: string
            email: string
            website: string
        }
        interface: {
            footerText: string
        }
        title: string
    }
    category: CategoryInfoFromForm
    
}

export type CategoryInfoFromForm = {
    [title: string]: {
        title: string
        allowBlank: boolean
        hide: boolean
        index: number
    }
}

/**
 * category raw data, generate from pics metadata
 */
export type CategoryRawData = {
    [title: string]: {
        info: {
            title: string
            icon: PicPath // from sourceName, but not implement
            defalutPic: PathHash
        }
        items: {
            [title: string]: {
                title: string
                pics: {
                    picId: PathHash
                    defaultPosition: PicPosition
                }[]
            }
        }
    }
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
        index: number
    }[]
}[]