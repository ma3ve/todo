import React, { Component } from "react";
import axios from "axios";

export class ForgetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            error: "",
            success: "",
            loading: false,
        };
    }

    handleClick = async (e) => {
        e.preventDefault();
        console.log("clicked");
        this.setState({ loading: true, error: "", success: "" });
        if (!this.state.username) {
            this.setState({ error: "username required", loading: false });
            return;
        }
        try {
            let res = await axios({
                method: "post",
                url: "api/auth/resetpassword/getusername/",
                data: { username: this.state.username },
            });
            console.log(res);
            if (res.data.success) {
                this.setState({
                    success:
                        "A password reset link is sent to associated email",
                });
            }
            this.setState({ loading: false });
        } catch (error) {
            if (error.response) {
                if (error.response.data.non_field_errors) {
                    this.setState({
                        error: error.response.data.non_field_errors[0],
                    });
                }
            } else {
                this.setState({
                    error: "we got into some error plz try again later",
                });
            }
            this.setState({ loading: false });
        }
    };

    render() {
        const { username, error, success, loading } = this.state;
        return (
            <div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <form>
                                <p>
                                    plz enter your username to get a password
                                    reset link to provided email
                                </p>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="username"
                                        onChange={(e) => {
                                            this.setState({
                                                username: e.target.value,
                                            });
                                        }}
                                        value={username}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={this.handleClick}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Loading...
                                        </>
                                    ) : (
                                        "submit"
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ForgetPassword;
