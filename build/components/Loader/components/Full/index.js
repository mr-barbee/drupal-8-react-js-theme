import React, {Component} from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  label: PropTypes.string.isRequired
}

export default class Full extends Component {
  render () {
    const { label } = this.props
    return (
      <section className="ge-hologram">
        <div className="ge-hologram__circle-top"></div>
        <div className="ge-hologram__circle-mid">
          <div className="ge-circle-mid elementAnimation runningAnimation">
            <div className="ge-circle-mid__group elementAnimation runningAnimation">
              <div className="toproun"><img className="world" src="/themes/custom/granderaent/img/holonewnew.png" /></div>
              <div className="toprounnew"><img className="worldnew" src="/themes/custom/granderaent/img/layer1.png" /></div>
              <div className="toprounnew1"><img className="worldnew1" src="/themes/custom/granderaent/img/layer2.png" /></div>
              <div className="toprounnew2"><img className="worldnew2" src="/themes/custom/granderaent/img/layer3.png" /></div>
            </div>
          </div>
        </div>
        <div className="ge-hologram__current elementAnimation runningAnimation"></div>
        <img className="ge-loader" src="/themes/custom/granderaent/img/fullbg.png" />
        <div className="ge-hologram-particles">
          <div className="ge-hologram-particles__particle elementAnimation runningAnimation"></div>
          <div className="ge-hologram-particles__particle elementAnimation runningAnimation"></div>
          <div className="ge-hologram-particles__particle elementAnimation runningAnimation"></div>
          <div className="ge-hologram-particles__particle elementAnimation runningAnimation"></div>
          <div className="ge-hologram-particles__particle elementAnimation runningAnimation"></div>
          <div className="ge-hologram-particles__particle elementAnimation runningAnimation"></div>
          <div className="ge-hologram-particles__particle elementAnimation runningAnimation"></div>
          <div className="ge-hologram-particles__particle elementAnimation runningAnimation"></div>
        </div>
        <div className="ge-hologram-element">
          <div className="ge-hologram-element__name elementAnimation runningAnimation">
            <ul id="clock">
              <li className="newshadow" id="hour"></li>
            </ul>
            <ul>
              <li id="statci"></li>
            </ul>
            <h1 className="animated infinite flash slower loading-label" data-text="Amateus">{label}</h1>
          </div>
        </div>
        <div className="ge-hologram__circle-bottom"></div>
      </section>
    )
  }
}

Full.propTypes = propTypes
