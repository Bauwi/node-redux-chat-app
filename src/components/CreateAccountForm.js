import React from "react";
import { connect } from "react-redux";
import { withFormik } from "formik";
import Yup from "yup";
import classnames from "classnames";

import { startCreateAccount } from "./../actions/auth";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("This is not a valid email !")
      .required("Room Name is required!"),
    username: Yup.string()
      .min(2, "C'mon, your name is longer than that")
      .required("username is required."),
    password: Yup.string()
      .min(2, "C'mon, your password can not be that short")
      .required("Password is required.")
  }),

  mapPropsToValues: ({ user }) => ({
    ...user
  }),
  handleSubmit: (payload, formikBag) => {
    formikBag.props.startCreateAccount({
      email: payload.email,
      password: payload.password,
      username: payload.username
    });
    formikBag.setSubmitting(false);
  },
  displayName: "MyForm"
});

const InputFeedback = ({ error }) =>
  error ? <div className="input-feedback">{error}</div> : null;

const Label = ({ error, className, children, ...props }) => {
  return (
    <label className="label" {...props}>
      {children}
    </label>
  );
};

const TextInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  ...props
}) => {
  const classes = classnames(
    "input-group",
    {
      "animated shake error": !!error
    },
    className
  );
  return (
    <div className={classes}>
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      <input
        id={id}
        className="text-input"
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
      <InputFeedback error={error} />
    </div>
  );
};
const MyForm = props => {
  const {
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isSubmitting
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        id="email"
        type="email"
        label="E-mail"
        placeholder="ex: drwho@universe.com"
        error={touched.email && errors.email}
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextInput
        id="username"
        type="text"
        label="Username"
        placeholder="ex: Doctor Who"
        error={touched.username && errors.username}
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextInput
        id="password"
        type="password"
        label="Password"
        placeholder="ex: Geronimo11th"
        error={touched.password && errors.password}
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div className="button__wrapper ">
        <button
          type="button"
          className="outline"
          onClick={handleReset}
          disabled={!dirty || isSubmitting}
        >
          Reset
        </button>
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </div>
    </form>
  );
};

const mapDispatchToProps = dispatch => ({
  startCreateAccount: credentials => dispatch(startCreateAccount(credentials))
});

export default connect(undefined, mapDispatchToProps)(formikEnhancer(MyForm));
