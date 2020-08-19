import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
export class Navbar extends Component {
    handleClick = async (e) => {
        e.preventDefault();
        const token = Cookies.get("token");
        if (!token) window.location.href = "login";

        try {
            Cookies.remove("token");
            await axios({
                url: "/api/auth/logout/",
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            window.location.href = "login";
        } catch (error) {}
    };

    render() {
        return (
            <div>
                <nav className="navbar  bg-secondary">
                    <div style={{ float: "left", color: "white" }}>
                        <h1>Todo-App</h1>
                    </div>
                    <div>
                        <button
                            className="btn btn btn-link"
                            style={{ float: "right", color: "white" }}
                            onClick={this.handleClick}
                        >
                            Signout
                        </button>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;
