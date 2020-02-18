import axios from 'axios'
import normalize from 'json-api-normalizer';

export const mediaCollectionPending = () => {
  return {
    type: 'MEDIA_COLLECTION_PENDING'
  }
}

export const mediaCollectionSuccess = (data, operationType) => {
  return {
    type: 'MEDIA_COLLECTION_SUCCESS',
    payload: data,
    operationType
  }
}

export const mediaCollectionError = (error) => {
  return {
    type: 'MEDIA_COLLECTION_ERROR',
    error: error,
  }
}

export const videoscreenPending = () => {
  return {
    type: 'VIDEOSCREEN_PENDING'
  }
}

export const videoscreenSuccess = (data, operationType) => {
  return {
    type: 'VIDEOSCREEN_SUCCESS',
    payload: data,
    operationType
  }
}

export const videoscreenError = (error) => {
  return {
    type: 'VIDEOSCREEN_ERROR',
    error: error,
  }
}

export const commerceStorePending = (isPending) => {
  return {
    type: 'COMMERCE_STORE_PENDING',
    isPending
  }
}

export const commerceStoreSuccess = (data, operationType) => {
  return {
    type: 'COMMERCE_STORE_SUCCESS',
    payload: data,
    operationType
  }
}

export const commerceStoreError = (error) => {
  return {
    type: 'COMMERCE_STORE_ERROR',
    error: error,
  }
}

export const commerceCartPending = (isPending) => {
  return {
    type: 'COMMERCE_CART_PENDING',
    isPending
  }
}

export const commerceCartSuccess = (data, operationType) => {
  return {
    type: 'COMMERCE_CART_SUCCESS',
    payload: data,
    operationType
  }
}

export const commerceCartError = (error) => {
  return {
    type: 'COMMERCE_CART_ERROR',
    error: error,
  }
}

export const commerceOrderPending = (isPending) => {
  return {
    type: 'COMMERCE_ORDER_PENDING',
    isPending
  }
}

export const commerceOrderSuccess = (data, operationType) => {
  return {
    type: 'COMMERCE_ORDER_SUCCESS',
    payload: data,
    operationType
  }
}

export const commerceOrderError = (error) => {
  return {
    type: 'COMMERCE_ORDER_ERROR',
    error: error,
  }
}

export const commerceOrderStatusPending = (isPending) => {
  return {
    type: 'COMMERCE_ORDER_STATUS_PENDING',
    isPending
  }
}

export const commerceOrderStatusSuccess = (data, operationType) => {
  return {
    type: 'COMMERCE_ORDER_STATUS_SUCCESS',
    payload: data,
    operationType
  }
}

export const commerceOrderStatusError = (error) => {
  return {
    type: 'COMMERCE_ORDER_STATUS_ERROR',
    error: error,
  }
}

export const aboutUsPending = () => {
  return {
    type: 'ABOUT_US_PENDING'
  }
}

export const aboutUsSuccess = (data, operationType) => {
  return {
    type: 'ABOUT_US_SUCCESS',
    payload: data,
    operationType
  }
}

export const aboutUsError = (error) => {
  return {
    type: 'ABOUT_US_ERROR',
    error: error,
  }
}

export const mediaPending = (isPending) => {
  return {
    type: 'MEDIA_PENDING',
    isPending
  }
}

export const mediaSuccess = (data, operationType) => {
  return {
    type: 'MEDIA_SUCCESS',
    payload: data,
    operationType
  }
}

export const mediaError = (error) => {
  return {
    type: 'MEDIA_ERROR',
    error: error,
  }
}

export const fetchMediaCollection = (operation) => {
  return (dispatch, getState) => {
    dispatch(mediaCollectionPending())
    axios[operation.method](operation.url, operation.params)
      .then(response => {
        dispatch(mediaCollectionSuccess(normalize(response.data), operation.type))
        // throw new Error('NOT!');
      })
      .catch(error => {
        dispatch(mediaCollectionError(error))
      })
  }
}

export const fetchVideoscreen = (operation) => {
  return (dispatch, getState) => {
    dispatch(videoscreenPending())
    axios[operation.method](operation.url, operation.params)
      .then(response => {
        dispatch(videoscreenSuccess(normalize(response.data), operation.type))
        // throw new Error('NOT!');
      })
      .catch(error => {
        dispatch(videoscreenError(error))
      })
  }
}

