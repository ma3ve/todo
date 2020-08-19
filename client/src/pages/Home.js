import React, { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
export class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            showAddInput: false,
            newTask: "",
        };
    }

    componentDidMount = async () => {
        const token = Cookies.get("token");
        if (!token) window.location.href = "login";
        this.setState({ token });
        try {
            const res = await axios({
                url: "/api/",
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            this.setState({ tasks: res.data });
        } catch (error) {
            if (error.response) {
                if (error.response.data.detail === "Invalid token.") {
                    Cookies.remove("token");
                    window.location.href = "/login";
                }
            }
            console.log("error");
        }
    };

    handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios({
                method: "POST",
                url: `/api/create/`,
                data: {
                    task: this.state.newTask,
                },
                headers: { Authorization: `Token ${Cookies.get("token")}` },
            });
            window.location.href = "/";
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => {
                                this.setState({
                                    showAddInput: !this.state.showAddInput,
                                });
                            }}
                        >
                            Add
                        </button>
                        {this.state.showAddInput && (
                            <form className="mt-3">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="New Task"
                                        onChange={(e) => {
                                            this.setState({
                                                newTask: e.target.value,
                                            });
                                        }}
                                        value={this.state.newTask}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={this.handleAdd}
                                >
                                    Submit
                                </button>
                            </form>
                        )}
                    </div>
                    {this.state.tasks.map((task, key) => {
                        return (
                            <Card
                                task={task}
                                key={key}
                                handleChange={this.handleChange}
                                index={key}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Home;
