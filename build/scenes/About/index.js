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
import GoogleAnalytics from './../../services/GoogleAnalytics'
import Loader from './../../components/Loader'
import Image from './../../components/Images'

class About extends Component {
  constructor(props){
    super(props)
    this.renderSocialLinks = this.renderSocialLinks.bind(this)
    this.goToSocial = this.goToSocial.bind(this)
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

  goToSocial(url, title) {
    const analytics = new GoogleAnalytics()
    analytics.trackEvent('Clicked Social Links', {
      category: 'social',
      label: title,
      value: ''
    })
    // open the link.
    window.open(url, '_blank')
  }

  render () {
    const { paragraphArtists, error, pending } = this.props
    const artists = Object.values(paragraphArtists).length ? Object.values(paragraphArtists) : false

    return (
      <div className='about-page'>
        {artists && pending == false &&
          <div className='container'>
            <div className='bio-container'>
              {artists.map((artist, index) => {
                return (
                  <div className='bio' key={index}>
                    <div className='bio-image-container'>
                      <Parallax className="parallax-window" y={[-20, 20]} tagOuter="figure">
                        <Image className="bio-image" uuid={artist.relationships.fieldArtistPhoto.data.id} parallax={true} />
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
                              <div
                                className='bio-social-link'
                                onClick={() => this.goToSocial(share.uri, `${artist.attributes.fieldArtistName} - ${share.title}`)}>
                                {this.renderSocialLinks(share.title)}
                              </div>
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
