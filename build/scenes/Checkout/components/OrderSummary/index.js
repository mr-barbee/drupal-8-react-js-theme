import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter, matchPath } from "react-router-dom";
import { getCommerceCart,
        getCommerceCartPending,
        getCommerceOrderPending,
        getCommerceOrder,
        getCommerceOrderError } from './../../../../services/redux/reducers/CommerceStoreReducer';
import * as drupalServices from './../../../../services/DrupalServices'
import Button from './../../../../components/FieldElements/Buttons'

class OrderSummary extends Component {
  constructor(props){
    super(props)
    this.state = {
      summaryLoaded: false,
      orderSummary: [],
      showCheckout: false
    }
    this._isMounted = false
    // Bind (this) to the functions.
    this.setOrderSummary = this.setOrderSummary.bind(this);
    this.checkout = this.checkout.bind(this);
    this.updateOrderSummary = this.updateOrderSummary.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    this.updateOrderSummary()
  }

  componentDidUpdate(prevProps) {
    const { summaryLoaded } = this.state
    const { cartPending } = this.props
    // We want to update the order summary if:
    // 1. The cart is not pending
    // 2. a. And the cart was just recently updated
    //    b. Or if the order summary hasnt been pulled before
    //    c. Or the previous pathname doesn not match current means the page changed.
    if (cartPending == false && (prevProps.cartPending == true || summaryLoaded == false || prevProps.location.pathname !== this.props.location.pathname)) {
      this.updateOrderSummary()
    }
  }

  updateOrderSummary() {
    const { orderId } = this.props
    // Make sure the cart Items is set first.
    // this is loaded in the Cart componentDidMount.
    if (orderId) {
      const params = { operationId: orderId }
      drupalServices.setOperationAndDispatch('commerceOrderSummary', params, this.setOrderSummary)
    }
  }

  setOrderSummary(data) {
    if (data.error == undefined) {
      this._isMounted && this.setState({ orderSummary: data.response.totalAdjustments, summaryLoaded: true, showCheckout: true })
    }
    else {
      this._isMounted && this.setState({ showCheckout: false, summaryLoaded: true })
    }
  }

  checkout() {
    // Redirect the cart page.
    this.props.history.push(`${this.props.match.path}/${this.props.commerceCart.order_id}/account`)
  }

  render () {
    const onCart = matchPath(this.props.location.pathname, {
      path: '/checkout',
      exact: true,
      strict: false
    });

    const { orderSummary, showCheckout } = this.state
    const { commerceCart } = this.props
    return (
      <div className='order-summary'>
        <div>
          <h3>Order Summary</h3>
          <p>Subtotal: {orderSummary.length !== 0 && showCheckout ? orderSummary.subtotal : '$0.00'}</p>
          {orderSummary.shipping !== undefined && showCheckout &&
            <p>Shipping: {orderSummary.shipping}</p>
          }
          <p>Tax: {orderSummary.length !== 0 && showCheckout ? orderSummary.tax : '$0.00'}</p>
          <p>Total Price: {orderSummary.length !== 0 && showCheckout ? orderSummary.total : '$0.00'}</p>
          {showCheckout && onCart !== null && typeof(commerceCart) === 'object' && Object.keys(commerceCart).includes('order_id') &&
            <Button
              id='checkout'
              label='Checkout'
              onClick={this.checkout}
              variant='outlined'
            />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  cartPending: getCommerceCartPending(state),
  commerceCart: getCommerceCart(state),
  error: getCommerceOrderError(state),
  commerceOrder: getCommerceOrder(state),
  pending: getCommerceOrderPending(state),
})

export default connect(mapStateToProps)(withRouter(OrderSummary));
