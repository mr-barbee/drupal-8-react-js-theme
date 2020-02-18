import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  getMediaCollectionError,
  getMediaCollection,
  getMediaCollectionPending,
  getParagraphMediaCollection
} from './../../services/redux/reducers/MediaCollectionReducer';
import * as drupalServices from './../../services/DrupalServices'
import Loader from './../../components/Loader'
import Iframe from './../../components/Iframes'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class Music extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    // Only update if the medial collection item isnt already
    // in the redux store. If its not then fetch the data.
    // @TODO Rather than look for length check for a specific
    //       item was loaded with drupalServices.checkData.
    //       Passing in the ID as a prop
    drupalServices.setOperationAndDispatch('nodeMediaCollection')
  }

  render () {
    const { nodeMediaCollection, paragraphMediaCollection, error, pending } = this.props
    const musicPage = Object.values(nodeMediaCollection).length ? Object.values(nodeMediaCollection)[0] : false
    const paragraphCollections = Object.values(paragraphMediaCollection).length ? Object.values(paragraphMediaCollection) : false

    return (
      <div className='music-page'>
        {musicPage && pending == false &&
          <div className='music-page-header'>{ReactHtmlParser(musicPage.attributes.body.value)}</div>
        }
        {paragraphCollections && pending == false &&
          <div>
            {paragraphCollections.map((value, index) => {
              return (
                <div key={index}>
                  {value.attributes.fieldMediaType == 'apple' &&
                    <div className='apple-container'>
                      <div className='apple-inner-container'>
                        <div className='container'>
                          <iframe className="streams-items-iframe" height="380" width="100%" allow="autoplay *; encrypted-media *;" frameBorder="0" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src={value.attributes.fieldAppleMusicPlaylist}></iframe>
                        </div>
                      </div>
                    </div>
                  }
                  {value.attributes.fieldMediaType == 'youtube' &&
                    <div className='youtube-container'>
                      <Iframe uuid={value.relationships.fieldMedia.data.id} height="500" width="100%" />
                    </div>
                  }
                </div>
              )
            })}
          </div>
        }
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
  error: getMediaCollectionError(state),
  nodeMediaCollection: getMediaCollection(state),
  paragraphMediaCollection: getParagraphMediaCollection(state),
  pending: getMediaCollectionPending(state),
})

export default connect(
  mapStateToProps,
  null
)(Music );
