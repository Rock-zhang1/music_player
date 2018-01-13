import React, { Component } from 'react'
import '../common/css/section.scss'
import $ from 'jquery';
import 'jplayer';
import PubSub from 'pubsub-js'

import {MUSIC_LIST} from '../datas/musicList.js'
import Mlist from './Mlist'
import SearchList from './SearchList'


export default class Section extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            MUSIC_LIST,
            currentMusic: MUSIC_LIST[0],
            searchResult: [],
        }
    }
    // 播放音乐
    playMusic(musicItem){
        $('#player').jPlayer('setMedia',{
            mp3: musicItem.file
        }).jPlayer('play');
        this.setState({ currentMusic: musicItem })
        PubSub.publish('musicItemToFoot', musicItem);   // 发送当前歌曲数据到页脚
    }
    // 删除音乐
    deleteMUsic(musicItem){
        let {MUSIC_LIST,currentMusic} = this.state;
        MUSIC_LIST = MUSIC_LIST.filter(v => v !== musicItem);
        this.setState({ MUSIC_LIST })
        if(musicItem === currentMusic){
            this.playNext('next');
        }
    }

    // 下一首应该怎么播放
    playNext(type){
        let {MUSIC_LIST,currentMusic} = this.state;
        let len = MUSIC_LIST.length;
        let index = this.findCurrentMusicIndex(currentMusic);
        let newIndex = index;
        switch (type) {
            case 'prev':  // 上一曲
                newIndex = (index - 1 + len) % len; break;
            case 'repeatOne':  // 单曲循环
                newIndex = index; break;
            case 'random':  // 随机播放
                newIndex = Math.floor(Math.random()*len); break;
            default:      //下一曲
                newIndex = (index + 1) % len
        }
        this.playMusic(MUSIC_LIST[newIndex])
    }
    findCurrentMusicIndex(musicItem){
        return this.state.MUSIC_LIST.indexOf(musicItem);
    }

    componentDidMount(){
        // 播放音乐
        PubSub.subscribe('PLAY_MUSIC', function (msg, d) {
            this.playMusic(d);
        }.bind(this))
        // 删除音乐
        PubSub.subscribe('DELETE_MUSIC', function (msg, d) {
            this.deleteMUsic(d);
        }.bind(this))
        // 上一曲
        PubSub.subscribe('PREV_MUSIC', function (msg) {
            this.playNext('prev');
        }.bind(this))
        // 下一曲
        PubSub.subscribe('NEXT_MUSIC', function (msg ,type='next') {
            this.playNext(type);
        }.bind(this))

        // 显示搜索结果
        PubSub.subscribe('searchResultToSection', function (msg, d) {
            this.setState({
                searchResult: d
            })
        }.bind(this))
    }
    componentWillUnMount(){
        PubSub.unsubscrib('PLAY_MUSIC')
        PubSub.unsubscrib('DELETE_MUSIC')
    }
    render() {
        let {MUSIC_LIST,currentMusic,searchResult} = this.state;
        return (
            <div className="section">
                <div className="section_l">
                    <Mlist
                        data={MUSIC_LIST}
                        currentMusic={currentMusic}
                    />
                </div>
                <div className="section_r">
                    <SearchList
                        searchResult={searchResult}
                    />
                </div>
            </div>
        )
    }
}
