import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Loader from './../../components/Loader'
import ClassNames from 'classnames'

const propTypes = {
  absolutePostition: PropTypes.bool.isRequired
}

export default class Maintenance extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    let classes = ClassNames({
      'ge-main': true,
      'maintenance-loader': true,
      'absolute': this.props.absolutePostition === true
    })
    return (
      <div>
        <div className={classes}>
          <Loader label='Check Back Later' full={true} inProp={true} />
        </div>
      </div>
    )
  }
}

Maintenance.propTypes = propTypes
