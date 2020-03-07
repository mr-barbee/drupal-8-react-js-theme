import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import { Parallax } from 'react-scroll-parallax'
import {
  getCommerceProducts,
  getCommerceStoreError,
  getCommerceStorePending
} from './../../../../services/redux/reducers/CommerceStoreReducer'
import * as drupalServices from './../../../../services/DrupalServices'
import Loader from './../../../../components/Loader'
import Image from './../../../../components/Images'

/**
 * [ProductList description]
 * @extends Component
 */
class ProductList extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    const { error, pending } = this.props
    // Get the all of the products from the store.
    if (error == null && pending == false) {
      drupalServices.setOperationAndDispatch('commerceProductDefault')
    }
  }

  render () {
    const { commerceProducts, error, pending } = this.props
    const products = Object.values(commerceProducts).length ? Object.values(commerceProducts) : false

    return (
      <div className='product-list'>
        {products && pending == false &&
          <div className='container'>
            <div className='row'>
              {products.map((product, index) => {
                const productUrl = `/store/product/${product.attributes.drupalInternalProductId}`
                return (
                  <div key={index} className='product col-md-4'>
                    <div className='product-image'>
                      <Link to={productUrl}>
                        {
                        <Parallax className="parallax-window" y={[-20, 20]} tagOuter="figure">
                          <Image width={320} height={360} uuid={product.relationships.fieldProductDefaultImage.data.id} parallax={true} />
                        </Parallax>
                        }
                      </Link>
                    </div>
                    <div className='product-title'>
                      <h3><Link to={productUrl}>{product.attributes.title}</Link></h3>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        }
        <Loader label='Loading...' inProp={products == false || pending} />
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
  commerceProducts: getCommerceProducts(state),
  pending: getCommerceStorePending(state),
})

export default connect(mapStateToProps)(ProductList);
