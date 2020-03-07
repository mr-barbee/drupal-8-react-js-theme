import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from "react-router-dom";
import {
  getCommerceOrder,
  getCommerceOrderPending,
  getCommerceOrderError,
  getCommerceStore  } from './../../../../services/redux/reducers/CommerceStoreReducer'
import * as drupalServices from './../../../../services/DrupalServices'
import Loader from './../../../../components/Loader'
import ErrorCodes from './../../../ErrorCodes'
import * as constants from './../../../../components/Constants'

class Complete extends Component {
  constructor(props){
    super(props);
    this.state = {
      shippingProfile: false,
      orderToken: false,
      error: this.props.error
    }
    this._isMounted = false
    // Bind (this) to the functions.
    this.setShippingProfile = this.setShippingProfile.bind(this);
    this.setHashToken = this.setHashToken.bind(this);
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
    const { shippingProfile, orderToken } = this.state
    // We only want to load the Drupal info if
    // 1. The order ID is isNumeric
    // 2. The commerce order is not penidng
    // 3. THe data isnt already pending.
    if (constants.isNumeric(orderId) && pending == false && (shippingProfile == false || orderToken == false)) {
      // If we are not on the review step them redirect to which step we are currently on.
      const orderUuid = drupalServices.getUuidFromInternalId(orderId, 'order')
      if (orderUuid && commerceOrder[orderUuid].attributes.checkoutStep !== 'complete') {
        // go to the appriopriate checkout step.
        this.props.history.push(`/checkout/${this.props.match.params.orderId}/${commerceOrder[orderUuid].attributes.checkoutStep}`)
      } else if (shippingProfile == false && orderToken == false) {
        // Go to the cart page if we are not on the review step.
        const params = { operationId: orderId }
        // Load profile information.
        drupalServices.setOperationAndDispatch('commerceShippingProfiles', params, this.setShippingProfile)
        // Load the hash for the url order token.
        drupalServices.setOperationAndDispatch('generateHashToken', {orderId}, this.setHashToken)
      }
    }
  }

  setHashToken(data) {
    if (this._isMounted) {
      let { error } = this.state
      let orderToken
      if (data.error == undefined) {
        orderToken = data.response.token
      } else {
       error = data.error
     }
      this.setState({ orderToken, error })
    }
  }

  setShippingProfile(data) {
    if (this._isMounted) {
      let { error } = this.state
      let shippingProfile = {}
      if (data.error == undefined) {
        shippingProfile = data.response.shippingProfile
      } else {
       error = data.error
     }
      this.setState({ shippingProfile, error })
    }
  }

  render () {
    const { shippingProfile, orderToken, error } = this.state
    const { commerceStoreOnline, commerceOrder } = this.props
    const { orderId } = this.props.match.params
    const orderUuid = drupalServices.getUuidFromInternalId(orderId, 'order')
    const stores = Object.keys(commerceStoreOnline).length ? commerceStoreOnline : false
    // Get the store UUID from the order.
    const storeUuid = orderUuid ? commerceOrder[orderUuid].relationships.storeId.data.id : false
    const store = stores && Object.keys(stores).includes(storeUuid) ? stores[storeUuid] : false
    let viewOrder
    if (orderUuid && orderToken) {
      const email = encodeURIComponent(commerceOrder[orderUuid].attributes.mail)
      viewOrder = `/checkout/${orderId}/view-order?token=${orderToken}&email=${email}`
    }
    return (
      <div className='checkout-complete'>
        {shippingProfile && error == null &&
          <div>
            <div className='complete-callout'>
              <h3>Complete</h3>
              <p>Thank you for you order it will will be shipped out soon.</p>
            </div>
            <div className='complete-review'>
              <h4>Shipping To</h4>
              <p>{shippingProfile.given_name} {shippingProfile.family_name}</p>
              {shippingProfile.organization &&
                <p>{shippingProfile.organization}</p>
              }
              <p>{shippingProfile.address_line1}</p>
              {shippingProfile.address_line2 &&
                <p>{shippingProfile.address_line2}</p>
              }
              <p>{shippingProfile.locality}, {constants.usStates(shippingProfile.administrative_area)[0]} {shippingProfile.postal_code}</p>
              {viewOrder !== null &&
                <p>View your order progress <Link to={viewOrder}>here</Link></p>
              }
            </div>
            <div className='complete-add-info'>
              <p className='callout'>We will notify you when your order has been shipped.</p>
              {store &&
                <div className='store-info'>
                  <h4>{store.attributes.name}</h4>
                  <p>{store.attributes.address.addressLine1}</p>
                  <p>{store.attributes.address.locality}, {store.attributes.address.administrativeArea} {store.attributes.address.postalCode}</p>
                  <p>Email: <a href={`mailto:${store.attributes.mail}`}>{store.attributes.mail}</a></p>
                </div>
              }
            </div>
          </div>
        }
        <Loader label='Loading...' inProp={shippingProfile == false} />
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
  commerceStoreOnline: getCommerceStore(state)
})

export default connect(mapStateToProps)(withRouter(Complete));
