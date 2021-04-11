import { Metadata, MINI_DIR, PicMetadata, PicsMetadata, PICS_DIR, PathHash, CategoryRawData, ConfigFromForm, Config, FullPath, UserOutputData } from './data-format-def'
import { Md5 } from 'ts-md5/dist/md5'
import Global from './global'

function hash (s: string): string {
    return Md5.hashStr(s) as string
}
function getPathHash (picRealPath: string): PathHash {
    // realPath: PICS_DIR/className/itemName
    return hash(picRealPath)
}
export function genMetadata (sourceFileList: FileList): Metadata {
    /**
     * webkitRelativePath: sourcesName/PICS_DIR/className/itemName
     *                     sourcesName/PICS_DIR/className/MINI_NAME/itemName
     * path: PICS_DIR/className/itemName
     * miniPath: PICS_DIR/className/mini/itemName
     */
    const fileArr = Array.from(sourceFileList)
    const result: PicsMetadata = {}
    const hashArr: PathHash[] = []
    for (const file of fileArr) {
        // @ts-ignore
        const path: string = file.webkitRelativePath
        const filename: string = file.name
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
            result[id].filename = filename
        }
    }
    return {
        hash: genHashFromPicsHash(hashArr),
        data: result
    }
}

export function genHashFromSourceFileList (sourceFileList: FileList): string {
    /**
     * webkitRelativePath: sourcesName/PICS_DIR/className/itemName
     *                     sourcesName/PICS_DIR/className/MINI_NAME/itemName
     */
    const fileArr = Array.from(sourceFileList)
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

export function getCategoryRawData (picsMetadata: PicsMetadata): CategoryRawData {
    const res: CategoryRawData = {}
    const getCategoryTitle = function (path: string): string {
        return path.split('/')[1]
    }
    const isIcon = function (filename: string): boolean {
        return /icon\.png/g.test(filename)
    }
    const isDefault = function (filename: string): boolean {
        return /default\..*\.png/g.test(filename)
    }
    const getItemTitle = function (filename: string): string {
        return filename.replace('default.', '').replace('.png', '')
    }
    for (const picId in picsMetadata) {
        const picInfo = picsMetadata[picId]
        const categoryTitle = getCategoryTitle(picInfo.path)
        if (!res[categoryTitle]) {
            res[categoryTitle] = {
                info: {
                    title: categoryTitle,
                    icon: '',
                    defaultPic: ''
                },
                items: {}
            }
        }
        if (isIcon(picInfo.filename)) {
            res[categoryTitle].info.icon = picInfo.path
            continue
        }
        if (isDefault(picInfo.filename)) {
            res[categoryTitle].info.defaultPic = picId
        }
        const itemTitle = getItemTitle(picInfo.filename)
        res[categoryTitle].items[itemTitle] = {
            title: itemTitle,
            pic: {
                picId: picId,
                defaultPosition: [0, 0]
            }
        }
    }
    return res
}

export function genConfig (configFromForm: ConfigFromForm, sourceFileList: FileList): Config {
    // thought fileList is not empty
    const fileArr = Array.from(sourceFileList)
    const picsMetadata: PicsMetadata = genMetadata(sourceFileList).data
    const categoryRawData: CategoryRawData = getCategoryRawData(picsMetadata)
    const getFullPath = function (name: string): FullPath {
        for (const file of fileArr) {
            // @ts-ignore
            const relaPathArr = file.webkitRelativePath.split('/')
            if (relaPathArr[1].split('.')[0] === name) {
                return relaPathArr.join('/')
            }
        }
        return ''
    }
    return {
        // @ts-ignore
        root: '/sources/' + fileArr[0].webkitRelativePath.split('/')[0] + '/',
        info: {
            author: configFromForm.info.author,
            interface: {
                headImg: getFullPath('headImg'),
                footerImg: getFullPath('footerImg'),
                backgroundImg: getFullPath('backgroundImg'),
                footerText: configFromForm.info.interface.footerText,
                previewHeight: 100,
                previewWidth: 100
            },
            cover: getFullPath('cover'),
            title: configFromForm.info.title
        },
        category: (function (categoryInfoFromForm, categoryRawData){
            const res: Config['category'] = {}
            Object.keys(categoryRawData).forEach((title) => {
                const raw = categoryRawData[title]
                const fromForm = categoryInfoFromForm[title]
                res[title] = {
                    info: {
                        title: title,
                        icon: raw.info.icon,
                        defaultPic: raw.info.defaultPic,
                        allowBlank: fromForm.allowBlank,
                        hide: fromForm.hide,
                        index: fromForm.index
                    },
                    items: Object.keys(raw.items).map(itemTitle => {
                        return raw.items[itemTitle]
                    })
                }
            })
            return res
        })(configFromForm.category, categoryRawData)
    }
}

export function getImageValidRegion (imageData: ImageData): [number, number, number, number] {
    const data = imageData.data
    const w = imageData.width, h = imageData.height
    // from 1
    const getIndex = function (row: number, col: number) {
        return (row - 1) * w * 4 + (col - 1) * 4
    }
    let sx = -1, sy = -1, sWidth = -1, sHeight = -1
    for (let i = 1; i <= h; i++) {
        for (let j = 1; j < w; j++) {
            if (data[getIndex(i, j) + 3] !== 0) {
                sy = i - 1
                break
            }
        }
        if (sy !== -1) {
            break
        }
    }
    for (let i = 1; i <= w; i++) {
        for (let j = 1; j <= h; j++) {
            if (data[getIndex(j, i) + 3] !== 0) {
                sx = i - 1
                break
            }
        }
        if (sx !== -1) {
            break
        }
    }
    for (let i = h; i >= 1; i--) {
        for (let j = 1; j <= w; j++) {
            if (data[getIndex(i, j) + 3] !== 0) {
                sHeight = i - sy
                break
            }
        }
        if (sHeight !== -1) {
            break
        }
    }
    for (let i = w; i >= 1; i--) {
        for (let j = 1; j <= h; j++) {
            if (data[getIndex(j, i) + 3] !== 0) {
                sWidth = i - sx
                break
            }
        }
        if (sWidth !== -1) {
            break
        }
    }
    return [sx, sy, sWidth, sHeight]
}

export function loadFile (path: string): Promise<string> {
    const request = new XMLHttpRequest()
    request.open('get', path)
    request.send(null)
    console.log('call loadFile')
    return new Promise((resolve, reject) => {
        request.onload = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    resolve(request.responseText)
                } else {
                    reject('Load file ' + path + ' failed.')
                }
            }
        }
    })
}

