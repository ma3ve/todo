import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export class LR extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: true,
            username: "",
            email: "",
            password: "",
            success: "",
            error: "",
        };
    }

    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            error: "",
        });
        const { login, username, password, email } = this.state;
        this.setState({ loading: true });
        if (!(username && password && (login ? true : email))) {
            this.setState({ error: "fields missing", loading: false });
            return;
        }

        try {
            const res = await axios({
                url: `/api/auth/${login ? "login" : "register"}/`,
                method: "POST",
                data: { username, password, email },
            });
            console.log(res.data);
            if (res.data.success && !login) {
                this.setState({
                    success:
                        "A confirmation email has been sent to provieded email",
                });
            } else if (res.data.token && login) {
                Cookies.set("token", res.data.token, {
                    sameSite: "none",
                    secure: true,
                });
                window.location.href = "/";
            }
        } catch (e) {
            if (e.response) {
                const { data } = e.response;

                if (data.non_field_errors) {
                    this.setState({ error: data.non_field_errors[0] });
                }
                if (data.username) {
                    this.setState({
                        error: data.username[0],
                    });
                }
            } else {
                console.log(e);
            }
            console.log(e);
        }
        this.setState({ loading: false });
    };

    componentDidMount = () => {
        if (Cookies.get("token")) {
            window.location.href = "/";
        }
    };

    render() {
        const {
            username,
            email,
            password,
            login,
            loading,
            error,
            success,
        } = this.state;

        return (
            <div className="container" style={{ paddingTop: "10px" }}>
                <div className="row justify-content-center mt-5">
                    <div className=" col-md-5">
                        <form className="card">
                            <div className="card-header">
                                <h1>Task Manager</h1>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Username"
                                        name="username"
                                        value={username}
                                        onChange={this.handleOnChange}
                                        required
                                    ></input>
                                </div>
                                {!login && (
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="email"
                                            name="email"
                                            value={email}
                                            onChange={this.handleOnChange}
                                            required
                                        ></input>
                                    </div>
                                )}
                                <div className="form-group">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="password"
                                        name="password"
                                        value={password}
                                        onChange={this.handleOnChange}
                                        required
                                    ></input>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block btn-sm"
                                    onClick={this.handleSubmit}
                                >
                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="sr-only">
                                                Loading...
                                            </span>
                                        </>
                                    ) : login ? (
                                        "Login"
                                    ) : (
                                        "Register"
                                    )}
                                </button>
                                {error && (
                                    <div
                                        className="alert alert-danger mt-2"
                                        role="alert"
                                    >
                                        <h4 className="alert-heading">
                                            Error!
                                        </h4>
                                        <p>{error}</p>
                                    </div>
                                )}
                                {success && (
                                    <div
                                        className="alert alert-success mt-2"
                                        role="alert"
                                    >
                                        <h4 className="alert-heading">
                                            Success!
                                        </h4>
                                        <p>{success}</p>
                                    </div>
                                )}
                            </div>
                        </form>

                        <h6 className="text-muted text-center mt-2">
                            {login ? "New Here?" : "Already have an Account?"}
                        </h6>

                        <div className="card-body">
                            <button
                                className="btn-block btn-secondary btn-sm"
                                onClick={() => {
                                    this.setState({ login: !this.state.login });
                                }}
                            >
                                {!login ? "Login" : "Register"}
                            </button>
                            <a
                                href="/forgetpassword"
                                style={{ float: "right" }}
                                className="mt-2"
                            >
                                forget password?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LR;
