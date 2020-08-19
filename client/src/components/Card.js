import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export class Card extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changeInput: false,
            newTask: this.props.task.task,
        };
    }

    handleChangeComplete = async () => {
        try {
            const res = await axios({
                method: "PATCH",
                url: `/api/patch/`,
                data: {
                    id: this.props.task.id,
                    completed: !this.props.task.completed,
                },
                headers: { Authorization: `Token ${Cookies.get("token")}` },
            });
            if (res.data.success) {
                window.location.href = "/";
            }
        } catch (e) {
            console.log(e);
        }
    };

    handleDelete = async () => {
        try {
            const res = await axios({
                method: "DELETE",
                url: `/api/delete/`,
                data: {
                    id: this.props.task.id,
                },
                headers: { Authorization: `Token ${Cookies.get("token")}` },
            });
            console.log(res.data);
            if (res.data.success) {
                window.location.href = "/";
            }
        } catch (e) {
            console.log(e);
        }
    };

    handleChange = async (e) => {
        e.preventDefault();
        try {
            await axios({
                method: "POST",
                url: `/api/patch/`,
                data: {
                    task: this.state.newTask,
                    id: this.props.task.id,
                },
                headers: { Authorization: `Token ${Cookies.get("token")}` },
            });
            window.location.href = "/";
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        const { task, completed, created_at } = this.props.task;
        return (
            <div>
                <div className="card text-center mt-4">
                    <div className="card-body">
                        <h5 className="card-title">{task}</h5>
                        <div className="row justify-content-center">
                            <div className="col-2">
                                <button
                                    className={
                                        (completed
                                            ? " btn-primary"
                                            : " btn-danger") + " btn"
                                    }
                                    onClick={this.handleChangeComplete}
                                >
                                    {completed ? "Completed" : "Incomplete"}
                                </button>
                            </div>
                            <div className="col-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        this.setState({
                                            changeInput: !this.state
                                                .changeInput,
                                        });
                                    }}
                                >
                                    change
                                </button>
                            </div>
                            <div className="col-2">
                                <button
                                    className="btn btn-danger"
                                    onClick={this.handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        {this.state.changeInput && (
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
                                    onClick={this.handleChange}
                                >
                                    Submit
                                </button>
                            </form>
                        )}
                    </div>
                    <div className="card-footer text-muted">
                        {new Date(created_at).toString()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
