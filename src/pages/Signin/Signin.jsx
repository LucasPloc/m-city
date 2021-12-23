import { useState, Fragment } from "react";
import { auth, signInWithEmailAndPassword } from "../../firebase";
import { showToastError, showToastSuccess } from "../../components/utils/tools";
import { CircularProgress } from "@mui/material";
import { useHistory, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const Signin = (props) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submitForm = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToastSuccess("Welcome back !");
      history.push("/dashboard");
    } catch (error) {
      showToastError(error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("The email is required"),
      password: Yup.string().required("The password is required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      submitForm(values);
    },
  });
  return (
    <Fragment>
      {!props.user ? (
        <div className="container">
          <div className="signin_wrapper" style={{ margin: "100px" }}>
            <form onSubmit={formik.handleSubmit}>
              <h2>Please login</h2>
              <input
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error_label">{formik.errors.email}</div>
              ) : null}
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="error_label">{formik.errors.password}</div>
              ) : null}
              <button type="submit">Log in</button>
              {loading && (
                <CircularProgress color="secondary" className="progress" />
              )}
            </form>
          </div>
        </div>
      ) : (
        <Redirect to="/dashboard" />
      )}
    </Fragment>
  );
};

export default Signin;