export const fetchAboutUs = (operation) => {
  return (dispatch, getState) => {
    dispatch(aboutUsPending())
    axios[operation.method](operation.url, operation.params)
      .then(response => {
        dispatch(aboutUsSuccess(normalize(response.data), operation.type))
        // throw new Error('NOT!');
      })
      .catch(error => {
        dispatch(aboutUsError(error))
      })
  }
}

export const customApiCallbck = (operation) => {
  return (dispatch, getState) => {
    axios[operation.method](operation.url, operation.params)
      .then(response => {
        // If the operation callback is set then we want to
        // call the fucntion instead of updating the state.
        if (typeof operation.callback === "function") {
          operation.callback({response: response.data})
        }
      })
      .catch(error => {
        // If the operation callback is set then we want to
        // call the fucntion instead of updating the state.
        if (typeof operation.callback === "function") {
          operation.callback({error: error.response})
        }
      })
  }
}

export const fetchCommerceCart = (operation) => {
  return (dispatch, getState) => {
    dispatch(commerceCartPending(true))
    axios[operation.method](operation.url, operation.params)
      .then(response => {
        dispatch(commerceCartSuccess(response.data[0], operation.type))
        dispatch(commerceCartPending(false))
      })
      .catch(error => {
        dispatch(commerceCartError(error))
        dispatch(commerceCartPending(false))
      })
  }
}

export const fetchCommerceOrder = (operation) => {
  return (dispatch, getState) => {
    dispatch(commerceOrderPending(true))
    axios[operation.method](operation.url, operation.params)
      .then(response => {
        dispatch(commerceOrderSuccess(normalize(response.data), operation.type))
        dispatch(commerceOrderPending(false))
      })
      .catch(error => {
        dispatch(commerceOrderError(error))
        dispatch(commerceOrderPending(false))
      })
  }
}

export const updateCommerceOrderStatus = (operation) => {
  return (dispatch, getState) => {
    dispatch(commerceOrderStatusPending(true))
    axios[operation.method](operation.url, operation.params)
      .then(response => {
        console.log(response)
        dispatch(commerceOrderStatusSuccess(normalize(response.data), operation.type))
        dispatch(commerceOrderStatusPending(false))
        // throw new Error('NOT!');
      })
      .catch(error => {
        dispatch(commerceOrderStatusError(error))
      })
  }
}

export const fetchCommerceStore = (operation) => {
  return (dispatch, getState) => {
    dispatch(commerceStorePending(true))
    axios[operation.method](operation.url, operation.params)
      .then(response => {
        dispatch(commerceStoreSuccess(normalize(response.data), operation.type))
        dispatch(commerceStorePending(false))
        // throw new Error('NOT!');
      })
      .catch(error => {
        dispatch(commerceStoreError(error))
      })
  }
}

export const fetchCommerceStorePromises = (operations, type) => {
  return (dispatch, getState) => {
    dispatch(commerceStorePending(true))
    let promises = []
    let type = []
    operations.forEach(operation => {
      promises.push(axios[operation.method](operation.url, operation.params))
      type = operation.type
    })
    axios.all(promises)
      .then(response => {
        response.forEach(data => {
          dispatch(commerceStoreSuccess(normalize(data.data), type))
        })
        dispatch(commerceStorePending(false))
      })
      .catch(error => {
        dispatch(commerceStoreError(error))
      })
  }
}

export const fetchMedia = (operation) => {
  return (dispatch, getState) => {
    dispatch(mediaPending(true))
    axios[operation.method](operation.url, operation.params)
      .then(response => {
        dispatch(mediaSuccess(normalize(response.data), operation.type))
        dispatch(mediaPending(false))
        // throw new Error('NOT!');
      })
      .catch(error => {
        dispatch(mediaError(error))
      })
  }
}

export const fetchMediaPromises = (operations) => {
  return (dispatch, getState) => {
    dispatch(mediaPending(true))
    let promises = []
    let type = []
    operations.forEach(operation => {
      promises.push(axios[operation.method](operation.url, operation.params))
      type = operation.type
    })
    axios.all(promises)
      .then(response => {
        response.forEach(data => {
          dispatch(mediaSuccess(normalize(data.data), type))
        })
        dispatch(mediaPending(false))
      })
      .catch(error => {
        dispatch(mediaError(error))
      })
  }
}