/**
 * 由于部分图片会先使用 img 标签加载，由于一些（未查证）的机制，浏览器会在后面再次请求该图时服用之前的相应。
 * 由于在后续的使用中要求图片对象携带跨域属性，所以在此处增加一条随机 query 以强制重新请求，确保此处返回的响应携带跨域属性
 */
export function loadImageWithoutCache (path: string): Promise<HTMLImageElement> {
    const img = new Image()
    img.src = path + '?t=' + Math.random()
    img.crossOrigin = ''
    return new Promise((resolve, reject) => {
        img.onload = (e) => {
            resolve(img)
        }
    })
}

export function asyncTest (): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('async test')
    }, 1000)
  })
}

export async function genOutputImage (userData: UserOutputData): Promise<HTMLCanvasElement> {
    const images: any[] = Object.keys(userData).map(cTitle => {
        return {
            imageObj: null,
            index: userData[cTitle].pic.index,
            path: userData[cTitle].pic.path,
            id: userData[cTitle].pic.picId
        }
    })
    /*
    for (const item of images) {
        const imageObj = await loadImage(item.path)
        item.imageObj = imageObj
    }
    */
   // 暂时认为Global中缓存的预览图是正常尺寸的图
   for (const item of images) {
        if (Global.imageCache[item.id]) {
            item.imageObj = Global.imageCache[item.id]
        } else {
            item.imageObj = await loadImageWithoutCache(item.path)
       }
   }
    const canvas = document.createElement('canvas')
    canvas.width = images[0].imageObj.width
    canvas.height = images[0].imageObj.height
    const ctx = canvas.getContext('2d')
    ctx!.fillStyle = '#ffffff'
    ctx?.fillRect(0, 0, canvas.width, canvas.height)
    images.sort((a, b) => a.index - b.index)
    for (const item of images) {
        if (item.imageObj) {
            ctx?.drawImage(item.imageObj, 0, 0)
        }
    }
    return canvas
}

export function isInEvilBrowser (): boolean {
    const ua = navigator.userAgent.toLowerCase()
    if (
        /micromessenger/g.test(ua) ||
        /weibo/g.test(ua) ||
        /qq/g.test(ua)
    ) {
        return true
    }
    return false
}

export function getAnPic (picId: string, path: string): HTMLImageElement {
    if (Global.imageCache[picId]) {
        return Global.imageCache[picId]
    }
    const imgObj = new Image()
    imgObj.crossOrigin = ''
    imgObj.src = path + '?t=' + Math.random()
    Global.imageCache[picId] = imgObj
    return imgObj
}

export function imageObjToBase64 (img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx!.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
}