import React, {Component} from 'react'
import {Link} from "react-router-dom"
import { connect } from 'react-redux'
import {
  getVideoscreenError,
  getVideoscreen,
  getVideoscreenPending
} from './../../services/redux/reducers/VideoscreenReducer'
import { getMediaImage, getFile } from './../../services/redux/reducers/MediaReducer'
import * as drupalServices from './../../services/DrupalServices'
import Loader from './../../components/Loader'
import { Transition } from 'react-transition-group'
import { transitionDuration, defaultTransitionStyle, transitionStyles } from './../../components/Constants'


class VideoScreen extends Component {

  componentDidMount() {
    // Only update if the Videoscreen item isnt already
    // in the redux store. If its not then fetch the data.
    // @TODO Rather than look for length check for a specific
    //       item was loaded with drupalServices.checkData.
    //       Passing in the ID as a prop
    // if (Object.values(nodeVideoscreen).length == 0) {
      drupalServices.setOperationAndDispatch('nodeVideoscreen')
    // }
  }

  componentDidUpdate() {
    // In this component we want to load any data that needs to be loaded from the node if it wasnt loaded already.
    const { nodeVideoscreen, error, pending } = this.props
    // Gather the paragraph collection values from the store props.
    const videoscreen = Object.values(nodeVideoscreen).length ? Object.values(nodeVideoscreen)[0] : false
    // We only want to loop the collection if:
    // 1. There isnt a current error set
    // 2. The api isnt currenlty pending.
    if (videoscreen && error == null && pending == false) {
      // Get the type and id for the drupal media.
      const type = videoscreen.relationships.fieldExternalMedia.data.type
      const id = videoscreen.relationships.fieldExternalMedia.data.id

      // Only fetch the media if it isnt already in the store.
      if (drupalServices.checkData(type, id) == false) {
        const params = { operationId: id }
        drupalServices.setOperationAndDispatch(type, params)
      }
    }
  }

  render () {
    const { nodeVideoscreen, mediaImage, file } = this.props
    const videoscreen = Object.values(nodeVideoscreen).length ? Object.values(nodeVideoscreen)[0] : false
    const rawPicture = Object.values(mediaImage).length && videoscreen ? videoscreen.relationships.fieldExternalMedia.data : false
    // Gather the picture from the image collection.
    const bgImage = rawPicture && Object.keys(mediaImage).includes(rawPicture.id) ?
                      file[mediaImage[rawPicture.id].relationships.fieldMediaImage.data.id] :
                      false
    const link = {
      url : videoscreen ? videoscreen.attributes.fieldVideoEnterLink.uri.split(':')[1] : '/',
      title: videoscreen ? videoscreen.attributes.fieldVideoEnterLink.title : ''
    }
    return (
      <div className='videoInterface'>
        <Transition in={bgImage !== false} timeout={transitionDuration}>
          {state => (
            <div style={{
              ...defaultTransitionStyle,
              ...transitionStyles[state]
            }}>
              <div className='logoEnter'>
                <img className='logoImage' src={drupalSettings.logo.url.src} />
                <div className='enterText animated infinite pulse'><Link to={link.url}>{link.title}</Link></div>
              </div>
              {bgImage &&
                <div className="background-image"  style={{backgroundImage: `url(${bgImage.attributes.uri.url})`}} />
              }
            </div>
          )}
        </Transition>
        <Loader label='Loading...' full={true} inProp={bgImage == false}   />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  error: getVideoscreenError(state),
  nodeVideoscreen: getVideoscreen(state),
  mediaImage: getMediaImage(state),
  file: getFile(state),
  pending: getVideoscreenPending(state)
})

export default connect(mapStateToProps)(VideoScreen)
