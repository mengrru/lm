import { UserOutputData } from './data-format-def'
import Global from './global'

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
 * ?????????????????????????????? img ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
 * ??????????????????????????????????????????????????????????????????????????????????????????????????? query ?????????????????????????????????????????????????????????????????????
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
   // ????????????Global??????????????????????????????????????????
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