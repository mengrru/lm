import React from 'react';
import { CategoryInfoFromForm, CategoryRawData, ConfigFromForm, PicsMetadata } from './data-format-def';
import './Form.css'
import { getCategoryRawData } from './data-trans';

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
    onConfirm () {
        if (!this.props.picsMetadata) {
            return
        }
        this.props.handleOutput(this.getFullData())
    }
    render () {
        return (
            <form>
                <h2>填写作者信息（也可以不填）</h2>
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
                <h2>填写页面信息（也可以不填，但最好填）</h2>
                页面标题：
                <input
                    value={this.state.title}
                    type="text"
                    onChange={(e) => this.onInputChange(e, 'title')}
                /><br/>
                页脚文字：
                <input
                    value={this.state.interface.footerText}
                    type="text"
                    onChange={(e) => this.onInputChange(e, 'footerText')}
                /><br/>
                <h2>填写分类信息</h2>
                {this.props.picsMetadata &&
                    <PicsCategoryForm
                        handleOutput={this.getCategoryInfo}
                        picsMetadata={this.props.picsMetadata}
                    />
                }
                <input
                    className="form-button"
                    type="button"
                    value="确定"
                    onClick={() => this.onConfirm()}
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
            data: PicsCategoryForm.initFormData(categoryRawData)
        }
        this.props.handleOutput(this.state.data)
        this.handleChange = this.handleChange.bind(this)
    }
    static initFormData (categoryRawData: CategoryRawData) {
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
    componentDidUpdate (oldProps: PicsClassFormProps) {
        if (this.props.picsMetadata === oldProps.picsMetadata) {
            return
        }
        const categoryRawData = getCategoryRawData(this.props.picsMetadata)
        this.setState({
            categoryRawData: categoryRawData,
            data: PicsCategoryForm.initFormData(categoryRawData)
        })
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
                    <tr key={title}>
                        <td>
                            <span>{categoryData[title].info.title}</span>
                        </td>
                        <td>
                            <input
                                onChange={(e) => this.handleChange(e.target.value, title, 'allowBlank')}
                                checked={this.state.data[title].allowBlank}
                                name={title + '-allowBlank'}
                                type="checkbox"
                            />
                        </td>
                        <td>
                            <input
                                onChange={(e) => this.handleChange(e.target.value, title, 'hide')}
                                checked={this.state.data[title].hide}
                                name={title + '-hide'}
                                type="checkbox"
                            />
                        </td>
                        <td>
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
}

export default Form