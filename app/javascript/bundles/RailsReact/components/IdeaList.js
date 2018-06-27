import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

const ACCESS_TOKEN_NAME = '__idea_access_token';
const REFRESH_TOKEN_NAME = '__idea_refresh_token';

export default class IdeaList extends React.Component {

  render() {
    const {
      ideas
    } = this.props;
    if (!ideas) {
      return null;
    }
    return ideas.map((idea, index) => (
        <tr key={index}>
          <td>
            <ul>
              <li>
                {idea.content}
              </li>
            </ul>
          </td>
          <td>{idea.impact}</td>
          <td>{idea.ease}</td>
          <td>{idea.confidence}</td>
          <td>{idea.public ? "Yes" : "No" }</td>
          <td>
            <div className="editIdea" style={{ display: this.props.userLoggedIn ? 'block' : 'none'}}>
              <img src="/assets/pen.png" />
              <img src="/assets/bin.png" className="ml-3" />
            </div>
          </td>
        </tr>
    ));
  }
}