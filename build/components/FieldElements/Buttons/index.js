import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';

const propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired
  ]),
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.string,
  disabled: PropTypes.bool
}

export default class Buttons extends Component {
  constructor (props) {
    super(props)
    this.state = {
      label: this.props.label,
      id: this.props.id,
      variant: this.props.variant
    }
  }
  render () {
    const { classes } = this.props
    return (
      <Button
        disabled={this.props.disabled}
        id={this.state.id}
        color='inherit'
        variant={this.state.variant}
        onClick={() => { this.props.onClick(this.state.id) }} >
        {this.state.label}
      </Button>
    )
  }
}

Buttons.propTypes = propTypes
