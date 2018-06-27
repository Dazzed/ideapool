import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

const ACCESS_TOKEN_NAME = '__idea_access_token';
const REFRESH_TOKEN_NAME = '__idea_refresh_token';

export default class IdeaList extends React.Component {

  renderEditContent = (index) => {
    const {
      editingIdeaObject,
      handleEditIdeaChange,
      submitEditedIdea,
      onCancelEditIdea
    } = this.props;
    return (
      <tr key={index}>
        <td>
          <ul>
            <li>
              <input
                type="text"
                value={editingIdeaObject.content}
                onChange={handleEditIdeaChange.bind(this, 'content')}
                className="user_text_field w-100"
              />
            </li>
          </ul>
        </td>
        <td>
          <input
            type="number"
            value={editingIdeaObject.impact}
            onChange={handleEditIdeaChange.bind(this, 'impact')}
            className="user_field_number"
          />
        </td>
        <td>
          <input
            type="number"
            value={editingIdeaObject.ease}
            onChange={handleEditIdeaChange.bind(this, 'ease')}
            className="user_field_number"
          />
        </td>
        <td>
          <input
            type="number"
            value={editingIdeaObject.confidence}
            onChange={handleEditIdeaChange.bind(this, 'confidence')}
            className="user_field_number"
          />
        </td>
        <td>
            <select
                type="number"
                onChange={handleEditIdeaChange.bind(this, 'public')}
                value={editingIdeaObject.public}
                className="user_field_number">
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select>
        </td>
        <td>
          <img src="/assets/confirm.png" onClick={submitEditedIdea} />
          <img src="/assets/cancel.png" onClick={onCancelEditIdea} className="ml-3" />
        </td>
      </tr>
    );
  }

  render() {
    const {
      ideas,
      editingIdeaId,
    } = this.props;
    if (!ideas) {
      return null;
    }
    return ideas.map((idea, index) => (
      idea.id === editingIdeaId ? this.renderEditContent(index) :
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
            <div className="editIdea" style={{ display: (this.props.userLoggedIn) ? 'block' : 'none' }}>
              <img src="/assets/pen.png" onClick={this.props.onEditIdea.bind(this, idea.id)} />
              <img src="/assets/bin.png" onClick={this.props.onDeleteIdea.bind(this, idea.id)} className="ml-3" />
            </div>
          </td>
        </tr>
    ));
  }
}
