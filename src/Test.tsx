import React from 'react';
import './Test.css';
import { DirUploadInput, ShowLocalImage, SaveTextLink } from './common'
import { ConfigFromForm } from './data-format-def';
import Form from './Form';
import { genConfig, genHashFromSourceFileList, genMetadata } from './utils'

class Test extends React.Component<any, any>{
  constructor (props: any) {
    super(props)
    this.state = {
      testFileList: null,
      formOutput: null
    }
  }
  getFileList (fileList: FileList) {
    this.setState({
      testFileList: fileList
    })
  }
  getFormOutput (output: ConfigFromForm) {
    this.setState({
      formOutput: output
    })
  }
  genConfig () {
    if (!this.state.testFileList || !this.state.formOutput) {
      return ''
    }
    console.log(this.state.testFileList, this.state.formOutput)
    const config = genConfig(this.state.formOutput, this.state.testFileList)
    console.log(JSON.stringify(config))
    return JSON.stringify(config)
  }
  render () {
    const files = this.state.testFileList
    let metadataJSON = '{}'
    let testHash = ''
    let metadata
    if (files) {
      metadata = genMetadata(files as FileList)
      metadataJSON = JSON.stringify(metadata)
      testHash = genHashFromSourceFileList(files)
    }
    return (
      <div className="App">
        <header className="App-header">
          <Form
            handleOutput={(output) => this.getFormOutput(output)}
            picsMetadata={metadata ? metadata.data : undefined}
          />
          {/* 图片路径写法 */}
          <img src="/sources/linmo/轮廓.png" className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          {testHash}
          <SaveTextLink
            fileContent={this.genConfig()}
            filename="download_test.json"
            class=""
          >
            测试下载链接
          </SaveTextLink>
          <SaveTextLink
            fileContent={this.genConfig()}
            filename="download_config_test.json"
            class=""
          >
            config.json下载测试
          </SaveTextLink>
          <DirUploadInput
            handleOutput={(fileList) => this.getFileList(fileList)}
          />
          <ShowLocalImage
            imageFile={files ? files[2] : null}
          />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
    }
}

export default Test;