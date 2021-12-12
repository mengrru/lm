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
 * root.json
 */
export type Root = {
    root: string
}
/**
 * metadata.json
 */
export type PicMetadata = {
    id: PathHash
    path: PicPath
    miniPath?: PicMiniPath
    filename: string
}
export type PicMetadataSet = {
    [id: string]: PicMetadata
}
export type Metadata = {
    hash: string,
    data: PicMetadataSet
}

/**
 * config.json
 */
export type Config = {
    root: string //discard
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
        [categoryTitle: string]: {
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
                pic: {
                    picId: PathHash
                    defaultPosition: PicPosition
                }
            }[]
        }
    }
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
    category: {
        [categoryTitle: string]: {
            title: string
            allowBlank: boolean
            hide: boolean
            index: number
        }
    }
}

export type CategoryInfoFromForm = ConfigFromForm['category']

/**
 * category raw data, generate from pics metadata
 */
export type CategoryRawData = {
    [categoryTitle: string]: {
        info: {
            title: string
            icon: PicPath // from sourceName, but not implement
            defaultPic: PathHash
        }
        items: {
            [itemTitle: string]: Config['category']['']['items'][0]          }
    }
}

/**
 * user output data
 */
export type UserOutputData = {
    [categoryTitle: string]: {
        itemId: ArrayIndex
        itemTitle: string
        pic: {
            picId: PathHash
            path: PicPath
            miniPath: PicMiniPath
            position: PicPosition
            size: PicSize
            index: number
        }
    }
}
