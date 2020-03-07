import React, {Component} from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import * as drupalServices from './../../services/DrupalServices'
import { getMediaImage, getFile, getMediaPending } from './../../services/redux/reducers/MediaReducer';
import ReactImageMagnify from 'react-image-magnify';
import { withController } from 'react-scroll-parallax';

const propTypes = {
  uuid: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired
  ]),
  media: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  className: PropTypes.string,
  imageMagnify: PropTypes.bool,
  parallax: PropTypes.bool
}

class Images extends Component {
  constructor(props){
    super(props);
    // Bind (this) to the functions.
    this.loadImage = this.loadImage.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }

  componentDidMount() {
    this.loadImage()
  }

  componentDidUpate() {
    const { pending } = this.props
    if (pending == false) {
      this.loadImage()
    }
  }

  handleLoad() {
    if (this.props.parallax == true) {
      // updates cached values after image dimensions have loaded
      this.props.parallaxController.update();
    }
  }

  loadImage() {
    const { uuid, media } = this.props
    // Set the params to be passed into the drupal api.
    const params = uuid && drupalServices.checkData('mediaImage', uuid) == false ? { operationId: uuid }
                  : uuid == false && media != undefined && drupalServices.getUuidFromInternalId(media, 'image') == false ? {mediaId: media}
                  : {}
    if (Object.keys(params).length) {
      // Load the image from drupal.
      drupalServices.setOperationAndDispatch('mediaImage', params)
    }
  }

  render() {
    // @TODO add a srcSet to the image magnify so we can use a cauresel instead.
    const { width, height, className, imageMagnify, mediaImage, file, media } = this.props
    const images = Object.values(mediaImage).length ? Object.values(mediaImage) : false
    // Only fetch the media if it isnt already in the store.
    const uuid = this.props.uuid == false && media != undefined ? drupalServices.getUuidFromInternalId(media, 'image') : this.props.uuid
    // Gather the picture from the image collection.
    const picture = images && Object.keys(mediaImage).includes(uuid) ?
                      file[mediaImage[uuid].relationships.fieldMediaImage.data.id] :
                      false
    return (
      <div>
        {picture &&
          <div>
            {imageMagnify == true ? (
              <ReactImageMagnify {...{
                smallImage: {
                  alt: `Image for ${picture.attributes.filename}`,
                  isFluidWidth: true,
                  src: picture.attributes.uri.url,
                  sizes: '(min-width: 800px) 33.5vw, (min-width: 415px) 50vw, 100vw',
                },
                largeImage: {
                  src: picture.attributes.uri.url,
                  width: 1200,
                  height: 1800
                },
                imageClassName: className,
                isEnlargedImagePortalEnabledForTouch: true,
                shouldHideHintAfterFirstActivation: false,
                enlargedImagePosition: 'over',
                isHintEnabled: true,
                enlargedImageContainerDimensions: {width: '100%', height: '100%'}
              }} />
            ) : (
              <img className={className} width={width} height={height} src={picture.attributes.uri.url} onLoad={this.handleLoad} />
            )}
          </div>
        }
        {picture == false &&
          <img className={className} width={width} height={height} src="/themes/custom/granderaent/img/loading-spinner.gif" />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  mediaImage: getMediaImage(state),
  file: getFile(state),
  pending: getMediaPending(state)
})

Images.propTypes = propTypes

export default connect(mapStateToProps)(withController(Images));
