import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { ToastContainer, toast } from 'react-toastify';


const ACCESS_TOKEN_NAME = '__idea_access_token';
const REFRESH_TOKEN_NAME = '__idea_refresh_token';

export default class SignIn extends React.Component {

    constructor(props) {
        super(props);

        // How to set initial state in ES6 class syntax
        // https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class
        this.state = {
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
                email: this.state.email,
                password: this.state.password
            };

            await axios.post(`/api/access_tokens`, user)
                .then(res => {
                    cookie.save(ACCESS_TOKEN_NAME, res.data.jwt, { path: '/' })
                    cookie.save(REFRESH_TOKEN_NAME, res.data.refresh_token, { path: '/' })
                })
            location.href = '/ideas';
            return false;
        } catch (e) {
            toast.error("Invalid username / password");
            return false;
        }
    }
    render() {
        return (
            <div className="row h-100">
                <ToastContainer />
                <div className="col-md-2  bg-sidebar">
                    <div className="logo text-center pt-4">
                        <img src="/assets/ideapool.png" className="img-fluid" />
                    </div>
                    <div className="logo_text text-center mt-2">The Idea Pool</div>
                </div>
                <div className="col-md-10">
                    <div className="row  h-100 justify-content-center align-items-center">
                        <div className="col-md-5">
                            <form onSubmit={this.onSubmit}>
                                <h1 className="text-center">Log In</h1>
                                <div className="row">
                                    <div className="col-md-12">
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
                                        <button type="submit" className="idea_pool_success_btn">Log In</button>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="login_text mt-3">Don't have an account? <a href="/signup" className="login_url">Create an account?</a></div>
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
