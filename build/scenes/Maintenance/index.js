import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Loader from './../../components/Loader';

export default class Maintenance extends Component {
  render () {
    return (
      <div>
        <div className="ge-main maintenance-loader">
          <Loader label='Check Back Later' full={true} inProp={true} />
        </div>
      </div>
    )
  }
}
