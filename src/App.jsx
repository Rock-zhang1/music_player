import React, { Component } from 'react'
import './common/css/index.scss'
import './common/css/font_player/iconfont.css'
import 'antd/dist/antd.css';
import Player from './containers/Player'


export default class App extends Component {
    render () {
        return (
            <div className="App">
                <Player />
            </div>
        )
    }
}
