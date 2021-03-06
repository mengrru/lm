import React from 'react';
import './Create.css';
import { DirUploadInput, SaveTextLink } from './common'
import { ConfigFromForm } from './data-format-def';
import Form from './Form';
import { genConfig, genMetadata, getRootName } from './data-trans'

class Create extends React.Component<any, any>{
  constructor (props: any) {
    super(props)
    document.title = '创建属于你的捏脸游戏！'
    this.state = {
      fileList: null,
      formOutput: null
    }
  }
  getFileList (fileList: FileList) {
    this.setState({
      fileList: fileList
    })
  }
  getFormOutput (output: ConfigFromForm) {
    this.setState({
      formOutput: output
    })
  }
  genConfig () {
    if (!this.state.fileList || !this.state.formOutput) {
      return ''
    }
    const config = genConfig(this.state.formOutput, this.state.fileList)
    console.log(JSON.stringify(config))
    return JSON.stringify(config)
  }
  render () {
    const files = this.state.fileList
    const rootJSON = `
    {
        "root": "/sources/${getRootName(files)}/"
    }
    `
    let metadataJSON = '{}'
    let metadata
    if (files) {
      metadata = genMetadata(files as FileList)
      metadataJSON = JSON.stringify(metadata)
    }
    console.log(files)
    return (
      <div className="App">
            <header className="app-header">
                <h2>!醒目! 请使用电脑进行操作</h2>
                <h2>首先</h2>
                <p>所有的素材必须是正方形且大小一致，格式为png</p>
                <h2>然后</h2>
                <p>新建一个文件夹，取个英文名，比如 example</p>
                <p>进入这个文件夹，再新建一个文件夹，取名为 pics</p>
                <p>进入 pics 文件夹，按照你的想法新建若干个文件夹，每个文件夹代表你的素材的分类</p>
                <p>比如 表情 衣服 背景 等等</p>
                <p>在相应的文件夹中放入相应的素材</p>
                <h2>在这里传入刚才第一次建好的文件夹（比如 example）</h2>
                <DirUploadInput
                    handleOutput={(fileList) => this.getFileList(fileList)}
                />

                <Form
                    handleOutput={(output) => this.getFormOutput(output)}
                    picsMetadata={metadata ? metadata.data : undefined}
                >
                </Form>
                <h2>填完点击确定后会出现三个下载按钮：</h2>
                {
                    this.state.formOutput
                    ? (
                        <div>
                            <SaveTextLink
                                fileContent={metadataJSON}
                                filename="metadata.json"
                                className="download-config-link"
                            >
                            下载metadata.json 
                            </SaveTextLink>
                            <SaveTextLink
                                fileContent={this.genConfig()}
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
                <h2>上面三个文件下载后</h2>
                <p>进入刚才创建的 example 文件夹，将这三个文件放到文件夹中</p>
                <p>这样你的资源包就完成啦！撒花✨</p>
                <h2>接下来进入最后一步（非常复杂）</h2>
                <p>上传你的资源包到可以被访问到的地方，有两种选择：</p>
                <p>1. 通过提pr的方式上传到<a href="https://github.com/mengrru/lm-instance">此仓库</a>的 main 分支的 sources 目录下</p>
                <p>2. 自行购买静态存储服务（如阿里云OSS）上传，并将 root.json 中的 root 字段改为你的资源所在的绝对地址，然后通过提pr的方式上传 root.json 到<a href="https://github.com/mengrru/lm-instance">此仓库</a>的 main 分支的 sources 目录下</p>
                <p>上述教程我暂时懒得写了，如果想上传可以直接发邮件到 mengrru@outlook.com 让我帮你上传白嫖我的OSS</p>
            </header>
      </div>
    );
    }
}

export default Create;

