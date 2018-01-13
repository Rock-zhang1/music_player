import React, { Component } from 'react'
import '../common/css/header.scss'
import $ from 'jquery';
import PubSub from 'pubsub-js'

export default class Header extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            searchResult: [],
        }
        this.search = this.search.bind(this);
    }
    componentDidMount(){
        let _this = this;
        this.refs.searchVal.onfocus = function(){
            $(window).on('keyup', (e)=>{
                if(e.keyCode === 13){
                    _this.search();
                }
            })
        }
    }
    search(){
        let val = this.refs.searchVal.value;
        if(!val) return ;
        $.ajax({
            url: "http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.search.common&format=json&query="+val+"&page_no=1&page_size=50",
            dataType: "jsonp",
            /*data: {
                'type': 1,
                's': val,
                'limit': 20
            },*/
            jsonp: "callback",
            cache: false,
            success: function(data) {
                console.log(data.song_list)
                PubSub.publish('searchResultToSection', data.song_list);   // 发送搜索结果数据到内容区
            }
        });
        this.refs.searchVal.value = '';
    }
    render () {
        return (
            <header className="header row container-fluid">
                <div className="logo">
                    <img src={require('../common/img/2.png')} className="col-auto img-circle" alt=""/>
                    <h1 className="caption">音乐播放器</h1>
                </div>
                <div className="search">
                    <input type="text" placeholder="歌手/歌名/专辑名" ref="searchVal"/>
                    <i className="iconfont icon-sousuochaxun" onClick={this.search}></i>
                </div>
            </header>
        )
    }
}

//https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&format=jsonp&key=good&g_tk=5381&jsonpCallback=SmartboxKeysCallbackmod_top_search3166&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0
