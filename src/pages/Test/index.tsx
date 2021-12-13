import React from 'react';
import './index.css';
import { DirUploadInput, ShowLocalImage, SaveTextLink, ImageOnCanvas } from '../../common'
import { ConfigFromForm } from '../../data-format-def';
import Form from '../Create/form';
import { genConfig, genHashFromSourceFileList, genMetadata } from '../../data-trans'

class Test extends React.Component<any, any>{
  constructor (props: any) {
    super(props)
    document.title = '拉聂耳地区'
    this.state = {
      testFileList: null,
      formOutput: null,
      testImageJSX: (
        <div></div>
      )
    }
    const testImage = new Image()
    testImage.src = '/sources/linmo/pics/衣服/蓝色卫衣.png'
    testImage.onload = (e) => {
      if (!e.target) {
        return
      }
      this.setState({
        testImageJSX: (
          <div style={{'backgroundColor': '#fff'}}>
            <ImageOnCanvas
              imageObjs={[testImage]}
              canvasSize={[90, 90]}
              border={5}
            ></ImageOnCanvas>
          </div>
        )
      })
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
          <p>
            FBI WARNING
          </p>
          <p>
            欢迎你来到神秘页面
          </p>
          {this.state.testImageJSX}
          <DirUploadInput
            handleOutput={(fileList) => this.getFileList(fileList)}
          />
          <Form
            handleOutput={(output) => this.getFormOutput(output)}
            picsMetadata={metadata ? metadata.data : undefined}
          />
          {testHash}
          <SaveTextLink
            fileContent={metadataJSON}
            filename="download_metadata_test.json"
            className=""
          >
           metadata.json下载测试 
          </SaveTextLink>
          <SaveTextLink
            fileContent={this.genConfig()}
            filename="download_config_test.json"
            className=""
          >
            config.json下载测试
          </SaveTextLink>
          <ShowLocalImage
            imageFile={files ? files[2] : null}
          />
        </header>
      </div>
    );
    }
}

export default Test;
