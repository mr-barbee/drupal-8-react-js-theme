import React, {Component} from 'react'

export default class ErrorCodes extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        {this.props.error != null && this.props.error.status == 404 &&
          <div>
            <h3>404 Page Not Found</h3>
            <p>The requested page could not be found.</p>
          </div>
        }
        {this.props.error != null && this.props.error.status == 403 &&
          <div>
            <h3>403 Access Denied</h3>
            <p>You are not authorized to access this page.</p>
          </div>
        }
        {this.props.error == null &&
          <div>
            <h3>Error loading</h3>
            <p>There has been an error loading this content.</p>
          </div>
        }
      </div>
    )
  }
}
