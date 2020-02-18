import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'
import { Transition } from 'react-transition-group';
import { transitionDuration, defaultTransitionStyle, transitionStyles } from './../Constants';
import Default from './components/Default'
import Full from './components/Full'

const propTypes = {
  inProp: PropTypes.bool.isRequired,
  label: PropTypes.string,
  full: PropTypes.bool,
}

export default class Loader extends Component {
  render () {
    const { label, inProp, full } = this.props
    return (
      <Transition in={inProp} timeout={transitionDuration}>
        {state => (
          <div>
            <div className={ClassNames({
                'ge-main': true,
                'welcome-loader': full == true, 
                'loader': full != true
              })}
              style={{
                ...defaultTransitionStyle,
                ...transitionStyles[state]
              }}>
              {full == true ? (
                <Full label={label} />
              ) : (
                <Default />
              )}
            </div>
          </div>
        )}
      </Transition>
    )
  }
}

Loader.propTypes = propTypes
