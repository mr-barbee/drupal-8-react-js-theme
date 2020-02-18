import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { TextField, Menu, MenuItem } from '@material-ui/core'

const geGold = 'rgb(207, 172, 68)'
const propTypes = {
  error: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired
  ]),
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  setInputValue: PropTypes.func.isRequired,
  required: PropTypes.bool,
  options: PropTypes.array,
  select: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.string,
  helperText: PropTypes.string,
  textColor: PropTypes.string
}

export default class Textfields extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: this.props.error,
      value: this.props.defaultValue,
      helperText: this.props.helperText
    }
    // bind this to the event handler
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.helperText !== prevProps.helperText) {
      this.setState({helperText: this.props.helperText})
    }
  }

  // handler for when the textfield is changed
  handleChange(event) {
    // check if the input fucntion is set
    if (this.props.setInputValue) {
      // pass the input id and value to the parent Component
      this.props.setInputValue(this.props.id, event.target.value)
    }
    this.setState({value: event.target.value})
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <TextField
          type='text'
          id={this.state.id}
          label={this.props.label}
          error={this.state.error}
          value={this.state.value}
          onChange={this.handleChange}
          select={this.props.select}
          multiline={this.props.multiline}
          rows={this.props.rows}
          helperText={this.state.helperText}
          inputProps={{style: {color: this.props.textColor}}}
          margin='dense'
          fullWidth
        >
          { this.props.select
            ? this.props.options.map((options, i) => {
              // Return the element. Also pass key
              return (<MenuItem key={i} value={options[0]}>{options[1]}</MenuItem>)
            })
            : ''
          }
        </TextField>
      </div>
    )
  }
}

Textfields.propTypes = propTypes

// export default withStyles(styles)(Textfields)
