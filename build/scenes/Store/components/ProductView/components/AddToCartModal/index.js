import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@material-ui/core'
import Button from './../../../../../../components/FieldElements/Buttons'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
})

const propTypes = {
  onClick: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  data: PropTypes.object.isRequired
}

class AddToCartModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: this.props.inProp,
      errors: {}
    }
    // bind this to the event handler
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.continueShopping = this.continueShopping.bind(this)
  }

  componentDidUpdate() {
    if (this.state.open !== this.props.inProp) {
      //Perform some operation here
      this.setState({open: this.props.inProp});
    }
  }

  handleClick () {
    this.props.onClick()
  }

  handleClose () {
    if (typeof this.props.onCancel() === 'function') {
      this.props.onCancel()
    } else {
      this.setState({ open: false })
    }
  }

  handleSubmit () {
    // Redirect the cart page.
    this.props.history.push('/checkout')
  }


  continueShopping () {
    // Redirect the cart page.
    this.props.history.push('/store')
  }

  render () {
    return (
      <div className='add-to-cart-form'>
        <a className='add-to-cart-link' onClick={this.handleClick}>Add to Cart</a>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='form-dialog-title'
          TransitionComponent={Transition}
        >
          { this.state.open && this.props.data.error == undefined &&
            <div>
              <DialogTitle id='form-dialog-title'>Product added to the cart</DialogTitle>
              <DialogContent>
                <h2>{this.props.data.purchased_entity.title}</h2>
                <h4>Sku: {this.props.data.purchased_entity.sku}</h4>
                <h4>Price: {this.props.data.purchased_entity.price.formatted}</h4>
                <DialogContentText>
                  You can go straight to the cart or update the product here.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  id='continue'
                  label='Continue Shopping'
                  onClick={this.handleClose}
                />
                <Button
                  id='cart'
                  label='Go to Cart'
                  onClick={this.handleSubmit}
                  variant='outlined'
                />
              </DialogActions>
            </div>
          }
          { this.props.data.error == true &&
            <div>
              <DialogTitle id='form-dialog-title'>Product not added to the cart</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please Contact Site Administration.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  id='continue'
                  label='Continue Shopping'
                  onClick={this.continueShopping}
                />
              </DialogActions>
            </div>
          }
        </Dialog>
      </div>
    )
  }
}

AddToCartModal.propTypes = propTypes

export default withRouter(AddToCartModal)
