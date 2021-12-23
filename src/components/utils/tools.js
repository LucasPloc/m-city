import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import mcityLogo from "../../resources/images/logos/manchester_city_logo.png";
import { signOut, auth } from "../../firebase";
import { FormHelperText } from "@mui/material";

export const CityLogo = (props) => {
  const template = (
    <div
      className="img_cover"
      style={{
        width: props.width,
        height: props.height,
        background: `url(${mcityLogo}) no-repeat`,
      }}
    ></div>
  );
  return props.link ? (
    <Link className="link_logo" to={props.linkTo}>
      {template}
    </Link>
  ) : (
    template
  );
};

export const showToastError = (msg) =>
  toast.error(msg, {
    position: toast.POSITION.TOP_LEFT,
  });
export const showToastSuccess = (msg) =>
  toast.success(msg, {
    position: toast.POSITION.TOP_LEFT,
  });

export const logoutHandler = async (history) => {
  try {
    await signOut(auth);
    showToastSuccess("Good bye!");
    history.push("/signin");
  } catch (err) {
    showToastError(err.message);
  }
};

export const Tag = (props) => {
  const template = (
    <div
      style={{
        background: props.bck ? props.bck : "#fff",
        fontSize: props.size ? props.size : "15px",
        color: props.color ? props.color : "#000",
        padding: "5px 10px",
        display: "inline-block",
        fontFamily: "Righteous",
        ...props.add,
      }}
    >
      {props.children}
    </div>
  );

  if (props.link) {
    return <Link to={props.linkTo}>{template}</Link>;
  } else {
    return template;
  }
};

export const textErrorHelper = (formik, values) => ({
  error: formik.errors[values] && formik.touched[values],
  helperText:
    formik.errors[values] && formik.touched[values]
      ? formik.errors[values]
      : null,
});

export const selectFormHelper = (formik, values) => {
  if (formik.errors[values] && formik.touched[values]) {
    return <FormHelperText>{formik.errors[values]}</FormHelperText>;
  }
  return false;
};

export const selectIsError = (formik, values) => {
  return formik.errors[values] && formik.touched[values];
};
