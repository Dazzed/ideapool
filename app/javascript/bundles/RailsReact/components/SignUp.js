import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

const ACCESS_TOKEN_NAME = '__idea_access_token';
const REFRESH_TOKEN_NAME = '__idea_refresh_token';

export default class SignIn extends React.Component {
    /**
     * @param props - Comes from your rails view.
     */
    constructor(props) {
        super(props);

        // How to set initial state in ES6 class syntax
        // https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class
        this.state = {
            name: '',
            email: '',
            password: ''
        };
    }

    handleChange = (event, field) => {
        this.setState({
            [field]: event.target.value
        });
    }

    onSubmit = async (event) => {
        event.preventDefault();

        try {
            const user = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            };

            await axios.post(`/api/users`, { user })
                .then(res => {
                    cookie.save(ACCESS_TOKEN_NAME, res.data.jwt, { path: '/' })
                    cookie.save(REFRESH_TOKEN_NAME, res.data.refresh_token, { path: '/' })
                })
            location.href = '/ideas';
            return false;
        } catch (e) {
            alert("Error");
        }
    }

    render() {
        return (
            <div className="row h-100">
                <div className="col-md-2 bg-sidebar">
                    <div className="logo text-center pt-4">
                        <img src="/assets/ideapool.png" className="img-fluid" />
                    </div>
                    <div className="logo_text text-center mt-2">The Idea Pool</div>
                    <br />
                    <div className="mt-4 user-style-border">
                        <div className="text-center mt-3">
                            <p><a style={{ color: "#000" }} href="/ideas">Ideas</a></p>
                        </div>
                    </div>
                </div>
                <div className="col-md-10">
                    <div className="row  h-100 justify-content-center align-items-center">
                        <div className="col-md-5">
                            <form onSubmit={this.onSubmit}>
                                <h1 className="text-center">Sign Up</h1>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group mt-4">
                                            <input type="text" className="user_text_field w-100" placeholder="Name" onChange={(event) => this.handleChange(event, 'name')} />
                                        </div>
                                        <div className="form-group mt-4">
                                            <input type="text" className="user_text_field w-100" placeholder="Email" onChange={(event) => this.handleChange(event, 'email')} />
                                        </div>
                                        <div className="form-group mt-4">
                                            <input type="password" className="user_text_field w-100" placeholder="Password" onChange={(event) => this.handleChange(event, 'password')} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-md-6 text-left">
                                        <button type="submit" className="idea_pool_success_btn">Sign Up</button>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="login_text mt-3">Already have an account? <a href="/signin" className="login_url">Log in</a></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}