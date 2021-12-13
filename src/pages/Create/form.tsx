import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import { CategoryInfoFromForm, CategoryRawData, ConfigFromForm, PicMetadataSet } from '../../data-format-def';
import './form.css'
import { getCategoryRawData } from '../../data-trans';
import {CreateActionContext} from './action';

type FormProps = {
  handleOutput: (output: ConfigFromForm) => void
  picsMetadata: PicMetadataSet | undefined,
}
function Form (props: FormProps) {
  const CreateAction = useContext(CreateActionContext)
  const author = useRef({
    name: '', email: '', website: ''
  })
  const ui = useRef({
    footerText: ''
  })
  const title = useRef('')
  const categoryInfoFromForm = useRef({} as CategoryInfoFromForm)

  function handleInput (categoryInfo: CategoryInfoFromForm) {
    categoryInfoFromForm.current = categoryInfo
    CreateAction.setEditing()
  }
  function onInputValueChange (e: React.ChangeEvent<HTMLInputElement>, property: string) {
    switch (property) {
      case 'name':
      case 'email':
      case 'website':
      author.current = {
        ...author.current,
        [property]: e.target.value
      }
        break
      case 'footerText':
      ui.current = {
        ...ui.current,
        [property]: e.target.value
      }
        break
      case 'title':
      title.current = e.target.value
    }
    CreateAction.setEditing()
  }
  function onConfirm () {
    if (!props.picsMetadata) {
      return
    }
    props.handleOutput({
      info: {
        author: { ...author.current },
        interface: { ...ui.current },
        title: title.current
      },
      category: categoryInfoFromForm.current
    })
    CreateAction.setConfirmed()
  }
  return (
    <form>
      <h2>填写作者信息（也可以不填）</h2>
      名字：
      <input
        type="text"
        onChange={(e) => onInputValueChange(e, 'name')}
      /><br/>
      邮箱：
      <input
        type="text"
        onChange={(e) => onInputValueChange(e, 'email')}
      /><br/>
      网址：
      <input
        type="text"
        onChange={(e) => onInputValueChange(e, 'website')}
      /><br/>
      <h2>填写页面信息（也可以不填，但最好填）</h2>
      页面标题：
      <input
        type="text"
        onChange={(e) => onInputValueChange(e, 'title')}
      /><br/>
      页脚文字：
      <input
        type="text"
        onChange={(e) => onInputValueChange(e, 'footerText')}
      /><br/>
      <h2>填写分类信息</h2>
      {
        props.picsMetadata &&
        <PicsCategoryForm
          handleOutput={handleInput}
          picsMetadata={props.picsMetadata}
        />
      }
      <input
        className="form-button"
        type="button"
        value="确定"
        onClick={() => onConfirm()}
      />
    </form>
  )
}

type PicsCategoryFormProps = {
  handleOutput: (categoryInfoFromForm: CategoryInfoFromForm) => void
  picsMetadata: PicMetadataSet
}

function PicsCategoryForm (props: PicsCategoryFormProps) {
  const categoryRawData = useMemo(
    () => getCategoryRawData(props.picsMetadata),
    [props.picsMetadata]
  )
  const [data, setData] = useState(initFormData(categoryRawData))

  useEffect(() => {
    setData(initFormData(categoryRawData))
    props.handleOutput(JSON.parse(JSON.stringify(data)))
  }, [props.picsMetadata])

  function initFormData (categoryRawData: CategoryRawData): CategoryInfoFromForm {
    const res: CategoryInfoFromForm = {}
    let i = 1
    for (const title in categoryRawData) {
      res[title] = {
        title: title,
        allowBlank: false,
        hide: false,
        index: i++
      }
    }
    return res
  }
  function onInputValueChange (r: string, title: string, property: string) {
    switch(property) {
      case 'allowBlank':
      data[title].allowBlank = !data[title].allowBlank
        break
      case 'hide':
      data[title].hide = !data[title].hide
        break
      case 'index':
      data[title].index = parseInt(r)
        break
    }
    setData({...data})
    props.handleOutput(JSON.parse(JSON.stringify(data)))
  }

  const len = Object.keys(categoryRawData).length
  const categoryForm = 
    Object.keys(categoryRawData)
    .map((title) => {
      return (
        <tr key={title}>
          <td>
            <span>{categoryRawData[title].info.title}</span>
          </td>
          <td>
            <input
              onChange={(e) => onInputValueChange(e.target.value, title, 'allowBlank')}
              checked={data[title].allowBlank}
              name={title + '-allowBlank'}
              type="checkbox"
            />
          </td>
          <td>
            <input
              onChange={(e) => onInputValueChange(e.target.value, title, 'hide')}
              checked={data[title].hide}
              name={title + '-hide'}
              type="checkbox"
            />
          </td>
          <td>
            <select
              onChange={(e) => onInputValueChange(e.target.value, title, 'index')}
              name={title + '-index'}
              value={data[title].index}
            >
              {
                Array.from(Array(len))
                  .map((_, i) =>
                    <option
                      key={i + 1}
                      value={i + 1}
                    > {i + 1}
                    </option>
                )
              }
            </select>
          </td>
        </tr>
      )
    })
  return (
    <div className="form-category-data">
      <table>
        <thead>
          <tr>
            <td>类别</td>
            <td>允许该类别有空白项</td>
            <td>该类别不允许选择</td>
            <td>层序（数字大的在上面）</td>
          </tr>
        </thead>
        <tbody>
          {categoryForm}
        </tbody>
      </table>
    </div>
  )
}

export default Form
