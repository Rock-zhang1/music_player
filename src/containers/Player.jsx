import React, { Component } from 'react'
import　'../common/css/player.scss'

import Header from '../components/Header'
import Section from '../containers/Section'
import Footer from '../components/Footer'

export default class Player extends Component {
    render() {
        return (
            <div className="player">
                <Header />
                <Section />
                <Footer />
            </div>
        )
    }
}
