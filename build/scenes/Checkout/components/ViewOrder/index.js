import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from "react-router-dom"
import { getCommerceStore  } from './../../../../services/redux/reducers/CommerceStoreReducer'
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
    this._isMounted = false
    // Bind (this) to the functions.
    this.setOrderInformation = this.setOrderInformation.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
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
    if (this._isMounted) {
      let { error } = this.state
      let orderInformation = {}
      if (data.error == undefined) {
        orderInformation = data.response.orderInformation
      } else {
       error = data.error
     }
      this.setState({ orderInformation, error })
    }
  }

  render () {
    const { orderInformation, error } = this.state
    const { commerceStoreOnline } = this.props
    // @TODO get the uuid from the endpoint.
    const store = Object.keys(commerceStoreOnline).length ? Object.values(commerceStoreOnline)[0] : false
    return (
      <div className='checkout-view-order'>
        {orderInformation && error == null &&
          <div>
            <h3>Order Information</h3>
            <h4>Status: {orderInformation.state}</h4>
            {orderInformation.tracking_code &&
              <p><a href={orderInformation.tracking_code.value} target='_blank'>Tracking Code</a></p>
            }
            <div className='order-information'>
              <div className='section cart-items'>
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
                        <p>x{Math.trunc(orderInformation.items[index].quantity).toString()}</p>
                      </div>
                      <div className='col-md-3'>
                        <p>{orderInformation.items[index].price}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className='section'>
                <h4>Order Total</h4>
                <p>Shipping: {orderInformation.shipping_amount}</p>
                <p>Total: {orderInformation.total}</p>
              </div>
              <div className='section'>
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
              {store &&
                <div className='store-info'>
                  <p>If you have an questions about your order contact us by Email: <a href={`mailto:${store.attributes.mail}`}>{store.attributes.mail}</a></p>
                  <h4>{store.attributes.name}</h4>
                  <p>{store.attributes.address.addressLine1}</p>
                  <p>{store.attributes.address.locality}, {store.attributes.address.administrativeArea} {store.attributes.address.postalCode}</p>
                </div>
              }
            </div>
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

const mapStateToProps = state => ({
  commerceStoreOnline: getCommerceStore(state)
})

export default connect(mapStateToProps)(withRouter(ViewOrder));
