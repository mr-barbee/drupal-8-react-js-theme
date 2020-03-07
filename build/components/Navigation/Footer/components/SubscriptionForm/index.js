import React, {Component} from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@material-ui/core'
import Button from '../../../../FieldElements/Buttons'
import TextField from '../../../../FieldElements/Textfields'
import validation from '../../../../FieldElements/Validation'
import * as drupalServices from './../../../../../services/DrupalServices'
import GoogleAnalytics from './../../../../../services/GoogleAnalytics'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class SubscriptionForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      successMessage: '',
      subscription: {},
      errors: {},
      isSubscribed: false
    }
    // bind this to the event handler
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleValidate = this.handleValidate.bind(this)
    this.checkDataPost = this.checkDataPost.bind(this)
    this.setInputValue = this.setInputValue.bind(this)
  }

  handleClickOpen () {
    this.setState({ open: true })
  }

  handleClose () {
    this.setState({
      open: false,
      isSubscribed: false,
      subscription: {},
      successMessage: '',
      errors: {}
    })
  }

  closeTimer() {
    const timer = setTimeout(() => this.handleClose(), 3000);
    return () => clearTimeout(timer);
  }

  handleValidate () {
    // Validate the input first.
    const validate = new validation(this.state.subscription)
    // Make sure the fields are set.
    validate.checkRequired({
      name: 'Name',
      email: 'Email'
    })
    // Validate we have a valid email.
    validate.validateEmail({email: 'Email'})
    // Retrieve the errors.
    const errors = validate.getErrors()
    // If no errors are set the submit info.
    if (Object.keys(errors).length) {
      // Set the errors if found.
      this.setState({errors: errors})
    } else {
      this.handleSubmit()
    }
  }

  handleSubmit () {
    const { subscription } = this.state
    const params = { subscription }
    drupalServices.setOperationAndDispatch('subscriptionForm', params, this.checkDataPost)
  }

  checkDataPost (data) {
    // set the default options.
    let { errors, isSubscribed, successMessage } = this.state
    if (data.error == undefined) {
      isSubscribed = true;
      successMessage = data.response.message
      this.closeTimer()
    } else {
      errors.technical = data.error.message
    }
    const analytics = new GoogleAnalytics()
    analytics.trackEvent('Subscription Form', {
      category: 'subscribe',
      label: 'Newsletter',
      value: ''
    })
    this.setState({ isSubscribed, successMessage, errors })
  }

  setInputValue (element, value) {
    const { subscription, errors } = this.state
    // set the input value and save it to the state
    subscription[element] = value
    // Remove error from errors.
    // @TODO Add this to the validation class.
    if (element in errors) {
      delete errors[element]
    }
    this.setState({ subscription, errors })
  }

  render () {
    const { open, isSubscribed, errors, successMessage } = this.state
    return (
      <div className="subscription-form">
        <a className="subscribe-link" onClick={this.handleClickOpen}>Subscribe</a>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby='form-dialog-title'
          TransitionComponent={Transition}
        >
          <DialogTitle id='form-dialog-title'>Subscribe</DialogTitle>
          {isSubscribed
              ? <div>
                <DialogContent>
                  <DialogContentText>
                    {successMessage}
                  </DialogContentText>
                </DialogContent>
              </div>
            : <div>
              <DialogContent>
                { 'technical' in errors
                  ? <DialogContentText className='error'>
                    {errors.technical}
                  </DialogContentText>
                  : ''
                }
                <DialogContentText>
                  To subscribe to this website, please enter your email address here. We will send
                  updates occationally.
                </DialogContentText>
                <TextField
                  id='name'
                  error={'name' in errors}
                  label='Name'
                  defaultValue=''
                  setInputValue={this.setInputValue}
                  helperText={errors.name}
                  textColor='black'
                />
                <TextField
                  id='email'
                  error={'email' in errors}
                  label='Email Address'
                  defaultValue=''
                  setInputValue={this.setInputValue}
                  helperText={errors.email}
                  textColor='black'
                />
              </DialogContent>
              <DialogActions>
                <Button
                  id='cancel'
                  label='Cancel'
                  onClick={this.handleClose}
                />
                <Button
                  id='subscribe'
                  label='Subscribe'
                  onClick={this.handleValidate}
                  variant='outlined'
                />
              </DialogActions>
            </div>
          }
        </Dialog>
      </div>
    )
  }
}
