import React, {Component} from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import * as drupalServices from './../../services/DrupalServices'
import { getMediaRemoteVideo, getMediaPending } from './../../services/redux/reducers/MediaReducer';

const propTypes = {
  uuid: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  className: PropTypes.string
}

class Iframes extends Component {
  constructor(props){
    super(props);
    // Bind (this) to the functions.
    this.loadIframe = this.loadIframe.bind(this);
  }

  componentDidMount() {
    this.loadIframe()
  }

  componentDidUpate() {
    const { pending } = this.props
    if (pending == false) {
      this.loadIframe()
    }
  }

  loadIframe() {
    const { uuid } = this.props
    if (uuid && drupalServices.checkData('mediaRemoteVideo', uuid) == false) {
      const params = { operationId: uuid }
      // Load the image from drupal.
      drupalServices.setOperationAndDispatch('mediaRemoteVideo', params)
    }
  }

  render() {
    const { uuid, width, height, className, mediaRemoteVideo } = this.props
    // Gather the picture from the image collection.
    const videoID = Object.values(mediaRemoteVideo).length && uuid ?
                      mediaRemoteVideo[uuid].attributes.fieldMediaOembedVideo.split('v=')[1] :
                      false
    return (
      <div>
        {videoID &&
          <div className='container'>
            <iframe className={className} height={height}  width={width} src={`https://www.youtube.com/embed/${videoID}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
          </div>
        }
        {videoID == false &&
          <img className={className} width={width} height={height} src="/themes/custom/granderaent/img/hd-spinner.gif" />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  mediaRemoteVideo: getMediaRemoteVideo(state),
  pending: getMediaPending(state)
})

Iframes.propTypes = propTypes

export default connect(mapStateToProps)(Iframes);
