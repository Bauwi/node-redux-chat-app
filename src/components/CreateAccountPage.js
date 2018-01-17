import React from "react";

import CreateAccountForm from "./CreateAccountForm";

const CreateAccountPage = () => {
  return (
    <div className="centered-form__form">
      <h3>Create an account</h3>
      <CreateAccountForm
        user={{ email: "", username: "", password: "", room: "" }}
      />
    </div>
  );
};
export default CreateAccountPage;
