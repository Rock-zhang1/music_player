import React, { Component } from 'react'
import '../common/css/searchList.scss'
import { Table } from 'antd';
import $ from 'jquery';

export default class SearchList extends Component {
    constructor(){
        super(...arguments);
        this.addToList = this.addToList.bind(this);
    }
    download(n){
        $.ajax({
            url: "http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid="+ n.song_id,
            dataType: "jsonp",
            jsonp: "callback",
            cache: false,
            success: function(data) {
                window.open(data.bitrate.file_link);
                // console.log(data.bitrate.file_link)
            }
        });
    }
    addToList(d){
        console.log('添加到播放列表', d)
    }
    render() {
        let {searchResult} = this.props;
        const columns = [{    // 表头数据
                title: '歌曲名称',
                dataIndex: 'name',
                width: 150,
            },
            {
                title: '歌手',
                dataIndex: 'singer',
                width: 150,
            },
            {
                title: '专辑',
                dataIndex: 'album',
            },
            {
                title: '操作',
                width: 120,
                dataIndex: 'operation',
                render: (text, record) => (
                    <span>
                        <i className="iconfont icon-weixihuan" title="喜欢"></i>
                        <i className="iconfont icon-add1" title="添加到播放列表" onClick={() => {this.addToList(record)}}></i>
                        <i className="iconfont icon-icondownload" title="下载" onClick={() => {this.download(record)}}></i>
                    </span>
                ),
            },
        ];
        const data = [];
        searchResult.forEach((v, i) => {  // v.title =>   "asd<em>晴天</em>asd"    => <em>晴天</em>
            data.push({
                key: i,
                name: <span dangerouslySetInnerHTML={{ __html: v.title }}></span> ,
                singer: <span dangerouslySetInnerHTML={{ __html: v.author }}></span>,
                album: <span dangerouslySetInnerHTML={{ __html: v.album_title }}></span>,
                song_id: v.song_id
            })
        })

        return (
            <div className="searchList">
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 15 }} scroll={{ y: 530 }} />
            </div>
        )
    }
}
