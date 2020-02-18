import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core'

const propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  setInputValue: PropTypes.func.isRequired,
  required: PropTypes.bool
}

export default class Radios extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.defaultValue
      // error: this.props.error,
    }
    // bind this to the event handler
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    // check if the input fucntion is set
    if (this.props.setInputValue) {
      // pass the input id and value to the parent Component
      this.props.setInputValue(this.props.id, event.target.value)
    }
    this.setState({ value: event.target.value })
  }

  render () {
    return (
      <div>
        <FormControl component='fieldset' {...this.props.required}>
          <FormLabel component='legend'>{this.props.label}</FormLabel>
          <RadioGroup
            aria-label={this.props.label}
            name={this.props.label}
            value={this.state.value}
            onChange={this.handleChange}
          >
            { this.props.options.map((options, i) => {
              // Return the element. Also pass key
              return (
                <FormControlLabel
                  key={i}
                  value={options.value}
                  control={<Radio />}
                  label={options.name}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </div>
    )
  }
}

Radios.propTypes = propTypes
