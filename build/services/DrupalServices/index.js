import { store } from './../../index';
import {
  fetchMediaCollection,
  fetchVideoscreen,
  fetchAboutUs,
  fetchCommerceStore,
  fetchMedia,
  fetchMediaPromises,
  fetchCommerceStorePromises,
  fetchCommerceCart,
  fetchCommerceOrder,
  customApiCallbck,
  updateCommerceOrderStatus } from './../redux/actions';

// The base drupal API.
const initialState = {
  jsonApiBaseUrl: '/api'
}

/**
 * Determine which store to save the drupal
 * data to and dispath the data.
 * @param {string} type
 *   The type of the operation.
 * @param {type} params
 *   A list of params used the the API operation
 */
export const setOperationAndDispatch = (type, params, callback) => dispatch(gatherOperation(type, params, callback))

/**
 * Dispatch the drupal react API using the Store.
 * @param {array} promises
 *   An array of promises to be passed to Axios actions.
 */
export const dispatchPromises = promises => {
  let operations = []
  promises.forEach(promise => {
    // Currently I have to save the operation type
    // so the correct reducer can be used.
    // @TODO Maybe pull this in rather than just getting the
    //       last iteration value. Ok for now bc we on can get
    //       one type at a time.
    const params = Object.keys(promise).includes('params') ? promise.params : { operationId: promise.id }
    const operation = gatherOperation(promise.type, params)
    operations.push(operation)
  })
  // We want to dispatch the operations.
  if (operations.length) {
    dispatch(operations, true)
  }
}

/**
 * Check to see if the drupal data is saved in the redux store
 * returns the uuid collection or false if not found.
 * @param  {object} drupalCollection [description]
 * @param  {int} uuid             [description]
 * @return {object || bool}        [description]
 */
export const checkData = (drupalCollection, uuid) => {
  // Gather the redux stores state.
  const drupalStore = store.getState()
  // Gather all the object keys and loop through them
  // and gather all of the reducer keys.
  const drupalStoreKeys = Object.keys(drupalStore)
  // Loop through all of the drupal uuid in the store.
  for (const reducer of drupalStoreKeys) {
    const drupalCollections = drupalStore[reducer]
    const drupalCollectionKeys = Object.keys(drupalCollections)
    // Make sure the collection is set in the store.
    if (drupalCollectionKeys.includes(drupalCollection)) {
      for (const drupalCollectionKey of drupalCollectionKeys) {
        if (drupalCollectionKey === drupalCollection) {
          // Get the collection and determine if the drupal uuid is saved with the
          // redux store. if so then return the collection false other wise.
          const collection = drupalCollections[drupalCollectionKey]
          return Object.keys(collection).includes(uuid) ? collection[uuid] : false
        }
      }
    }
  }
  // If all fails
  return false
}

/**
 * [containsObject description]
 * @param  {obj} params  [description]
 * @param  {array} promises [description]
 * @return {bool}     [description]
 */
export const containsObject = (params, promises) => {
  // If the promises are empty return false
  if (promises.length == 0) {
    return false
  }
  // Iterate through promises.
  for (const promise of promises) {
    const paramKeys = Object.keys(params)
    // We want to loop through all the keys
    // to make sure they are all in the promise.
    for (const paramKey of paramKeys) {
      // If the key is in the promises set flag to false
      // Check to see if the params are set otherwise just check the promise itself.
      if ((typeof(promise.params) === 'object' && promise.params[paramKey] == params[paramKey])
          || (Object.keys(promise).includes(paramKey) && promise[paramKey] == params[paramKey])) {
        return true
      }
    }
  }
  return false;
}

/**
 * Check the redux store to see if the drupal content
 * with the internal ID is loaded. If it is return the
 * product UUID and false otherwise.
 *
 * @param  {string} id [description]
 * @param  {string} type [description]
 * @return {object} operation   [description]
 */
export const getUuidFromInternalId = (id, type) => {
  // Gather the redux stores state.
  const drupalStore = store.getState()
  // get the list of reducers.
  let drupalContent
  let internalType
  switch (type) {
    case 'product':
      drupalContent = drupalStore.commerceReducer.commerceProductDefault
      internalType = 'drupalInternalProductId'
      break;
    case 'order':
      drupalContent = drupalStore.commerceReducer.commerceOrderDefault
      internalType = 'drupalInternalOrderId'
      break;
    case 'image':
      drupalContent = drupalStore.mediaReducer.mediaImage
      internalType = 'drupalInternalMid'
      break;
    default:
      drupalContent = false
  }
  if (drupalContent) {
    // obtain the product uuids.
    const drupalContentUuids = Object.keys(drupalContent)
    // return the product uuid if it is set.
    for (const drupalContentUuid of drupalContentUuids) {
      if (drupalContent[drupalContentUuid].attributes[internalType] == id) {
        return drupalContentUuid
      }
    }
  }
  // The product isnt
  // in the store.
  return false
}

