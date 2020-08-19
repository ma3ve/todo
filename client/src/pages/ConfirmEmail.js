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
            token: "",
        };
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ error: "", success: "", loading: true });

        try {
            let res = await axios({
                method: "POST",
                url: "api/auth/confirmregistration/",
                data: {
                    jwt_token: this.state.token,
                    new_password: this.state.password,
                },
            });
            res.data.success &&
                this.setState({ success: "email confirmation successful" });
        } catch (error) {
            if (error.response.data) {
                error.response.data.non_field_errors &&
                    this.setState({
                        error: error.response.data.non_field_errors[0],
                    });
            } else {
                this.setState({
                    error: "we went into some errors plz try again later",
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
        const { loading, error, success } = this.state;

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
                                            "Confirm email"
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
