import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom"
import * as drupalServices from './../../../../services/DrupalServices'
import Loader from './../../../../components/Loader'
import ErrorCodes from './../../../ErrorCodes'
import * as constants from './../../../../components/Constants'

class ViewOrder extends Component {
  constructor(props){
    super(props);
    this.state = {
      orderInformation: false,
      error: null
    }
    // Bind (this) to the functions.
    this.setOrderInformation = this.setOrderInformation.bind(this);
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search)
    const { orderId } = this.props.match.params
    const { token, email } = this.props
    // We only want to load the Drupal info if
    // 1. The order ID is isNumeric
    // 2. The email query param is set
    // 3. The token query param is set
    if (constants.isNumeric(orderId) && email !== null && token !== null) {
      // Go to the cart page if we are not on the review step.
      const params = { orderId, email: query.get('email'), token: query.get('token') }
      // Load profile information.
      drupalServices.setOperationAndDispatch('commerceOrderDetails', params, this.setOrderInformation)
    } else {
      this.setState({ error: { status: 403 } })
    }
  }

  setOrderInformation(data) {
    let { error } = this.state
    let orderInformation = {}
    if (data.error == undefined) {
      orderInformation = data.response.orderInformation
    } else {
     error = data.error
   }
    this.setState({ orderInformation, error })
  }

  render () {
    const { orderInformation, error } = this.state
    return (
      <div className='store-complete'>
        {orderInformation && error == null &&
          <div>
            <h3>Order Information</h3>
            <h4>Status: {orderInformation.state}</h4>
            {orderInformation.tracking_code &&
              <p><a href={orderInformation.tracking_code.value} target='_blank'>Tracking Code</a></p>
            }
            <h4>Order Summary</h4>
            {Object.keys(orderInformation.items).map(index => {
              return (
                <div className='item row' key={index}>
                  <div className='col-md-2'>
                    <p>{orderInformation.items[index].sku.value}</p>
                  </div>
                  <div className='col-md-4'>
                    <p>{orderInformation.items[index].title.value}</p>
                  </div>
                  <div className='col-md-3'>
                    <p>{orderInformation.items[index].quantity}</p>
                  </div>
                  <div className='col-md-3'>
                    <p>{orderInformation.items[index].price}</p>
                  </div>
                </div>
              )
            })}
            <hr />
            <h4>Order Total</h4>
            <p>Shipping: {orderInformation.shipping_amount}</p>
            <p>Total: {orderInformation.total}</p>
            <hr />
            <h4>Email Address</h4>
            <p>{orderInformation.shippingProfile.email}</p>
            <h4>Shipping Address</h4>
            <p>{orderInformation.shippingProfile.given_name} {orderInformation.shippingProfile.family_name}</p>
            {orderInformation.shippingProfile.organization &&
              <p>{orderInformation.shippingProfile.organization}</p>
            }
            <p>{orderInformation.shippingProfile.address_line1}</p>
            {orderInformation.shippingProfile.address_line2 &&
              <p>{orderInformation.shippingProfile.address_line2}</p>
            }
            <p>{orderInformation.shippingProfile.locality}, {constants.usStates(orderInformation.shippingProfile.administrative_area)[0]} {orderInformation.shippingProfile.postal_code}</p>
          </div>
        }
        <Loader label='Loading...' inProp={orderInformation == false && error == null} />
        {error != null &&
          <ErrorCodes error={error} />
        }
      </div>
    )
  }
}

export default withRouter(ViewOrder)
