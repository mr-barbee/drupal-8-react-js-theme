import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import {
  getCommerceOrder,
  getCommerceOrderPending,
  getCommerceOrderError  } from './../../../../services/redux/reducers/CommerceStoreReducer';
import * as drupalServices from './../../../../services/DrupalServices'
import Button from './../../../../components/FieldElements/Buttons'
import TextField from './../../../../components/FieldElements/Textfields'
import Radios from './../../../../components/FieldElements/Radios'
import validation from './../../../../components/FieldElements/Validation'
import Loader from './../../../../components/Loader'
import ErrorCodes from './../../../ErrorCodes'
import * as constants from './../../../../components/Constants';

class Account extends Component {
  constructor(props){
    super(props)
    this.state = {
      shippingProfile: false,
      shippingMethod: false,
      shippingOptions: [],
      postingData: false,
      loadedProfile: false,
      loadedMethod: false,
      error: this.props.error,
      errors: {}
    }
    this._isMounted = false
    // Bind (this) to the functions.
    this.review = this.review.bind(this);
    this.setShippingMethods = this.setShippingMethods.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.setShippingProfile = this.setShippingProfile.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.submitInput = this.submitInput.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentDidUpdate() {
    const { orderId } = this.props.match.params
    const { commerceOrder, pending } = this.props
    let { loadedProfile, loadedMethod } = this.state
    // We only want to load the Drupal info if
    // 1. The order ID is isNumeric
    // 2. The commerce order is not penidng
    // 3. THe data isnt already pending.
    if (constants.isNumeric(orderId) && pending == false && (loadedProfile == false || loadedMethod == false)) {
      // IF the order is complete then diret to that step.
      // We dont want users updating carts orders that are already complete.
      const orderUuid = drupalServices.getUuidFromInternalId(orderId, 'order')
      if (orderUuid && commerceOrder[orderUuid].attributes.checkoutStep == 'complete') {
        // go to the appriopriate checkout step.
        this.props.history.push(`/checkout/${this.props.match.params.orderId}/${commerceOrder[orderUuid].attributes.checkoutStep}`)
      } else if (loadedMethod == false && loadedProfile == false) {
        // Load the shipping methods and address profiles information.
        const params = { operationId: orderId, checkoutStep: 'account' }
        drupalServices.setOperationAndDispatch('commerceShippingMethods', params, this.setShippingMethods)
        drupalServices.setOperationAndDispatch('commerceShippingProfiles', params, this.setShippingProfile)
      }
    }
  }

  setShippingMethods(data) {
    // set the default options.
    let shippingMethod
    const shippingOptions = []
    if (data.error == undefined && this._isMounted) {
      // Add the default shipping method and
      // add each individual option to the state.
      data.response.shippingMethods.forEach((method, key) => {
        if (key == 0) {
          shippingMethod = method.id
        }
        // create the list of options for the select list
        shippingOptions.push({ value: method.id, name: method.amount + ' ' + method.name})
      })
    }
    this._isMounted && this.setState({ loadedMethod: true, shippingMethod, shippingOptions })
  }

  setShippingProfile(data) {
    // set the default options.
    let shippingProfile = {}
    let { error } = this.state
    if (data.error == undefined && this._isMounted) {
      // only save the shipping profile if its an object.
      if (typeof data.response.shippingProfile == 'object') {
        shippingProfile = data.response.shippingProfile
      }
    }
    else {
      error = data.error
    }
    this._isMounted && this.setState({ loadedProfile: true, shippingProfile, error })
  }

  setInputValue (element, value) {
    const { shippingProfile, errors } = this.state
    shippingProfile[element] = value;
    // Remove error from errors.
    // @TODO Add this to the validation class.
    if (element in errors) {
      delete errors[element]
    }
    this.setState({ shippingProfile, errors })
  }

  validateInput() {
    // Validate the input first.
    const validate = new validation(this.state.shippingProfile)
    // Make sure the fields are set.
    validate.checkRequired({
      given_name: 'First Name',
      family_name: 'Last Name',
      email: 'Email',
      address_line1: 'Address 1',
      locality: 'City',
      administrative_area: 'State'
    })
    // Validate we have a valid email.
    validate.validateEmail({email: 'Email'})
    // Make sure the zip and state are valid.
    validate.validateZip({postal_code: 'Zip Code'}, 'administrative_area')
    // Retrieve the errors.
    const errors = validate.getErrors()

    // If no errors are set the submit info.
    if (Object.keys(errors).length) {
      // Set the errors if found.
      this.setState({errors: errors})
    } else {
      this.submitInput()
    }
  }

  submitInput() {
    const params = {
      profile: this.state.shippingProfile,
      order_id: this.props.match.params.orderId,
      shipping_method: this.state.shippingMethod
    }
    // This is defaulted bc we only except US shipping.
    params.profile.country_code = 'US'
    drupalServices.setOperationAndDispatch('postShippingAccountInfo', params, this.review)
    this.setState({ postingData: true })
  }

  review(data) {
    if (this._isMounted) {
      if (data.error == undefined) {
        // Redirect the cart page.
        this.props.history.push(`/checkout/${this.props.match.params.orderId}/review`)
      } else {
        this.setState({ postingData: false })
      }
    }
  }

  /**
   * [goBack description]
   * @return {[type]} [description]
   */
  goBack() {
    this.props.history.goBack();
  }

  render () {
    const { shippingProfile, shippingOptions, shippingMethod, postingData, loadedProfile, error } = this.state
    const { pending } = this.props
    return (
      <div className='checkout-account'>
        {pending == false && postingData == false && loadedProfile == true && error == null &&
          <div>
            <Button
              id='goBack'
              label='Go Back'
              onClick={this.goBack}
              variant='outlined'
            />
            <h3>Account</h3>
            {shippingProfile &&
              <div>
                <div className='row'>
                  <div className='col-md-12'>
                    <TextField
                      id='email'
                      error={'email' in this.state.errors}
                      label='Email Address'
                      defaultValue={shippingProfile.email ? shippingProfile.email : ''}
                      setInputValue={this.setInputValue}
                      helperText={this.state.errors.email}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <TextField
                      id='given_name'
                      error={'given_name' in this.state.errors}
                      label='First Name'
                      defaultValue={shippingProfile.given_name ? shippingProfile.given_name : ''}
                      setInputValue={this.setInputValue}
                      helperText={this.state.errors.given_name}
                    />
                  </div>
                  <div className='col-md-6'>
                    <TextField
                      id='family_name'
                      error={'family_name' in this.state.errors}
                      label='Last Name'
                      defaultValue={shippingProfile.family_name ? shippingProfile.family_name : ''}
                      setInputValue={this.setInputValue}
                      helperText={this.state.errors.family_name}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-12'>
                    <TextField
                      id='organization'
                      error={'organization' in this.state.errors}
                      label='Organization'
                      defaultValue={shippingProfile.organization ? shippingProfile.organization : ''}
                      setInputValue={this.setInputValue}
                      helperText={this.state.errors.organization}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-12'>
                    <TextField
                      id='address_line1'
                      error={'address_line1' in this.state.errors}
                      label='Address 1'
                      defaultValue={shippingProfile.address_line1 ? shippingProfile.address_line1 : ''}
                      setInputValue={this.setInputValue}
                      helperText={this.state.errors.address_line1}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-12'>
                    <TextField
                      id='address_line2'
                      error={'address_line2' in this.state.errors}
                      label='Address 2'
                      defaultValue={shippingProfile.address_line2 ? shippingProfile.address_line2 : ''}
                      setInputValue={this.setInputValue}
                      helperText={this.state.errors.address_line2}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-5'>
                    <TextField
                      id='locality'
                      error={'locality' in this.state.errors}
                      label='City'
                      defaultValue={shippingProfile.locality ? shippingProfile.locality : ''}
                      setInputValue={this.setInputValue}
                      helperText={this.state.errors.locality}
                    />
                  </div>
                  <div className='col-md-4'>
                    <TextField
                      id='administrative_area'
                      error={false}
                      label='State'
                      defaultValue={shippingProfile.administrative_area ? shippingProfile.administrative_area : ''}
                      setInputValue={this.setInputValue}
                      helperText={this.state.errors.administrative_area}
                      options={constants.usStates()}
                      select
                    />
                  </div>
                  <div className='col-md-3'>
                    <TextField
                      id='postal_code'
                      error={'postal_code' in this.state.errors}
                      label='Zip Code'
                      defaultValue={shippingProfile.postal_code ? shippingProfile.postal_code : ''}
                      setInputValue={this.setInputValue}
                      helperText={this.state.errors.postal_code}
                    />
                  </div>
                </div>
              </div>
            }
            {shippingOptions.length > 0 &&
              <div>
                <Radios
                  id='shipping'
                  label={'Shipping'}
                  required={true}
                  options={shippingOptions}
                  defaultValue={shippingMethod}
                  setInputValue={this.setInputValue}
                />
              </div>
            }
            <Button
              id='review'
              label='Review Order'
              onClick={this.validateInput}
              variant='outlined'
            />
          </div>
        }
        <Loader label='Loading...' inProp={pending || postingData || loadedProfile == false} />
        {error != null &&
          <ErrorCodes error={error} />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  error: getCommerceOrderError(state),
  commerceOrder: getCommerceOrder(state),
  pending: getCommerceOrderPending(state),
})

export default connect(mapStateToProps)(withRouter(Account));
