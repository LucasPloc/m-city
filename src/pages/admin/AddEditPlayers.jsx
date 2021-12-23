import { useEffect, useState } from "react";
import AdminLayout from "../../hoc/AdminLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import {
  showToastError,
  showToastSuccess,
  textErrorHelper,
  selectFormHelper,
  selectIsError,
} from "../../components/utils/tools";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import { collection, addDoc, DB, doc, updateDoc } from "../../firebase";
import { getDoc } from "@firebase/firestore";

const defaultValues = {
  name: "",
  lastname: "",
  position: "",
  image: "",
};

const AddEditPlayers = (props) => {
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState("");
  const [values, setValues] = useState(defaultValues);

  const history = useHistory();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: values,
    validationSchema: Yup.object({
      name: Yup.string().required("This input is required"),
      lastname: Yup.string().required("This input is required"),
      number: Yup.number()
        .required("This input is required")
        .min(0, "The minimum is zero")
        .max(100, "The max is 100"),
      position: Yup.string().required("This input is required"),
    }),
    onSubmit: (values) => {
      submitForm(values);
    },
  });

  useEffect(() => {
    const param = props.match.params.id;
    if (param) {
      const takePlayer = async () => {
        const playerRef = await doc(DB, "players", param);
        const player = await getDoc(playerRef);
        if (player) {
          setFormType("edit");
          setValues(player.data());
        } else {
          showToastError("Sorry nothing was found");
          return;
        }
      };
      takePlayer();
    } else {
      setFormType("add");
      setValues(defaultValues);
    }
  }, [props.match.params.id]);

  const submitForm = (values) => {
    setLoading(true);
    if (formType === "add") {
      addDoc(collection(DB, "players"), {
        ...values,
      })
        .then(() => {
          showToastSuccess("Player added");
          formik.resetForm();
          history.push("/admin-players");
        })
        .catch((err) => showToastError(err));
    } else if (formType === "edit") {
      const updatePlayer = async () => {
        const playerRef = await doc(DB, "players", props.match.params.id);
        try {
          await updateDoc(playerRef, { ...values });
          setLoading(false);
          showToastSuccess("Player updated");
          history.push("/admin-players");
        } catch (err) {
          showToastError(err);
          setLoading(false);
        }
      };
      updatePlayer();
    }
    return;
  };

  return (
    <AdminLayout title={formType === "add" ? "Add player" : "Edit player"}>
      <div className="editplayers_dialog_wrapper">
        <div>
          <form onSubmit={formik.handleSubmit}>
            <h4>Player info</h4>
            <div className="mb-5">
              <FormControl>
                <TextField
                  id="name"
                  name="name"
                  variant="outlined"
                  placeholder="Add firstname"
                  {...formik.getFieldProps("name")}
                  {...textErrorHelper(formik, "name")}
                />
              </FormControl>
            </div>
            <div className="mb-5">
              <FormControl>
                <TextField
                  id="lastname"
                  name="lastname"
                  variant="outlined"
                  placeholder="Add lastname"
                  {...formik.getFieldProps("lastname")}
                  {...textErrorHelper(formik, "lastname")}
                />
              </FormControl>
            </div>
            <div className="mb-5">
              <FormControl>
                <TextField
                  type="number"
                  id="number"
                  name="number"
                  variant="outlined"
                  placeholder="Add number"
                  {...formik.getFieldProps("number")}
                  {...textErrorHelper(formik, "number")}
                />
              </FormControl>
            </div>
            <div className="mb-5">
              <FormControl error={selectIsError(formik, "position")}>
                <Select
                  id="position"
                  name="position"
                  variant="outlined"
                  displayEmpty
                  {...formik.getFieldProps("position")}
                >
                  <MenuItem value="" disabled>
                    Select a position
                  </MenuItem>
                  <MenuItem value="Keeper">Keeper</MenuItem>
                  <MenuItem value="Defence">Defence</MenuItem>
                  <MenuItem value="Midfield">Midfield</MenuItem>
                  <MenuItem value="Striker">Striker</MenuItem>
                </Select>
                {selectFormHelper(formik, "position")}
              </FormControl>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {formType === "add" ? "Add player" : "Edit player"}
            </Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddEditPlayers;
