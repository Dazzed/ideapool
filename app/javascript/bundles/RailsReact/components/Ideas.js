import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { ToastContainer, toast } from 'react-toastify';
import UltimatePagination from 'react-ultimate-pagination-bootstrap-4';


import IdeaList from './IdeaList';
import DeleteModal from './DeleteModal';

const ACCESS_TOKEN_NAME = '__idea_access_token';
const REFRESH_TOKEN_NAME = '__idea_refresh_token';

export default class Ideas extends React.Component {

  constructor(props) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class
    this.state = {
      avatar_url: this.props.avatar_url,
      name: this.props.name,
      ideas: this.props.ideas,
      userLoggedIn: this.props.name === "Guest" ? false : true,
      showIdeas: this.props.ideas.length > 0 ? true : false,
      newIdeaObject: null,
      creatingNewIdea: false,
      editingIdeaId: null,
      editingIdeaObject: null,
      page: this.props.page || Math.floor(this.props.ideas.length/10),
      total: this.props.totalPages,
      order_by: 'created_at'
    };
  }
  onPageChange = async page => {
    var ths = document.querySelectorAll("tr.idea_table_header th");
    ths.forEach(item => {
      item.classList.remove("sort_by");
    });
    event.target.classList.add("sort_by");
    try {
      const headers = {
        'x-access-token': cookie.load(ACCESS_TOKEN_NAME),
      };
      const result = await axios.get(`/api/ideas?page=${page}&order=${this.state.order_by}`, { headers });
      this.setState({
        ideas: result.data,
        page: page 
      });
    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  }
  onLogout = () => {
    axios.delete(`/api/access_tokens?refresh_token=${cookie.load(REFRESH_TOKEN_NAME)}`, {
    }).then(res => {
      cookie.remove(ACCESS_TOKEN_NAME)
      cookie.remove(REFRESH_TOKEN_NAME)
      location.href = '/signin';
    })
  }

  onNewIdea = () => {
    const newIdeaObject = {
      content: '',
      ease: 1,
      confidence: 1,
      impact: 1,
      public: false
    };
    this.setState({
      newIdeaObject,
      showIdeas: true
    });
  }

  onCancelNewIdea = () => {
    this.setState({
      newIdeaObject: null,
      showIdeas: false
    })
  };

  handleNewIdeaChange = (key, evt) => {
    this.setState({
      newIdeaObject: {
        ...this.state.newIdeaObject,
        [key]: evt.target.value
      }
    })
  };

  onCreateIdea = async () => {
    try {
      const headers = {
        'x-access-token': cookie.load(ACCESS_TOKEN_NAME),
      };
      const res = await axios.post(`/api/ideas`, this.state.newIdeaObject, { headers });
      this.setState({
        newIdeaObject: null,
        ideas: [res.data].concat(this.state.ideas)
      });
    } catch (e) {
      toast.error("Error");
    }
  }

  onEditIdea = editingIdeaId => {
    this.setState({
      editingIdeaId,
      editingIdeaObject: this.state.ideas.find(({ id }) => editingIdeaId === id)
    });
  }

  onCancelEditIdea = () => {
    this.setState({
      editingIdeaId: null,
      editingIdeaObject: null
    });
  }

  handleEditIdeaChange = (key, evt) => {
    this.setState({
      editingIdeaObject: {
        ...this.state.editingIdeaObject,
        [key]: evt.target.value
      }
    });
  }

  submitEditedIdea = async () => {
    try {
      const headers = {
        'x-access-token': cookie.load(ACCESS_TOKEN_NAME),
      };
      const res = await axios.patch(`/api/ideas/${this.state.editingIdeaId}`, this.state.editingIdeaObject, { headers });
      const editingIdeaIndex = this.state.ideas.findIndex(i => i.id === this.state.editingIdeaId);
      this.setState({
        editingIdeaId: null,
        editingIdeaObject: null,
        ideas: [
          ...this.state.ideas.slice(0, editingIdeaIndex),
          res.data,
          ...this.state.ideas.slice(editingIdeaIndex + 1, this.state.ideas.length)
        ]
      });
    } catch (e) {
      toast.error("Error");
    }
  }

  onDeleteIdea = deletingIdeaId => {
    this.setState({
      deletingIdeaId
    });
  }

  onCancelDeleteIdea = () => {
    this.setState({
      deletingIdeaId: null
    });
  }

  renderDeleteModal = () => {
    const {
      deletingIdeaId
    } = this.state;
    if (deletingIdeaId) {
      return (
        <DeleteModal 
          onCancelDeleteIdea={this.onCancelDeleteIdea}
          handleDeleteIdea={this.handleDeleteIdea}
        />
      );
    }
    return null;
  }

  handleDeleteIdea = async () => {
    try {
      const {
        deletingIdeaId
      } = this.state;
      const headers = {
        'x-access-token': cookie.load(ACCESS_TOKEN_NAME),
      };
      await axios.delete(`/api/ideas/${deletingIdeaId}`, { headers });
      this.setState({
        deletingIdeaId: null,
        ideas: this.state.ideas.filter(({id}) => id !== deletingIdeaId)
      });
    } catch (error) {
      toast.error('Error');
    }
  }

  onSortIdeas = async (event, order_by) => {
    var ths = document.querySelectorAll("tr.idea_table_header th");
    ths.forEach(item => {
      item.classList.remove("sort_by");
    });
    event.target.classList.add("sort_by");
    try {
      const headers = {
        'x-access-token': cookie.load(ACCESS_TOKEN_NAME),
      };
      const result  = await axios.get(`/api/ideas?order=${order_by}`, { headers });
      this.setState({
        ideas: result.data,
        order_by
      });
    } catch (error) {
      toast.error('Error');
    }
  };

  render() {
    const {
      newIdeaObject
    } = this.state;
    return (
      <div className="row">
        <ToastContainer />
        {this.renderDeleteModal()}
        <div className="col-md-2 h-100 bg-sidebar">
          <div className="logo text-center pt-4">
            <img src="/assets/ideapool.png" className="img-fluid" />
          </div>
          <div className="logo_text text-center mt-2">The Idea Pool</div>
          <div className="mt-4 user-style-border">
            <div className="text-center mt-3">
              <img src={this.state.avatar_url} style={{maxWidth: '128px'}} />
              <p className="user_name_style">{this.state.name}</p>
              <p style={{ display: this.state.userLoggedIn ? 'block' : 'none' }}><a onClick={this.onLogout}>Logout</a></p>
            </div>
          </div>
        </div>
        <div className="col-md-10">
          <div className="row ">
            <div className="col-md-12 pl-4 pr-4 pt-3">
              <div className="row  pb-4 br-bt-1">
                <div className="col-md-10">
                  <h2>Ideas</h2>
                  <span className="add_btn_ideas"></span>
                </div>
                <div className="col-md-2">
                  <img src="/assets/btn_addanidea.png" className="add_ideas" onClick={this.onNewIdea} style={{ display: this.state.name === 'Guest' ? 'none' : 'block' }} />
                  <a href="/signin" className="login_url" style={{ display: this.state.userLoggedIn  ? 'none' : 'block' }}>Log in</a>
                </div>
              </div>
              <div className="row ">
                <div className="col-md-12">
                  <div
                    className="new_idea"
                    style={{ marginTop: '100px', display: (this.state.showIdeas || !this.state.userLoggedIn) ? 'none' : 'block' }}
                    onClick={this.onNewIdea}>
                    Add a new idea
                    <br />
                    <br />
                    <img src="/assets/bulb.png" />
                  </div>
                  <div className="table-responsive idea_table" style={{ display: (this.state.showIdeas) ? 'block' : 'none' }}>
                    <table className="table">
                      <thead>
                        <tr className='idea_table_header'>
                          <th onClick={(event) => this.onSortIdeas(event,'content')}>Title</th>
                          <th onClick={(event) => this.onSortIdeas(event,'impact')}>Impact</th>
                          <th onClick={(event) => this.onSortIdeas(event,'ease')}>Ease</th>
                          <th onClick={(event) => this.onSortIdeas(event,'confidence')}>Confidence</th>
                          <th onClick={(event) => this.onSortIdeas(event,'public')}>Public</th>
                          <th>&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newIdeaObject !== null &&
                          <tr>
                            <td>
                              <ul>
                                <li>
                                  <input
                                    type="text"
                                    value={newIdeaObject.content}
                                    onChange={this.handleNewIdeaChange.bind(this, 'content')}
                                    className="user_text_field w-100"
                                  />
                                </li>
                              </ul>
                            </td>
                            <td>
                              <input
                                type="number"
                                value={newIdeaObject.impact}
                                onChange={this.handleNewIdeaChange.bind(this, 'impact')}
                                className="user_field_number"
                                min="1"
                                max="10"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={newIdeaObject.ease}
                                onChange={this.handleNewIdeaChange.bind(this, 'ease')}
                                className="user_field_number"
                                min="1"
                                max="10"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={newIdeaObject.confidence}
                                onChange={this.handleNewIdeaChange.bind(this, 'confidence')}
                                className="user_field_number"
                                min="1"
                                max="10"
                              />
                            </td>
                            <td>
                              <select
                                type="number"
                                value={newIdeaObject.public}
                                onChange={this.handleNewIdeaChange.bind(this, 'public')}
                                className="user_field_number">
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                              </select>
                            </td>
                            <td>
                              <img src="/assets/confirm.png" onClick={this.onCreateIdea} />
                              <img src="/assets/cancel.png" onClick={this.onCancelNewIdea} className="ml-3" />
                            </td>
                          </tr>}
                          <IdeaList
                          ideas={this.state.ideas} 
                          userLoggedIn={this.state.userLoggedIn}
                          onEditIdea={this.onEditIdea}
                          onCancelEditIdea={this.onCancelEditIdea}
                          editingIdeaId={this.state.editingIdeaId}
                          editingIdeaObject={this.state.editingIdeaObject}
                          handleEditIdeaChange={this.handleEditIdeaChange}
                          submitEditedIdea={this.submitEditedIdea}
                          onDeleteIdea={this.onDeleteIdea}
                          />
                      </tbody>
                    </table>
                    <UltimatePagination
                      currentPage={this.state.page}
                      totalPages={this.state.total}
                      onChange={this.onPageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
