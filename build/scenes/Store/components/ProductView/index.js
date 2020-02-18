import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import ClassNames from 'classnames'
import {
  getCommerceStore,
  getCommerceProducts,
  getCommerceProductVariations,
  getCommerceStoreError,
  getCommerceStorePending,
  getCommerceProductAttributeValueSize } from './../../../../services/redux/reducers/CommerceStoreReducer';
import * as drupalServices from './../../../../services/DrupalServices'
import Loader from './../../../../components/Loader'
import Radio from './../../../../components/FieldElements/Radios'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import AddToCartModal from './components/AddToCartModal'
import CircularProgress from '@material-ui/core/CircularProgress'
import Image from './../../../../components/Images'
import Button from './../../../../components/FieldElements/Buttons'

/**
 * [ProductView description]
 * @extends Component
 */
class ProductView extends Component {
  constructor(props){
    super(props);
    this.state = {
      uuid: false,
      currentVariation: false,
      viewerImage: false,
      inProp: false,
      productLoader: false,
      productAddedData: {}
    }
    // Bind (this) to the functions.
    this.goBack = this.goBack.bind(this);
    this.productAddedToCart = this.productAddedToCart.bind(this);
    this.cancelCartModal = this.cancelCartModal.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.srcSet = this.srcSet.bind(this);
    this.updateViewerImage = this.updateViewerImage.bind(this);
    this.updateCurrentProductVariation = this.updateCurrentProductVariation.bind(this);
  }

  componentDidMount() {
    const { productId } = this.props.match.params
    // Get the uuid of the product.
    const uuid = drupalServices.getUuidFromInternalId(productId, 'product')
    // If the uuid isnt set then laod it.
    if (uuid == false) {
      const params = { operationId: productId }
      drupalServices.setOperationAndDispatch('commerceProductDefault', params)
    } else {
      // Add the uuid to the state.
      this.setState({ uuid: uuid })
    }
  }

