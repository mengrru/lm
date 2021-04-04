import React from 'react';
import { CategoryInfoFromForm, CategoryRawData, ConfigFromForm, PicsMetadata } from './data-format-def';
import './Form.css'
import { getCategoryRawData } from './utils';

type Author = {
    name: string
    email: string
    website: string
}
type Interface = {
    footerText: string
}
type FormState = {
    author: Author
    interface: Interface
    title: string
}
type FormProps = {
    handleOutput: (output: ConfigFromForm) => void
    picsMetadata: PicsMetadata | undefined
}
class Form extends React.Component<FormProps, FormState> {
    categoryData: CategoryInfoFromForm

    constructor (props: FormProps) {
        super(props)
        this.state = {
            author: {
                name: '',
                email: '',
                website: ''
            }, 
            interface: {
                footerText: ''
            },
            title: '',
        }
        this.categoryData = {}
        this.getFullData = this.getFullData.bind(this)
        this.getCategoryInfo = this.getCategoryInfo.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
    }
    getFullData (): ConfigFromForm {
        const data: ConfigFromForm = {
            info: {
                author: Object.assign({}, this.state.author),
                interface: Object.assign({}, this.state.interface),
                title: this.state.title
            },
            category: this.categoryData
        }
        return data
    }
    getCategoryInfo (categoryInfo: CategoryInfoFromForm) {
        this.categoryData = categoryInfo
    }
    onInputChange (e: React.ChangeEvent<HTMLInputElement>, property: string) {
        switch (property) {
            case 'name':
            case 'email':
            case 'website':
                this.setState({
                    author: {
                        ...this.state.author,
                        [property]: e.target.value
                    }
                })
                break
            case 'footerText':
                this.setState({
                    interface: {
                        ...this.state.interface,
                        [property]: e.target.value
                    }
                })
                break
            case 'title':
                this.setState({
                    title: e.target.value
                })
        }
    }
    render () {
        return (
            <form>
                <h2>作者信息</h2>
                名字：
                <input
                    value={this.state.author.name}
                    type="text"
                    onChange={(e) => this.onInputChange(e, 'name')}
                /><br/>
                邮箱：
                <input
                    value={this.state.author.email}
                    type="text"
                    onChange={(e) => this.onInputChange(e, 'email')}
                /><br/>
                网址：
                <input
                    value={this.state.author.website}
                    type="text"
                    onChange={(e) => this.onInputChange(e, 'website')}
                /><br/>
                <h2>页面信息</h2>
                页脚文字：
                <input
                    value={this.state.interface.footerText}
                    type="text"
                    onChange={(e) => this.onInputChange(e, 'footerText')}
                /><br/>
                页面标题：
                <input
                    value={this.state.title}
                    type="text"
                    onChange={(e) => this.onInputChange(e, 'title')}
                /><br/>
                <h2>资源信息</h2>
                {this.props.picsMetadata &&
                    <PicsCategoryForm
                        handleOutput={this.getCategoryInfo}
                        picsMetadata={this.props.picsMetadata}
                    />
                }
                <input
                    type="button"
                    value="确定"
                    onClick={() => this.props.handleOutput(this.getFullData())}
                />
            </form>
        )
    }
}

type PicsClassFormState = {
    categoryRawData: CategoryRawData
    data: CategoryInfoFromForm
}
type PicsClassFormProps = {
    picsMetadata: PicsMetadata
    handleOutput: (categoryInfoFromForm: CategoryInfoFromForm) => void
}
class PicsCategoryForm extends React.Component<PicsClassFormProps, PicsClassFormState> {
    constructor (props: PicsClassFormProps) {
        super(props)
        const categoryRawData = getCategoryRawData(this.props.picsMetadata)
        this.state = {
            categoryRawData: categoryRawData,
            data: this.initFormData(categoryRawData)
        }
        this.handleChange = this.handleChange.bind(this)
    }
    initFormData (categoryRawData: CategoryRawData) {
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
    handleChange (r: string, title: string, property: string) {
        const copy: CategoryInfoFromForm = {}
        Object.assign(copy, this.state.data)
        Object.keys(copy).forEach(key => {
            copy[key] = Object.assign({}, copy[key])
        })
        switch(property) {
            case 'allowBlank':
                copy[title].allowBlank = !copy[title].allowBlank
                break
            case 'hide':
                copy[title].hide = !copy[title].hide
                break
            case 'index':
                copy[title].index = parseInt(r)
                break
        }
        this.setState({
            data: copy
        })
        this.props.handleOutput(JSON.parse(JSON.stringify(copy)))
    }
    render () {
        const categoryData = this.state.categoryRawData
        const len = Object.keys(categoryData).length
        const categoryForm = 
            Object.keys(categoryData)
            .map((title, currentIndex) => {
                return (
                    <div key={title}>
                        <span>{categoryData[title].info.title}</span>
                        允许为空
                        <input
                            onChange={(e) => this.handleChange(e.target.value, title, 'allowBlank')}
                            checked={this.state.data[title].allowBlank}
                            name={title + '-allowBlank'}
                            type="checkbox"
                        />
                        隐藏
                        <input
                            onChange={(e) => this.handleChange(e.target.value, title, 'hide')}
                            checked={this.state.data[title].hide}
                            name={title + '-hide'}
                            type="checkbox"
                        />
                        index
                        <select
                            onChange={(e) => this.handleChange(e.target.value, title, 'index')}
                            name={title + '-index'}
                            value={this.state.data[title].index}
                        >
                            {
                                Array.from(Array(len))
                                    .map((e, i) =>
                                        <option
                                            key={i + 1}
                                            value={i + 1}
                                        > {i + 1}
                                        </option>
                                    )
                            }
                        </select>
                    </div>
                )
            })
        return (
            <div>
                {categoryForm}
            </div>
        )
    }
}

export default Form