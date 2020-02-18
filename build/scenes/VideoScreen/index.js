import React, {Component} from 'react'
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import {
  getVideoscreenError,
  getVideoscreen,
  getVideoscreenPending
} from './../../services/redux/reducers/VideoscreenReducer';
import { getMediaVideo, getFile } from './../../services/redux/reducers/MediaReducer';
import * as drupalServices from './../../services/DrupalServices'
import Loader from './../../components/Loader';
import { Transition } from 'react-transition-group';
import { transitionDuration, defaultTransitionStyle, transitionStyles } from './../../components/Constants';


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
    const { nodeVideoscreen, mediaVideo, file, pending } = this.props
    const videoscreen = Object.values(nodeVideoscreen).length ? Object.values(nodeVideoscreen)[0] : false
    const videoFileId = Object.values(mediaVideo).length && videoscreen ?
                      mediaVideo[videoscreen.relationships.fieldExternalMedia.data.id].relationships.fieldMediaVideoFile.data.id :
                      false
    const videoUrl = Object.values(file).length && videoFileId ?
                      file[videoFileId].attributes.uri.url : false
    console.log(videoUrl);
    console.log(file);
    console.log(videoFileId);
    const link = {
      url : videoscreen ? videoscreen.attributes.fieldVideoEnterLink.uri.split(':')[1] : '/',
      title: videoscreen ? videoscreen.attributes.fieldVideoEnterLink.title : ''
    }
    return (
      <div className='videoInterface'>
        <Transition in={videoUrl !== false} timeout={transitionDuration}>
          {state => (
            <div style={{
              ...defaultTransitionStyle,
              ...transitionStyles[state]
            }}>
              <div className='row no-gutters'>
                <div className='col-md-4 col-md-push-4 col-xs-8 col-xs-push-2 logoEnter'>
                  <img className='logoImage' src={drupalSettings.logo.url.src} />
                  <div className='enterText animated infinite pulse'><Link to={link.url}>{link.title}</Link></div>
                </div>
              </div>
              <div className="video-background">
                <div className="video-foreground">
                  {videoUrl &&
                    <video id="background-video" loop autoPlay muted>
                      <source src={videoUrl} type="video/mp4" />
                      <source src={videoUrl} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  }
                </div>
              </div>
            </div>
          )}
        </Transition>
        <Loader label='Loading...' full={true} inProp={videoUrl == false}   />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  error: getVideoscreenError(state),
  nodeVideoscreen: getVideoscreen(state),
  mediaVideo: getMediaVideo(state),
  file: getFile(state),
  pending: getVideoscreenPending(state)
})

export default connect(mapStateToProps)(VideoScreen)
