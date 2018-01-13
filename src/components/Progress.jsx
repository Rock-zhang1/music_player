import React, { Component } from 'react'
import '../common/css/progress.scss'

export default class Progress extends Component {
    static defaultProps = {
        barColor: '#06A651'
    }
    constructor(){
        super(...arguments);
        this.changeProgress = this.changeProgress.bind(this);
    }
    // 点击改变播放进度
    changeProgress(e){
        let progressBar = this.refs.progressBar;
        let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
        this.props.changeProgress(progress)
    }

    render() {
        let {progress,barColor} = this.props;
        return (
            <div className="progres"
                onClick={this.changeProgress}
                ref="progressBar">
                <div className="progresed"
                    style={{width: `${progress}%`,background: barColor}}
                ></div>
            </div>
        )
    }
}
