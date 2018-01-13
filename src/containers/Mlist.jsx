import React, { Component } from 'react'
import '../common/css/mList.scss'
import PubSub from 'pubsub-js'

export default class Mlist extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            musicItem: this.props.currentMusic
        }
    }
    playMusic(musicItem){
        PubSub.publish('PLAY_MUSIC', musicItem);
        this.setState({ musicItem })
    }
    deleteMUsic(musicItem,e){
        // e.stopPropagation();
        PubSub.publish('DELETE_MUSIC', musicItem);
    }
    render() {
        let { data,currentMusic } = this.props;
        return (
            <div className="mList">
                <h3>播放列表</h3>
                <ul>
                    {data.map((v, i) => {
                        return  <li key={i}
                            title={`${v.title}-${v.artist}`}
                            className={currentMusic.id === v.id ? 'focus' : ''}
                            onDoubleClick={() => this.playMusic(v)}
                            >
                            <a>{v.title}-{v.artist}</a>
                            <span>
                                <i className="iconfont icon-weixihuan" title="喜欢"></i>
                                {/* <i className="iconfont icon-add1" title="添加到播放列表"></i> */}
                                <i className="iconfont icon-shanchu" title="删除" onClick={() => this.deleteMUsic(v)}></i>
                            </span>
                        </li>;
                    })}
                </ul>
            </div>
        )
    }
}