/**
 * Gather the api operation based on the type of the call.
 * @param {string} type
 *   The operation type to determine which endpoint
 *   to call.
 * @param {array} params
 *   An array of params to be used in the API call.
 *   Either for as data or url parameters.
 * @param {fucntion} callback
 *   A callback fucntion that would be called instead
 *   of saving to the state.
 * @return {object}
 *   The api endpoint oblect to be passed to the axios
 *   api call.
 */
const gatherOperation = (type, params, callback) => {
  let operation
  switch (type) {
    case 'nodeMediaCollection':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/node/media_collection`,
        reducer: 'mediaCollection',
        method: 'get',
        params: {params: {'filter[title]': 'Music', 'include': 'field_media_collection'}},
        type: [ type, 'paragraphMediaCollection' ]
      }
      break
    case 'paragraphMediaCollection':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/paragraph/media_collection/${params.operationId}`,
        reducer: 'mediaCollection',
        method: 'get',
        params: {},
        type: [ type ]
      }
      break
    case 'mediaRemoteVideo':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/media/remote_video/${params.operationId}`,
        reducer: 'media',
        method: 'get',
        params: {},
        type: [ type ]
      }
      break
    case 'nodeVideoscreen':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/node/videoscreen`,
        reducer: 'videoscreen',
        method: 'get',
        params: {params: {'filter[title]': 'Home'}},
        type: [ type ]
      }
      break
    case 'commerceStoreOnline':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/commerce_store/online`,
        reducer: 'commerceStore',
        method: 'get',
        params: {},
        type: [ type ]
      }
      break
    case 'commerceProductDefault':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/commerce_product/default`,
        reducer: 'commerceStore',
        method: 'get',
        params: params == null ? {} : {params: {'filter[drupal_internal__product_id]': params.operationId}},
        type: [ type ]
      }
      break
    case 'commerceProductVariationDefault':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/commerce_product_variation/default/${params.operationId}`,
        reducer: 'commerceStore',
        method: 'get',
        params: {params: {'include': 'attribute_size'}},
        type: [ type, 'commerceProductAttributeValueSize' ]
      }
      break
    case 'commerceAddToCart':
      operation = {
        url: '/cart/add?_format=json',
        reducer: 'callback',
        method: 'post',
        params: [{'purchased_entity_type': 'commerce_product_variation', 'purchased_entity_id': params.variationId, 'quantity': '1'}],
        type: [],
        callback: callback
      }
      break
    case 'commerceCart':
      operation = {
        url: '/cart?_format=json',
        reducer: 'loadCart',
        method: 'get',
        params: {},
        type: [ type ]
      }
      break
    case 'commerceUpdateCartItem':
      operation = {
        url: `/cart/${params.orderId}/items?_format=json`,
        reducer: 'callback',
        method: 'patch',
        params: {[params.orderItemId]: {'quantity': params.quantity}},
        type: [],
        callback: callback
      }
      break
    case 'commerceDeleteCartItem':
      operation = {
        url: `/cart/${params.orderId}/items/${params.orderItemId}?_format=json`,
        reducer: 'callback',
        method: 'delete',
        params: {},
        type: [],
        callback: callback
      }
      break
    case 'commerceDeleteCart':
      operation = {
        url: `/cart/${params.orderId}/items?_format=json`,
        reducer: 'callback',
        method: 'delete',
        params: {},
        type: [],
        callback: callback
      }
      break
    case 'commerceOrderSummary':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/checkout/${params.operationId}/get_order_summary`,
        reducer: 'callback',
        method: 'get',
        params: {},
        type: [],
        callback: callback
      }
      break
    case 'commerceOrderDefault':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/commerce_order/default`,
        reducer: 'loadOrder',
        method: 'get',
        params: {params: {'filter[drupal_internal__order_id]': params.operationId}},
        type: [ type ]
      }
      break
    case 'commercePaypalButtons':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/checkout/${params.operationId}/paypal_smart_buttons`,
        reducer: 'callback',
        method: 'get',
        params: {},
        type: [ 'commerceCart' ],
        callback: callback
      }
      break
    case 'commerceShippingMethods':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/checkout/${params.operationId}/get_shipping_method`,
        reducer: 'callback',
        method: 'get',
        params: {},
        type: [ 'commerceCart' ],
        callback: callback
      }
      break
    case 'commerceShippingProfiles':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/checkout/${params.operationId}/get_shipping_profile`,
        reducer: 'callback',
        method: 'get',
        params: params.checkoutStep !== null ? {params: {'step_id': params.checkoutStep}} : {},
        type: [ 'commerceCart' ],
        callback: callback
      }
      break
    case 'postShippingAccountInfo':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/checkout/${params.order_id}/set_shipping_account_info`,
        reducer: 'callback',
        method: 'post',
        params: params,
        type: [],
        callback: callback
      }
      break
    case 'completeCommerceOrder':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/checkout/${params.orderId}/complete_order`,
        reducer: 'callback',
        method: 'post',
        params: params,
        type: [],
        callback: callback
      }
      break
    case 'generateHashToken':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/checkout/${params.orderId}/generate_hash_token`,
        reducer: 'callback',
        method: 'get',
        params: {},
        type: [],
        callback: callback
      }
      break
    case 'commerceOrderDetails':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/checkout/${params.orderId}/view_order`,
        reducer: 'callback',
        method: 'get',
        params: {params: {'token': params.token, 'email': params.email}},
        type: [],
        callback: callback
      }
      break
    case 'nodeAboutUs':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/node/about_us`,
        reducer: 'aboutUs',
        method: 'get',
        params: {params: {'filter[title]': 'About', 'include': 'field_artists'}},
        type: [ type, 'paragraphArtists' ]
      }
      break
    case 'paragraphArtists':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/paragraph/artists/${params.operationId}`,
        reducer: 'aboutUs',
        method: 'get',
        params: {},
        type: [ type ]
      }
      break
    case 'mediaImage':
      const parameters = Object.keys(params).includes('mediaId') ? {'filter[drupal_internal__mid]': params.mediaId, 'include': 'field_media_image'} : {'include': 'field_media_image'}
      const operationId = Object.keys(params).includes('operationId') ? params.operationId : ''
      operation = {
        url: `${initialState.jsonApiBaseUrl}/media/image/${operationId}`,
        reducer: 'media',
        method: 'get',
        params: {params: parameters},
        type: [ type, 'fileFile' ]
      }
      break
    case 'mediaVideo':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/media/video/${params.operationId}`,
        reducer: 'media',
        method: 'get',
        params: {params: {'include': 'field_media_video_file'}},
        type: [ type, 'fileFile' ]
      }
      break
    case 'subscriptionForm':
      operation = {
        url: `${initialState.jsonApiBaseUrl}/services/subscribe_form`,
        reducer: 'callback',
        method: 'post',
        params: params,
        type: [],
        callback: callback
      }
      break
    default:
      operation = false
  }
  return operation
}

/**
 * We want to dispatch to the react store in order to call
 * the Drupal JSON API.
 *
 * @param  {array || Object} operation [description]
 * @param  {bool} usePromises [description]
 */
const dispatch = (operation, usePromises) => {
  // Get the reducer for the api call.
  // We only ned the first reducer if it is an array of operations
  const reducer = Array.isArray(operation) ? operation[0].reducer : operation.reducer
  switch (reducer) {
    case 'mediaCollection':
      store.dispatch(fetchMediaCollection(operation))
      break;
    case 'videoscreen':
      store.dispatch(fetchVideoscreen(operation))
      break;
    case 'aboutUs':
      store.dispatch(fetchAboutUs(operation))
      break;
    case 'commerceStore':
      if (usePromises == true) {
        store.dispatch(fetchCommerceStorePromises(operation))
      } else {
        store.dispatch(fetchCommerceStore(operation))
      }
      break;
    case 'loadCart':
      store.dispatch(fetchCommerceCart(operation))
      break;
    case 'loadOrder':
      store.dispatch(fetchCommerceOrder(operation))
      break;
    case 'callback':
      store.dispatch(customApiCallbck(operation))
      break;
    case 'updateOrderStatus':
      store.dispatch(updateCommerceOrderStatus(operation))
      break;
    case 'media':
      if (usePromises == true) {
        store.dispatch(fetchMediaPromises(operation))
      } else {
        store.dispatch(fetchMedia(operation))
      }
      break;
    default:
      console.log('No reducer selected.')
  }
}
