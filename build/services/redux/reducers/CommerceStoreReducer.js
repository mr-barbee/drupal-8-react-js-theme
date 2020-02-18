import {
  COMMERCE_STORE_PENDING,
  COMMERCE_STORE_SUCCESS,
  COMMERCE_STORE_ERROR,
  COMMERCE_ORDER_PENDING,
  COMMERCE_ORDER_SUCCESS,
  COMMERCE_ORDER_ERROR,
  COMMERCE_ORDER_STATUS_PENDING,
  COMMERCE_ORDER_STATUS_SUCCESS,
  COMMERCE_ORDER_STATUS_ERROR,
  COMMERCE_CART_PENDING,
  COMMERCE_CART_SUCCESS,
  COMMERCE_CART_ERROR
} from './../actions';

const initialState = {
  pending: false,
  orderStatusPending: false,
  cartPending: false,
  oderStatus: null,
  commerceStoreOnline: {},
  commerceProductDefault: {},
  commerceProductVariationDefault: {},
  commerceProductAttributeValueSize: {},
  commerceCart: {},
  commerceOrderDefault: {},
  commerceOrderPending: false,
  commerceOrderError: null,
  error: null,
  orderStatusError: null,
  cartError: null
}

export default (state = initialState, action) => {
  let $return = {
    ...state
  }
  switch(action.type) {
    case 'COMMERCE_STORE_PENDING':
      return {
        ...state,
        pending: action.isPending
      }
    case 'COMMERCE_STORE_SUCCESS':
      action.operationType.forEach(type => {
        $return[type] = {
          ...state[type],
          ...action.payload[type]
        }
      })
      return $return;
    case 'COMMERCE_STORE_ERROR':
      return {
        ...state,
        pending: false,
        error: action.error
      }
    case 'COMMERCE_CART_PENDING':
      return {
        ...state,
        cartPending: action.isPending
      }
    case 'COMMERCE_CART_SUCCESS':
      action.operationType.forEach(type => {
        $return[type] = action.payload
      })
      return $return;
    case 'COMMERCE_CART_ERROR':
      return {
        ...state,
        cartPending: false,
        cartError: action.error
      }
    case 'COMMERCE_ORDER_STATUS_PENDING':
      return {
        ...state,
        orderStatusPending: action.isPending
      }
    case 'COMMERCE_ORDER_STATUS_SUCCESS':
      action.operationType.forEach(type => {
        $return[type] = {
          ...state[type],
          ...action.payload[type]
        }
      })
      return $return;
    case 'COMMERCE_ORDER_STATUS_ERROR':
      return {
        ...state,
        orderStatusPending: false,
        orderStatusError: action.error
      }
    case 'COMMERCE_ORDER_PENDING':
      return {
        ...state,
        commerceOrderPending: action.isPending
      }
    case 'COMMERCE_ORDER_SUCCESS':
      action.operationType.forEach(type => {
        $return[type] = {
          ...state[type],
          ...action.payload[type]
        }
      })
      return $return;
    case 'COMMERCE_ORDER_ERROR':
      return {
        ...state,
        commerceOrderPending: false,
        commerceOrderError: action.error
      }
    default:
      return state;
  }
}

export const getCommerceStore = state => state.commerceReducer.commerceStoreOnline
export const getCommerceProducts = state => state.commerceReducer.commerceProductDefault
export const getCommerceProductVariations = state => state.commerceReducer.commerceProductVariationDefault
export const getCommerceProductAttributeValueSize = state => state.commerceReducer.commerceProductAttributeValueSize
export const getCommerceStorePending = state => state.commerceReducer.pending
export const getCommerceStoreError = state => state.commerceReducer.error
export const getCommerceOderStatus = state => state.commerceReducer.oderStatus
export const getCommerceOrderStatusPending = state => state.commerceReducer.orderStatusPending
export const getCommerceOrderStatusError = state => state.commerceReducer.orderStatusError
export const getCommerceCart = state => state.commerceReducer.commerceCart
export const getCommerceCartPending = state => state.commerceReducer.cartPending
export const getCommerceCartError = state => state.commerceReducer.cartError
export const getCommerceOrder = state => state.commerceReducer.commerceOrderDefault
export const getCommerceOrderPending = state => state.commerceReducer.commerceOrderPending
export const getCommerceOrderError = state => state.commerceReducer.commerceOrderError
