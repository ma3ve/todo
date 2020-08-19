import React, { Component } from "react";
import queryString from "query-string";
import axios from "axios";

export class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            success: "",
            error: "",
            password: "",
            confirmPassword: "",
            token: "",
        };
    }

    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ error: "", success: "", loading: true });
        if (!(this.state.password && this.state.confirmPassword)) {
            this.setState({ error: "plz fill the entries", loading: false });
            return;
        }

        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ error: "password dont match", loading: false });
            return;
        }
        try {
            let res = await axios({
                method: "post",
                url: "api/auth/resetpassword/",
                data: {
                    jwt_token: this.state.token,
                    new_password: this.state.password,
                },
            });
            res.data.success &&
                this.setState({ success: "password is succesfully reseted" });
        } catch (error) {
            if (error.response.data) {
                error.response.data.non_field_errors &&
                    this.setState({
                        error: error.response.data.non_field_errors[0],
                    });
            }
        }
        this.setState({ loading: false });
    };

    componentDidMount = async () => {
        var token = queryString.parse(this.props.location.search).token;
        this.setState({ token });
        console.log(token);
        if (!token) {
            this.props.history.push("/");
        }
    };
    render() {
        const {
            loading,
            password,
            confirmPassword,
            error,
            success,
        } = this.state;

        return (
            <>
                <div className="container" style={{ paddingTop: "10px" }}>
                    <div className="row justify-content-center mt-5">
                        <div className=" col-md-5">
                            <form className="card">
                                <div className="card-header">
                                    <h1>EpubReader</h1>
                                </div>
                                <div className="card-body">
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
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="confirmPassword"
                                            name="confirmPassword"
                                            value={confirmPassword}
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
                                        ) : (
                                            "Change password"
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
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ResetPassword;