  componentDidUpdate() {
    // Load the variatians if they are not already set.
    const { commerceProductVariations, commerceProducts, error, pending } = this.props
    // Get the uuid of the product.
    const { productId } = this.props.match.params
    const uuid = drupalServices.getUuidFromInternalId(productId, 'product')
    // Add the uuid to the state if its not already set.
    if (this.state.uuid == false && uuid) {
      this.setState({ uuid: uuid})
    }
    if (this.state.uuid) {
      const variatians = commerceProducts[this.state.uuid].relationships.variations.data
      // We only want to loop the collection if:
      // 1. There isnt a current error set
      // 2. the Variations Products collection is set
      // 3. The api isnt currenlty pending.
      if (error == null && variatians.length && pending == false) {
        let variationPromises = []
        for (const variatian of variatians) {
          // Get the type and id for the drupal media.
          const type = variatian.type
          const id = variatian.id
          // Only fetch the variatian if it isnt already in the store.
          if (drupalServices.checkData(type, id) == false && drupalServices.containsObject({ id: id }, variationPromises) == false) {
            variationPromises.push({ id, type })
          }
        }
        // load all of the promises at once.
        drupalServices.dispatchPromises(variationPromises)
        // set the first variation if the current variation isnt already set.
        if (this.state.currentVariation == false) {
          // Add the first variation to the state.
          this.setState({ currentVariation: variatians[0].id })
        }
        // set the first variation if the current variation isnt already set.
        if (this.state.viewerImage == false && Object.keys(commerceProductVariations).includes(variatians[0].id)) {
          // Add the first variation to the state.
          this.setState({ viewerImage: commerceProductVariations[variatians[0].id].relationships.fieldProductImages.data[0].id })
        }
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

  /**
   * [updateCurrentProductVariation description]
   * @param  {integer} id    [description]
   * @param  {variation UUID} value [description]
   */
  updateCurrentProductVariation(id, value) {
    // Find the variation with this attribute size.
    // update the current variation.
    this.setState({ currentVariation: value })
  }
  s
  /**
   * [productAddedToCart description]
   * @param  {object} data [description]
   */
  productAddedToCart(data) {
    // Set the In prop for the
    // add to cart modal.
    this.setState({
      inProp: true,
      productAddedData: data.response[0],
      productLoader: false
    })
  }

  /**
   * [cancelCartModal description]
   */
  cancelCartModal() {
    // Set the In prop for the add to cart modal.
    this.setState({ inProp: false})
  }

  /**
   * [updateViewerImage description]
   * @param  {[type]} viewerImage [description]
   * @return {[type]}             [description]
   */
  updateViewerImage(viewerImage) {
    // Set the viewer image.
    this.setState({ viewerImage })
  }

  /**
   * [addToCart description]
   */
  addToCart() {
    // Gather apriopriate varaibles.
    const { commerceProductVariations } = this.props
    const variationId = commerceProductVariations[this.state.currentVariation].attributes.drupalInternalVariationId
    const params = { variationId }
    // Add product to cart.
    drupalServices.setOperationAndDispatch('commerceAddToCart', params, this.productAddedToCart)
    // start the add to cart Loader
    this.setState({ productLoader: true })
  }

  // @TODO Add a srcSet to the image magnify so we can
  //       use a cauresel instead and pass this as a prop
  //       to the Image componenet.
  //
  srcSet() {
    const { commerceProductVariations} = this.props
    const { currentVariation } = this.state
    const productVariations = Object.keys(commerceProductVariations).includes(currentVariation)  ? commerceProductVariations : false
    return productVariations[currentVariation].relationships.fieldProductImages.data.map(image => {
      // @TODO name: 'wristwatch_355.jpg', vw: '355w'
      return `${image.id} ${image.vw}`;
    }).join(', ')
  }

  render () {
    // Load the variatians if they are not already set.
    const { commerceProductVariations, commerceProducts, commerceProductAttributeSize, error, pending } = this.props
    const { uuid, currentVariation, inProp, productAddedData, viewerImage, productLoader } = this.state
    const productVariations = Object.keys(commerceProductVariations).includes(currentVariation)  ? commerceProductVariations : false
    const variatians = uuid ? commerceProducts[uuid].relationships.variations.data : false
    const sizes = []

    if (uuid && variatians && productVariations && pending == false) {
      variatians.map(variatian => {
        // Gather the variation size ID.
        const sizeId = productVariations[variatian.id].relationships.attributeSize.data.id
        commerceProductAttributeSize[sizeId].attributes.name
        sizes.push({value: variatian.id, name: commerceProductAttributeSize[sizeId].attributes.name})
      })
    }

    return (
      <div className='product-view'>
        <div className='container'>
          <div className='product-view-back-button'>
            <Button
              onClick={this.goBack}
              label='Go Back'
              variant='outlined'
            />
          </div>
          {uuid && productVariations && pending == false &&
            <div className='row'>
              <div className='col-md-6'>
                {productVariations &&
                  <div className='product-viewer'>
                    <div className='product-viewer-image'>
                      <Image width={'100%'} height={600} className='product-image' uuid={viewerImage} imageMagnify={true} />
                    </div>
                    <ul className='product-viewer-thumbnail'>
                    {productVariations[currentVariation].relationships.fieldProductImages.data.map((image, index) => {
                      const className = ClassNames({'active': image.id == viewerImage})
                      return (
                        <li key={index}>
                          <div onClick={() => this.updateViewerImage(image.id)} className={className} >
                            <Image width={100} height={100} className='product-image-thumbnail' uuid={image.id} />
                          </div>
                        </li>
                      )
                    })}
                    </ul>
                  </div>
                }
              </div>
              <div className='col-md-6'>
                <div className='product-view-title'>
                  <h1>{commerceProducts[uuid].attributes.title}</h1>
                </div>
                <div className='product-view-price'>
                  <h3>{productVariations[currentVariation].attributes.price.formatted}</h3>
                </div>
                {productVariations[currentVariation].attributes.fieldProductSoldOut &&
                  <h5>Sold Out</h5>
                }
                <div className='product-view-size'>
                  <Radio
                    id={currentVariation}
                    label='Choose Your Size'
                    required={true}
                    options={sizes}
                    defaultValue={currentVariation}
                    setInputValue={this.updateCurrentProductVariation}
                  />
                </div>
                {productVariations[currentVariation].attributes.fieldProductSoldOut === false &&
                  <div className='add-to-cart-button'>
                    <AddToCartModal
                      variation={currentVariation}
                      onClick={this.addToCart}
                      onCancel={this.cancelCartModal}
                      inProp={inProp}
                      data={productAddedData}
                    />
                    {productLoader &&
                      <CircularProgress />
                    }
                  </div>
                }
                <div id="accordion" className="panel-group">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne"><i className="fas fa-info-circle"></i> <span>Details</span></a>
                      </h4>
                    </div>
                    <div id="collapseOne" className="panel-collapse collapse in">
                      <div className="panel-body">
                        <div>{ReactHtmlParser(commerceProducts[uuid].attributes.fieldProductShippingReturns.value)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo"><i className="fas fa-shipping-fast"></i> <span>Shipping & Returns</span></a>
                      </h4>
                    </div>
                    <div id="collapseTwo" className="panel-collapse collapse">
                      <div className="panel-body">
                        <div>{ReactHtmlParser(commerceProducts[uuid].attributes.fieldProductShippingReturns.value)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapseThree"><i className="fas fa-ruler-combined"></i> <span>Fit & Sizing</span></a>
                      </h4>
                    </div>
                    <div id="collapseThree" className="panel-collapse collapse">
                      <div className="panel-body">
                        <div>{ReactHtmlParser(commerceProducts[uuid].attributes.fieldProductFitSizing.value)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
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
  error: getCommerceStoreError(state),
  commerceStoreOnline: getCommerceStore(state),
  commerceProducts: getCommerceProducts(state),
  commerceProductVariations: getCommerceProductVariations(state),
  commerceProductAttributeSize: getCommerceProductAttributeValueSize(state),
  pending: getCommerceStorePending(state)
})

export default connect(mapStateToProps)(withRouter(ProductView));
