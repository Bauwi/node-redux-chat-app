import React from "react";
import { Link } from "react-router-dom";

import CreateAccountForm from "./CreateAccountForm";

const CreateAccountPage = () => {
  return (
    <div className="centered-form__form">
      <h1 className="login-title">Sign up</h1>
      <CreateAccountForm
        user={{ email: "", username: "", password: "", room: "" }}
      />
      <div className="login-option">
        <Link to="/">I already have an account</Link>
      </div>
    </div>
  );
};
export default CreateAccountPage;
