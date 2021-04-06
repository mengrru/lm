import React from 'react';
import { UserOutputData } from './data-format-def';

type ResultPreviewProps = {
    userData: UserOutputData
}
type ResultPreviewState = {
}
export class ResultPreview extends React.Component<ResultPreviewProps, ResultPreviewState> {
    constructor (props: ResultPreviewProps) {
        super(props)
    }
    render () {
        const preview = Object.keys(this.props.userData)
            .map(title => {
                const itemData = this.props.userData[title]
                return itemData.pics.map(picInfo => {
                    return (
                        <div
                            style={{position: 'absolute', top: 0, left: 0}}
                        >
                            <img
                                src={picInfo.miniPath || picInfo.path}
                                alt={itemData.itemTitle}
                            />
                        </div>
                    )
                })
            })
        return (
            <div
                style={{position: 'relative'}}
            >
                {preview}
            </div>
        )
    }
}