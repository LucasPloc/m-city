import { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { showToastSuccess, showToastError } from "../utils/tools";
import { collection, where, query, DB, getDocs, addDoc } from "../../firebase";

const Enroll = () => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("The email is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      submitForm(values);
    },
  });

  const submitForm = async (values) => {
    try {
      const emails = await collection(DB, "promotions");
      const q = await query(emails, where("email", "==", values.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length >= 1) {
        showToastError("Sorry you are on the list already");
        setLoading(false);
        return;
      } else {
        await addDoc(collection(DB, "promotions"), {
          email: values.email,
        });
        formik.resetForm();
        setLoading(false);
        showToastSuccess("Congratulation !!");
      }
    } catch (err) {
      showToastError(err);
    }
  };

  return (
    <Fade>
      <div className="enroll_wrapper">
        <form onSubmit={formik.handleSubmit}>
          <div className="enroll_title">Enter your email</div>
          <div className="enroll_input">
            <input
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error_label">{formik.errors.email}</div>
            ) : null}
            {loading ? (
              <CircularProgress color="secondary" className="progress" />
            ) : (
              <button type="submit">Enroll</button>
            )}
            <div className="enroll_discl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            </div>
          </div>
        </form>
      </div>
    </Fade>
  );
};

export default Enroll;
