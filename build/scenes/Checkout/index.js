import React, { Component } from 'react'
import { connect } from 'react-redux';
import ClassNames from 'classnames'
import {
  Switch,
  Route,
  withRouter,
  matchPath } from "react-router-dom";
import {
  getCommerceOrderPending,
  getCommerceOrderError,
  getCommerceCart } from './../../services/redux/reducers/CommerceStoreReducer'
import Cart from './components/Cart'
import Account from './components/Account'
import Review from './components/Review'
import Complete from './components/Complete'
import OrderSummary from './components/OrderSummary'
import ViewOrder from './components/ViewOrder'
import ErrorCodes from './../ErrorCodes'
import * as drupalServices from './../../services/DrupalServices'

class Checkout extends Component {
  constructor(props){
    super(props);
    this.state = {
      orderId: false
    }
    this.loadCommerceOrder = this.loadCommerceOrder.bind(this);
  }

  componentDidMount() {
    // load the drupal store.
    drupalServices.setOperationAndDispatch('commerceStoreOnline')
    // load the comerce order.
    this.loadCommerceOrder()
  }

  componentDidUpdate(prevProps) {
    // 1. a. Or if the order hasnt been pulled before
    //    b. Or the previous pathname doesn not match current means the page changed.
    if (prevProps.location.pathname !== this.props.location.pathname || this.state.orderId == false) {
      this.loadCommerceOrder()
    }
  }

  loadCommerceOrder() {
    const { commerceCart } = this.props
    // Match the checkout path.
    const checkout = matchPath(this.props.location.pathname, {
      path: [
              `${this.props.match.path}/:orderId/account`,
              `${this.props.match.path}/:orderId/review`,
              `${this.props.match.path}/:orderId/complete`
            ],
      exact: true,
      strict: false
    });
    // If we are on the checkout pages pull order ID from
    //  params otherwise pull from cart.
    let orderId
    if (checkout !== null) {
      orderId = checkout.params.orderId
    } else if (checkout == null && typeof(commerceCart) === 'object' && Object.keys(commerceCart).includes('order_id')) {
      orderId = commerceCart.order_id
    } else {
      orderId = false
    }
    // Get the order if the ID is set.
    if (orderId) {
      const params = { operationId: orderId }
      drupalServices.setOperationAndDispatch('commerceOrderDefault', params)
      this.setState({ orderId })
    }
  }

  render () {
    const noOrderSummary = matchPath(this.props.location.pathname, {
      path: [
              `${this.props.match.path}/:orderId/complete`,
              `${this.props.match.path}/:orderId/view-order`
            ],
      exact: true,
      strict: false
    });
    let mainContentClasses = ClassNames({
      'col-md-9': noOrderSummary == null,
      'col-md-pull-3': noOrderSummary == null,
      'col-md-12': noOrderSummary !== null,
      'checkout-content': true
    })
    return (
      <div className='store-checkout'>
        <div className='container'>
          <div className='row'>
            {noOrderSummary == null &&
              <div className='col-md-3 col-md-push-9'>
                <OrderSummary orderId={this.state.orderId} />
              </div>
            }
            <div className={mainContentClasses}>
              <Switch>
                <Route exact path={this.props.match.path} exact component={ Cart } />
                <Route exact path={`${this.props.match.path}/:orderId/account`} exact component={ Account } />
                <Route exact path={`${this.props.match.path}/:orderId/review`} exact component={ Review } />
                <Route exact path={`${this.props.match.path}/:orderId/complete`} exact component={ Complete } />
                <Route exact path={`${this.props.match.path}/:orderId/view-order`} exact component={ ViewOrder } />
                <Route path='*'>
                  <ErrorCodes error={{ status: 403 }} />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  error: getCommerceOrderError(state),
  pending: getCommerceOrderPending(state),
  commerceCart: getCommerceCart(state),
})

export default connect(mapStateToProps)(withRouter(Checkout));
