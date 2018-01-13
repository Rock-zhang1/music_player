import React, { Component } from 'react'
import $ from 'jquery';
import 'jplayer';
import '../common/css/footer.scss'
import PubSub from 'pubsub-js'
import { Slider,Popover } from 'antd';

import {MUSIC_LIST} from '../datas/musicList.js'

// import Progress from './Progress'

// formatTime  将秒数格式化
const formatTime = (time) => {
    const toTwo = (n) => {
        return n > 9 ? '' + n : '0' + n
    }
    let m = Math.floor(time / 60);
    let s = Math.floor((time-m*60));
    return `${toTwo(m)}:${toTwo(s)}`;
}

let duration = null;
export default class Footer extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            progress: 0,        // 播放进度默认值
            volume: 50,         // 音量
            isPlay: true,       // 是否正在播放
            musicItem: MUSIC_LIST[0],   // 当前播放歌曲
            playMode: 'next',   // 播放模式
            visible: false      // 播放模式气泡隐藏
        }
        this.changeProgress = this.changeProgress.bind(this);
        this.changeVolume = this.changeVolume.bind(this);
        this.isPlay = this.isPlay.bind(this);
    }
    // 播放器初始化
    componentDidMount(){
        $('#player').jPlayer({
            supplied:'mp3',
            wmode:'window'
        });
        $('#player').jPlayer('setMedia',{   // 播放
            mp3: this.state.musicItem.file
        }).jPlayer('play');
        $('#player').bind($.jPlayer.event.ended, e=>{   // 播放完成回调
            this.play_next(this.state.playMode);
        })
        $('#player').bind($.jPlayer.event.timeupdate, e=>{
            duration = e.jPlayer.status.duration
            this.setState({
                progress: e.jPlayer.status.currentPercentAbsolute,
                timed: Math.ceil(e.jPlayer.status.currentTime),
                allTime: Math.ceil(duration)
            });
        })

        // 接受section传过来的当前歌曲数据
        PubSub.subscribe('musicItemToFoot', function (msg, d) {
            this.setState({ musicItem: d })
        }.bind(this))

        // 键盘控制
        $(window).on('keyup', (e)=>{
            if(e.keyCode === 32){    // 空格 播放/暂停
                this.isPlay();
            }
            //console.log(e.keyCode)
        })
    }
    componentWillUnMount(){
        $('#player').unbind($.jPlayer.event.timeupdate)
        $('#player').unbind($.jPlayer.event.ended)
    }
    // 播放进度
    changeProgress(progress){
        $('#player').jPlayer('play', duration*progress/100);
        this.setState({isPlay: true})
    }
    // 音量
    changeVolume(progress){
        $('#player').jPlayer('volume', progress);
    }
    // 进度条上面的提示
    tipFormatter(val){
        return formatTime(duration*val/100);
    }
    // 播放/暂停
    isPlay(){
        if(this.state.isPlay){
            $('#player').jPlayer('pause');
        }else{
            $('#player').jPlayer('play');
        }
        this.setState({isPlay: !this.state.isPlay})
    }
    // 上一曲
    play_prev(){
        PubSub.publish('PREV_MUSIC');
    }
    // 下一曲
    play_next(type){
        PubSub.publish('NEXT_MUSIC', type);
    }
    // 选择播放模式
    changePlayMode(type){
        this.setState({
            playMode: type,
            visible: false,
        })
    }
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }
    render() {
        let {progress,timed,allTime,isPlay,musicItem,playMode} = this.state;
        return (
            <div className="footer">
                <div id="player"></div>
                <div className="handle_l">
                    <i className="iconfont icon-shangyishou" title="上一曲" onClick={this.play_prev}></i>
                    <i className={`iconfont icon-${isPlay?'zanting':'bofang'}`} title="暂停/播放" ref="isPlay" onClick={this.isPlay} ></i>
                    <i className="iconfont icon-kuaijin" title="下一曲" onClick={this.play_next}></i>
                </div>
                <img src={musicItem.cover} alt='专辑封面'/>
                <div className="musicProgress">
                    <p>
                        <b>{musicItem.title}-{musicItem.artist}</b>
                        <span>{formatTime(timed)} / {formatTime(allTime)}</span>
                    </p>
                    <Slider value={progress}
                        step={0.01}
                        tipFormatter={this.tipFormatter}
                        onChange={this.changeProgress}
                    />
                    {/*<Progress
                        progress={progress}
                        timed={timed}
                        allTime={allTime}
                        barColor="#f0f"
                        changeProgress={this.changeProgress}
                    />*/}
                </div>
                <div className="handle_r">
                    <Popover
                        trigger="click"
                        content={
                            <Slider defaultValue={50}
                                step={2}
                                onChange={this.changeVolume}
                            />}
                        title={`音量调节`}>
                        <i className="iconfont icon-shengyin" title="音量"></i>
                    </Popover>
                    <Popover
                        trigger="click"
						placement="topRight"
                        visible={this.state.visible}
                        onVisibleChange={this.handleVisibleChange}
                        content={
                            <div>
                                <p onClick={() => this.changePlayMode('repeatOne')}><i className="iconfont icon-shunxubofang"></i>单曲循环</p>
                                <p onClick={() => this.changePlayMode('next')}><i className="iconfont icon-jinru"></i>顺序播放</p>
                                <p onClick={() => this.changePlayMode('random')}><i className="iconfont icon-suijibofang"></i>随机播放</p>
                            </div>
                        }
                        title={`播放模式`}>
                        <i className={`iconfont icon-${playMode==='next'?'jinru':playMode==='repeatOne'?'shunxubofang':'suijibofang'}`} title="音乐模式"></i>
                    </Popover>
                    <i className="iconfont icon-liebiaowuxu" title="播放列表"></i>
                </div>
            </div>
        )
    }
}
