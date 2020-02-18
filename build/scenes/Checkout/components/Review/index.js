import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import SmartPaymentButtons, { PayPalSDKWrapper } from 'react-smart-payment-buttons'
import {
  getCommerceOrderPending,
  getCommerceOrderError,
  getCommerceOrder } from './../../../../services/redux/reducers/CommerceStoreReducer'
import * as drupalServices from './../../../../services/DrupalServices'
import Button from './../../../../components/FieldElements/Buttons'
import Loader from './../../../../components/Loader'
import ErrorCodes from './../../../ErrorCodes'
import * as constants from './../../../../components/Constants';

class Review extends Component {
  constructor(props){
    super(props);
    this.state = {
      paypalCheckout: false,
      shippingProfile: false,
      postingData: false,
      error: this.props.error
    }
    // Bind (this) to the functions.
    this.setPayPalSmartButtons = this.setPayPalSmartButtons.bind(this);
    this.goBack = this.goBack.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.onApprove = this.onApprove.bind(this);
    this.makeCall = this.makeCall.bind(this);
    this.checkoutComplete = this.checkoutComplete.bind(this);
    this.setShippingProfile = this.setShippingProfile.bind(this);
  }

  componentDidUpdate() {
    const { orderId } = this.props.match.params
    const { commerceOrder, pending } = this.props
    const { paypalCheckout } = this.state
    // We only want to load the Drupal info if
    // 1. The order ID is isNumeric
    // 2. The commerce order is not penidng
    // 3. THe data isnt already pending.
    if (constants.isNumeric(orderId) && pending == false && paypalCheckout == false) {
      // If we are not on the review step them redirect to which step we are currently on.
      const orderUuid = drupalServices.getUuidFromInternalId(orderId, 'order')
      if (orderUuid && commerceOrder[orderUuid].attributes.checkoutStep !== 'review') {
        // go to the appriopriate checkout step.
        this.props.history.push(`/checkout/${this.props.match.params.orderId}/${commerceOrder[orderUuid].attributes.checkoutStep}`)
      } else {
        // Go to the cart page if we are not on the review step.
        const params = { operationId: orderId, checkoutStep: 'review' }
        // Load profile information.
        drupalServices.setOperationAndDispatch('commerceShippingProfiles', params, this.setShippingProfile)
        // Load the cart information.
        drupalServices.setOperationAndDispatch('commercePaypalButtons', params, this.setPayPalSmartButtons)
      }
    }
  }

  setPayPalSmartButtons(data) {
    let { error } = this.state
    let paypalCheckout
    if (data.error == undefined) {
      paypalCheckout = data.response.paypalCheckout
    } else {
      error = data.error
    }
    this.setState({ paypalCheckout, error })
  }

  setShippingProfile(data) {
    let { error } = this.state
    let shippingProfile = {}
    if (data.error == undefined) {
      shippingProfile = data.response.shippingProfile
    } else {
     error = data.error
   }
    this.setState({ shippingProfile, error })
  }

  createOrder() {
    return this.makeCall(this.state.paypalCheckout.onCreateUrl).then(function(data) {
      return data.id;
    });
  }

  onApprove(data) {
    const params = { orderId: this.props.match.params.orderId, id: data.orderID, flow: this.state.paypalCheckout.flow }
    // Complete the drupal order.
    drupalServices.setOperationAndDispatch('completeCommerceOrder', params, this.checkoutComplete)
    this.setState({ postingData: true })
  }

  makeCall(url, settings) {
    settings = settings || {};
    var ajaxSettings = {
      dataType: 'json',
      url: url
    };
    jQuery.extend(ajaxSettings, settings);
    return jQuery.ajax(ajaxSettings);
  }

  checkoutComplete(data) {
    if (data.error == undefined) {
      // Redirect the cart page.
      this.props.history.push(`/checkout/${this.props.match.params.orderId}/complete`)
    } else {
      this.setState({ error: data.error })
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
    const { pending } = this.props
    const { shippingProfile, postingData, paypalCheckout, error } = this.state

    return (
      <div className='store-cart'>
        {pending == false && postingData == false && error == null && paypalCheckout &&
          <div>
            <Button
              id='goBack'
              label='Go Back'
              onClick={this.goBack}
              variant='outlined'
            />
            <h3>Review</h3>
            {shippingProfile &&
              <div>
                <h4>Account Email</h4>
                <p>Email: {shippingProfile.email}</p>
                <h4>Shipping Address</h4>
                <p>First Name: {shippingProfile.given_name}</p>
                <p>Last Name: {shippingProfile.family_name}</p>
                {shippingProfile.organization &&
                  <p>Organization: {shippingProfile.organization}</p>
                }
                <p>Address Line 1: {shippingProfile.address_line1}</p>
                {shippingProfile.address_line2 &&
                  <p>Address Line 2: {shippingProfile.address_line2}</p>
                }
                <p>City: {shippingProfile.locality}</p>
                <p>State: {constants.usStates(shippingProfile.administrative_area)[1]}</p>
                <p>Zip Code: {shippingProfile.postal_code}</p>
              </div>
            }
            <PayPalSDKWrapper clientId={this.state.paypalCheckout.clientId}>
             <SmartPaymentButtons
               createOrder={this.createOrder}
               onApprove={this.onApprove}
             />
           </PayPalSDKWrapper>
          </div>
        }
        <Loader label='Loading...' inProp={pending || postingData || paypalCheckout == false} />
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

export default connect(mapStateToProps)(withRouter(Review));
