import { genHashFromPicsHash, genHashFromSourceFileList, genMetadata, getPathHash, getRealPath, getRootName } from '../data-trans'

type MyFile = {
  name: string,
  webkitRelativePath: string
}
const MyFiles: MyFile[] = [
  { name: 'image.png', webkitRelativePath: 'test/pics/category1/image.png' },
  { name: 'image.png', webkitRelativePath: 'test/pics/category1/mini/image.png' },
  { name: 'image.png', webkitRelativePath: 'test/pics/category2/image.png' },
  { name: 'image2.png', webkitRelativePath: 'test/pics/category2/image2.png' },
  { name: 'default.image.png', webkitRelativePath: 'test/pics/category3/default.image.png' },
  { name: 'image3.png', webkitRelativePath: 'test/pics/category3/image4.png' },
]
function MockAFileList (myFiles: MyFile[]) {
  const fileList: {
    length: number,
    item: (index: number) => MyFile & File,
    [index: number]: MyFile & File,
    [Symbol.iterator]: any
  } = {
    length: myFiles.length,
    item (index: number) {
      return fileList[index]
    },
    [Symbol.iterator]: function* () {
      for (const file of myFiles) {
        yield file
      }
    }
  }
  myFiles.forEach((f, i) => {
    const file = new File([], f.name)
    // @ts-ignore
    file.webkitRelativePath = f.webkitRelativePath
    // @ts-ignore
    myFiles[i] = file
    // @ts-ignore
    fileList[i] = file
  })
  return fileList
}

it('getRealPath return a RealPath', () => {
  expect(getRealPath('test/pics/category1/image.png'))
    .toBe('pics/category1/image.png')
  expect(getRealPath('test/pics/category1/mini/image.png'))
    .toBe('pics/category1/image.png')
})

it('generate Metadata from FileList without mini file', () => {
  const file = MyFiles[0]
  const fileList = MockAFileList([file])
  const realPath = getRealPath(file.webkitRelativePath)
  const pathHash = getPathHash(realPath)
  expect(genMetadata(fileList).data).toEqual({[pathHash]: {
    id: pathHash,
    path: realPath,
    filename: file.name
  }})
})

it('generate Metadata from FileList with mini file', () => {
  const files = [MyFiles[0], MyFiles[1]]
  const fileList = MockAFileList(files)
  const realPath = getRealPath(files[0].webkitRelativePath)
  const pathHash = getPathHash(realPath)
  expect(genMetadata(fileList).data).toEqual({[pathHash]: {
    id: pathHash,
    path: realPath,
    filename: files[0].name,
    miniPath: 'pics/category1/mini/image.png'
  }})
})

it('hash from FileList(with mini file) equals to hash from pics hash', () => {
  const files = [MyFiles[0], MyFiles[1]]
  const fileList = MockAFileList(files)
  const realPath = getRealPath(files[0].webkitRelativePath)
  const pathHash = getPathHash(realPath)

  expect(genHashFromSourceFileList(fileList))
    .toBe(genHashFromPicsHash([pathHash]))
})

it('hash from FileList(multiple files) equals to hash from pics hash', () => {
  const fileList = MockAFileList(MyFiles)
  const picsMetadata = genMetadata(fileList).data

  expect(genHashFromSourceFileList(fileList))
    .toBe(genHashFromPicsHash(Object.keys(picsMetadata)))
})

it('getRootName', () => {
  const fileList = MockAFileList(MyFiles)
  expect(getRootName(fileList)).toBe('test')
})
