import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import {
  getCommerceCart,
  getCommerceCartPending,
  getCommerceCartError } from './../../../../services/redux/reducers/CommerceStoreReducer'
import CircularProgress from '@material-ui/core/CircularProgress'
import * as drupalServices from './../../../../services/DrupalServices'
import GoogleAnalytics from './../../../../services/GoogleAnalytics'
import Button from './../../../../components/FieldElements/Buttons'
import TextField from './../../../../components/FieldElements/Textfields'
import Loader from './../../../../components/Loader'
import Image from './../../../../components/Images'

class Cart extends Component {
  constructor(props){
    super(props);
    this.state = {
      cartUpdating: false,
      analytics: new GoogleAnalytics()
    }
    this._isMounted = false
    // Bind (this) to the functions.
    this.deleteCart = this.deleteCart.bind(this);
    this.cartUpdated = this.cartUpdated.bind(this);
    this.updateCartItem = this.updateCartItem.bind(this);
    this.deleteCartItem = this.deleteCartItem.bind(this);
    this.getQuantityOptions = this.getQuantityOptions.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    // Load the cart information.
    drupalServices.setOperationAndDispatch('commerceCart')
  }

  /**
   * Updates the quantity of the cart item.
   * @param  {[type]} orderItemId [description]
   * @param  {[type]} quantity [description]
   */
  updateCartItem(orderItemId , quantity) {
    const params = { orderId: this.props.commerceCart.order_id, orderItemId, quantity }
    drupalServices.setOperationAndDispatch('commerceUpdateCartItem', params, this.cartUpdated)
    this.state.analytics.trackEvent('Update Cart Item', {
      category: 'commerce',
      label: 'Quantity Update',
      value: this.props.commerceCart.order_id
    })
    this.setState({ cartUpdating: orderItemId })
  }

  /**
   * Deletes a cart item.
   * @param  {[type]} orderItemId the cart item the wish to delete.
   */
  deleteCartItem(orderItemId) {
    // delete the cart item.
    const params = { orderId: this.props.commerceCart.order_id, orderItemId }
    drupalServices.setOperationAndDispatch('commerceDeleteCartItem', params, this.cartUpdated)
    this.state.analytics.trackEvent('Delete Cart Item', {
      category: 'commerce',
      label: 'Remove item',
      value: this.props.commerceCart.order_id
    })
    this.setState({ cartUpdating: orderItemId })
  }

  /**
   * Deletes the entire cart based on order id
   */
  deleteCart() {
    const params = { orderId: this.props.commerceCart.order_id }
    drupalServices.setOperationAndDispatch('commerceDeleteCart', params, this.cartUpdated)
    this.state.analytics.trackEvent('Delete Cart', {
      category: 'commerce',
      label: 'Remove entire cart',
      value: this.props.commerceCart.order_id
    })
    this.setState({ cartUpdating: true })
  }

  cartUpdated() {
    if (this._isMounted) {
      // Load the cart information.
      drupalServices.setOperationAndDispatch('commerceCart')
      this.setState({ cartUpdating: false })
    }
  }

  getQuantityOptions(quantity) {
    const quantityOptions = []
    // getting the default option first.
    quantityOptions[Math.trunc(quantity)] = [Math.trunc(quantity), Math.trunc(quantity).toString()]
    let decrease = Math.trunc(quantity);
    let count = 1
    while(decrease > 1) {
       decrease--
       quantityOptions[decrease] = [decrease, decrease.toString()]
    }
    let increase = Math.trunc(quantity);
    count = 1
    while(count < 3) {
       increase++
       quantityOptions[increase] = [increase, increase.toString()]
       count++
    }
    return quantityOptions
  }

  render () {
    const { commerceCart, error, pending } = this.props
    const { cartUpdating } = this.state
    const cart = commerceCart !== undefined && Object.values(commerceCart).length ? commerceCart : false

    return (
      <div className='store-cart'>
        {pending == false &&
          <div className='row'>
            <div className='col-md-12'>
              {cart && cart.order_items.length !== 0 &&
                <div>
                  {commerceCart.order_items.map((orderItem, index) => {
                    // Get the first image file to use as a default image.
                    const id = orderItem.purchased_entity.field_product_images[0]
                    return (
                      <div className='cart-item' key={index}>
                        <div className='cart-item-remove'>
                          <a onClick={() => this.deleteCartItem(orderItem.order_item_id)}><i className='fas fa-times-circle'></i></a>
                        </div>
                        <div className='row'>
                          <div className='col-sm-3 col-xs-5'>
                            <Image className='cart-item-image' width={120} height={160} uuid={false} media={id} />
                          </div>
                          <div className='col-sm-8 col-xs-6'>
                            <div className='row'>
                              <div className='cart-item-title col-md-12'>
                                <p>Title : {orderItem.purchased_entity.title}</p>
                              </div>
                              <div className='cart-item-quantity col-md-12'>
                                <TextField
                                  id={orderItem.order_item_id}
                                  error={false}
                                  label='Quantity'
                                  defaultValue={Math.trunc(orderItem.quantity).toString()}
                                  setInputValue={this.updateCartItem}
                                  textColor='white'
                                  options={this.getQuantityOptions(orderItem.quantity)}
                                  select
                                />
                                {cartUpdating == orderItem.order_item_id &&
                                  <CircularProgress />
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='cart-item-price'>
                          <p>Unit Price : {orderItem.purchased_entity.price.formatted}</p>
                        </div>
                      </div>
                    )
                  })}
                  <div className='delete-cart'>
                    {cartUpdating !== true &&
                      <Button
                        id='deleteCart'
                        label='Delete Entire Cart'
                        onClick={this.deleteCart}
                        variant='outlined'
                        disabled={this.cartUpdating}
                      />
                    }
                    {cartUpdating == true &&
                      <CircularProgress />
                    }
                  </div>
                </div>
              }
              <div className='continue-shopping'>
                <Link to='/store'>Continue Shopping</Link>
              </div>
            </div>
          </div>
        }
        <Loader label='Loading...' inProp={pending} />
        {error &&
          <div style={{ color: '#900' }}>
            {error}
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  error: getCommerceCartError(state),
  commerceCart: getCommerceCart(state),
  pending: getCommerceCartPending(state)
})

export default connect(mapStateToProps)(withRouter(Cart))
