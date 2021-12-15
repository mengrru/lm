import {useContext, useEffect, useMemo, useState} from 'react';
import './index.css';
import { DirUploadInput, SaveTextLink } from '../../common'
import { ConfigFromForm } from '../../data-format-def';
import Form from './form';
import { genConfig, genMetadata, getRootName } from '../../data-trans'
import {CreateAction, CreateActionContext, useCreateAction} from './action';
import {Link} from 'react-router-dom';

function Create () {
  const createAction = useContext(CreateActionContext)

  const [fileList, setFileList] = useState({} as FileList)
  const [formOutput, setFormOutput] = useState({} as ConfigFromForm)

  const metadata = useMemo(
    () => fileList.length ? genMetadata(fileList) : null,
    [fileList]
  )

  const config = useMemo(
    () => (!fileList.length || !formOutput.info)
      ? ''
      : JSON.stringify(genConfig(formOutput, fileList))
  , [fileList, formOutput])

  const rootJSON = useMemo(
    () => fileList.length
      ? `{ "root": "/sources/${getRootName(fileList)}/" }`
      : '',
    [fileList]
  )

  useEffect(() => {
    document.title = '创建属于你的捏脸游戏！'
  })

  return (
  <CreateActionContext.Provider value={useCreateAction(CreateAction.Editing)}>
    <div className="App">
      <header className="app-header">
        <h2>!醒目! 请使用电脑进行操作</h2>
        <p>在本页面中，我们将一步一步创建一个自己的捏脸游戏</p>
        <p>创建过程分为三个部分：</p>
        <p>1.准备好你的捏脸素材</p>
        <p>2.制作资源包</p>
        <p>3.上传资源包</p>
        <h2>首先</h2>
        <p>绘制你的捏脸素材，所有的素材必须是正方形且大小一致，格式为png</p>
        <p>具体可以参考<a href="https://github.com/mengrru/lm/tree/main/public/sources/example/pics" target="_blank">这里</a></p>
        <h2>然后我们需要制作一个资源包</h2>
        <p>（你可以<a href="https://github.com/mengrru/lm/tree/main/public/sources/example" target="_blank">点击这里</a>查看示例资源包）</p>
        <p>新建一个文件夹，取个英文名，比如 example</p>
        <p>进入这个文件夹，再新建一个文件夹，取名为 pics</p>
        <p>进入 pics 文件夹，按照你的想法新建若干个文件夹，每个文件夹代表你的素材的分类</p>
        <p>比如 表情 衣服 背景 等等</p>
        <p>在相应的文件夹中放入相应的素材</p>
        <p>对于默认选中的素材，文件名以 default. 开头，比如： default.笑脸.png </p>
        <h2>在这里传入刚才第一次建好的文件夹（比如 example）</h2>
        <DirUploadInput
          handleOutput={(fileList) => {
            createAction.setEditing()
            setFileList(fileList)
          }}
        />
        <Form
          handleOutput={(output) => setFormOutput(output)}
          picsMetadata={metadata ? metadata.data : undefined}
        />
        <h2>填完点击确定后会出现三个下载按钮：</h2>
        <CreateActionContext.Consumer>
          { value =>
            value.action === CreateAction.Confirmed
            ? (
              <div>
                <SaveTextLink
                  fileContent={metadata ? JSON.stringify(metadata) : '{}'}
                  filename="metadata.json"
                  className="download-config-link"
                >
                  下载metadata.json 
                </SaveTextLink>
                <SaveTextLink
                  fileContent={config}
                  filename="config.json"
                  className="download-config-link"
                >
                  下载config.json
                </SaveTextLink>
                <SaveTextLink
                  fileContent={rootJSON}
                  filename="root.json"
                  className="download-config-link"
                >
                  下载root.json
                </SaveTextLink>
              </div>
            )
            : (<div></div>)
          }
        </CreateActionContext.Consumer>
        <h2>上面三个文件下载后</h2>
        <p>进入刚才创建的 example 文件夹，将这三个文件放到文件夹中</p>
        <p>这样你的资源包就完成啦！撒花✨</p>
        <h2>接下来进入最后一步</h2>
        <p>上传你的资源包到可以被访问到的地方，有两种选择：</p>
        <p>1. 通过提pr的方式上传到<a href="https://github.com/mengrru/lm-instance">此仓库</a>的 main 分支的 sources 目录下</p>
        <p>2. 自行购买静态存储服务（如阿里云OSS）上传，并将 root.json 中的 root 字段改为你的资源所在的绝对地址，然后通过提pr的方式上传 root.json 到<a href="https://github.com/mengrru/lm-instance">此仓库</a>的 main 分支的 sources 目录下</p>
        <p>如果搞不懂怎样上传，可以直接发邮件到 mengrru@outlook.com 让我来帮你上传</p>
        <p>-</p>
        <p><Link to="/">返回首页</Link></p>
        <p>-</p>
      </header>
    </div>
  </CreateActionContext.Provider>
  )
}

export default Create;

