import { Metadata, MINI_DIR, PicMetadata, PicsMetadata, PICS_DIR, PathHash } from './data-format-def'
import { Md5 } from 'ts-md5/dist/md5'

function hash (s: string): string {
    return Md5.hashStr(s) as string
}
function getPathHash (picRealPath: string): PathHash {
    // realPath: PICS_DIR/className/itemName
    return hash(picRealPath)
}
export function genMetadata (fileList: FileList): Metadata {
    /**
     * webkitRelativePath: sourcesName/PICS_DIR/className/itemName
     *                     sourcesName/PICS_DIR/className/MINI_NAME/itemName
     * path: PICS_DIR/className/itemName
     * miniPath: PICS_DIR/className/mini/itemName
     */
    const fileArr = Array.from(fileList)
    const result: PicsMetadata = {}
    const hashArr: PathHash[] = []
    for (const file of fileArr) {
        // @ts-ignore
        const path: string = file.webkitRelativePath
        const pathSplit = path.split('/')
        if (pathSplit[1] !== PICS_DIR) {
            continue
        }
        // PICS_DIR/className/itemName
        const realPath = pathSplit.slice(1, 3).join('/') + '/' + pathSplit[pathSplit.length - 1]
        const id = getPathHash(realPath)
        if (!result[id]) {
            hashArr.push(id)
            result[id] = {} as PicMetadata
        }
        if (pathSplit[3] === MINI_DIR) {
            result[id].miniPath = pathSplit.slice(1).join('/')
        } else {
            result[id].path = realPath
            result[id].id = id
        }
    }
    return {
        hash: genHashFromPicsHash(hashArr),
        data: result
    }
}

export function genHashFromPicsFileList (fileList: FileList): string {
    /**
     * webkitRelativePath: sourcesName/PICS_DIR/className/itemName
     *                     sourcesName/PICS_DIR/className/MINI_NAME/itemName
     */
    const fileArr = Array.from(fileList)
    const hashArr = []
    for (const file of fileArr) {
        // @ts-ignore
        const path: string = file.webkitRelativePath
        const pathSplit = path.split('/')
        if (pathSplit[1] !== PICS_DIR || pathSplit[3] === MINI_DIR) {
            continue
        }
        // PICS_DIR/className/itemName
        hashArr.push(hash(pathSplit.slice(1).join('/')))
    }
    return genHashFromPicsHash(hashArr)
}

function genHashFromPicsHash (picsHash: PathHash[]): string {
    return hash(picsHash.sort((a, b) => a > b ? 1 : -1).join(''))
}