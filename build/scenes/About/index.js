import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { connect } from 'react-redux'
import { Parallax } from 'react-scroll-parallax'
import {
  getAboutUsError,
  getAboutUs,
  getAboutUsPending,
  getParagraphArtists
} from './../../services/redux/reducers/AboutUsReducer';
import * as drupalServices from './../../services/DrupalServices'
import Loader from './../../components/Loader'
import Image from './../../components/Images'

class About extends Component {
  constructor(props){
    super(props)
    this.renderSocialLinks = this.renderSocialLinks.bind(this)
  }

  componentDidMount() {
    // Only update if the medial collection item isnt already
    // in the redux store. If its not then fetch the data.
    // @TODO Rather than look for length check for a specific
    //       item was loaded with drupalServices.checkData.
    //       Passing in the ID as a prop
    // if (Object.values(nodeAboutUs).length == 0) {
      drupalServices.setOperationAndDispatch('nodeAboutUs')
    // }
  }

  renderSocialLinks(title) {
    switch (title) {
      case 'Twitter':
        return <i className="fab fa-twitter"></i>
      case 'Instagram':
        return <i className="fab fa-instagram"></i>
      case 'Facebook':
        return <i className="fab fa-facebook"></i>
      case 'soundcloud':
        return <i className="fab fa-soundcloud"></i>
      default:
      return
    }
  }

  render () {
    const { paragraphArtists, error, pending } = this.props
    const artists = Object.values(paragraphArtists).length ? Object.values(paragraphArtists) : false

    return (
      <div className='about-page'>
        {artists && pending == false &&
          <div className='container'>
            <div className='col-md-6 col-md-push-3'>
              {artists.map((artist, index) => {
                return (
                  <div className='bio' key={index}>
                    <div className='bio-image'>
                      <Parallax className="parallax-window" y={[-20, 20]} tagOuter="figure">
                        <Image uuid={artist.relationships.fieldArtistPhoto.data.id} parallax={true} />
                      </Parallax>
                    </div>
                    <div className='bio-info-container'>
                      <div className='bio-name'>
                        <h4>{artist.attributes.fieldArtistName}</h4>
                      </div>
                      <div className='bio-quote'>
                        <h4>{artist.attributes.fieldArtistQuotable}</h4>
                      </div>
                      <ul className='bio-social-links'>
                        {artist.attributes.fieldSocialShare.map((share, key) => {
                          return (
                            <li key={key}>
                              <Link className='bio-social-link' to={share.uri}>{this.renderSocialLinks(share.title)}</Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
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
  error: getAboutUsError(state),
  nodeAboutUs: getAboutUs(state),
  paragraphArtists: getParagraphArtists(state),
  pending: getAboutUsPending(state)
})

export default connect(mapStateToProps)(About)
