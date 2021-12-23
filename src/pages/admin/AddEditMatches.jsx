import { useEffect, useState } from "react";
import AdminLayout from "../../hoc/AdminLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { getDoc } from "@firebase/firestore";
import {
  query,
  DB,
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
} from "../../firebase";
import {
  showToastSuccess,
  showToastError,
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

const defaultValues = {
  date: "",
  local: "",
  resultLocal: "",
  away: "",
  resultAway: "",
  referee: "",
  stadium: "",
  result: "",
  final: "",
};

const AddEditMatches = (props) => {
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState("");
  const [team, setTeam] = useState(null);
  const [values, setValues] = useState(defaultValues);
  const history = useHistory();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: values,
    validationSchema: Yup.object({
      date: Yup.string().required("This input is required"),
      local: Yup.string().required("This input is required"),
      resultLocal: Yup.number()
        .required("This input is required")
        .min(0, "The minimum is 0")
        .max(99, "The maximum is 99"),
      away: Yup.string().required("This input is required"),
      resultAway: Yup.number()
        .required("This input is required")
        .min(0, "The minimum is 0")
        .max(99, "The maximum is 99"),
      referee: Yup.string().required("This input is required"),
      stadium: Yup.string().required("This input is required"),
      result: Yup.mixed()
        .required("This input is required")
        .oneOf(["W", "D", "L", "n/a"]),
      final: Yup.mixed()
        .required("This input is required")
        .oneOf(["yes", "no"]),
    }),
    onSubmit: (values) => {
      submitForm(values);
    },
  });

  useEffect(() => {
    if (!team) {
      const takeTeam = async () => {
        try {
          const q = await query(collection(DB, "teams"));
          const querySnapshot = await getDocs(q);
          const team = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTeam(team);
        } catch (err) {
          showToastError(err);
        }
      };
      takeTeam();
    }
  }, [team]);

  useEffect(() => {
    const id = props.match.params.id;
    if (id) {
      const takeTeam = async () => {
        const matchRef = await doc(DB, "matches", id);
        const match = await getDoc(matchRef);
        if (match) {
          setFormType("edit");
          setValues(match.data());
        } else {
          showToastError("Sorry nothing was found");
          return;
        }
      };
      takeTeam();
    } else {
      setFormType("add");
    }
  }, [props.match.params.id]);

  const showTeams = () =>
    team
      ? team.map((team) => (
          <MenuItem key={team.id} value={team.shortName}>
            {team.shortName}
          </MenuItem>
        ))
      : null;

  const submitForm = (values) => {
    const dataToSubmit = values;
    team.forEach((team) => {
      if (team.shortName === dataToSubmit.local) {
        dataToSubmit["localThmb"] = team.thmb;
      }
      if (team.shortName === dataToSubmit.away) {
        dataToSubmit["awayThmb"] = team.thmb;
      }
    });
    setLoading(true);
    if (formType === "add") {
      addDoc(collection(DB, "matches"), {
        ...values,
      })
        .then(() => {
          showToastSuccess("Match added");
          history.push("/admin-matches");
          setLoading(false);
        })
        .catch((err) => showToastError(err));
    } else {
      const updateMatch = async () => {
        const matchRef = await doc(DB, "matches", props.match.params.id);
        try {
          await updateDoc(matchRef, { ...values });
          setLoading(false);
          showToastSuccess("Match updated");
          history.push("/admin-matches");
        } catch (err) {
          showToastError(err);
          setLoading(false);
        }
      };
      updateMatch();
    }
  };

  return (
    <AdminLayout title={formType === "edit" ? "Edit match" : "Add match"}>
      <div className="editmatch_dialog_wrapper">
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <h4>Select date</h4>
              <FormControl>
                <TextField
                  id="date"
                  variant="outlined"
                  name="date"
                  type="date"
                  {...formik.getFieldProps("date")}
                  {...textErrorHelper(formik, "date")}
                />
              </FormControl>
            </div>
            <hr />
            <div>
              <h4>Result local</h4>
              <FormControl error={selectIsError(formik, "local")}>
                <Select
                  id="local"
                  name="local"
                  variant="outlined"
                  displayEmpty
                  {...formik.getFieldProps("local")}
                >
                  <MenuItem value="" disabled>
                    Select a team
                  </MenuItem>
                  {showTeams()}
                </Select>
                {selectFormHelper(formik, "local")}
              </FormControl>
              <FormControl style={{ marginLeft: "10px" }}>
                <TextField
                  id="resultLocal"
                  name="resultLocal"
                  type="number"
                  variant="outlined"
                  {...formik.getFieldProps("resultLocal")}
                  {...textErrorHelper(formik, "resultLocal")}
                />
              </FormControl>
            </div>
            <div>
              <h4>Result away</h4>
              <FormControl error={selectIsError(formik, "away")}>
                <Select
                  id="away"
                  name="away"
                  variant="outlined"
                  displayEmpty
                  {...formik.getFieldProps("away")}
                >
                  <MenuItem value="" disabled>
                    Select a team
                  </MenuItem>
                  {showTeams()}
                </Select>
                {selectFormHelper(formik, "away")}
              </FormControl>
              <FormControl style={{ marginLeft: "10px" }}>
                <TextField
                  id="resultAway"
                  name="resultAway"
                  type="number"
                  variant="outlined"
                  {...formik.getFieldProps("resultAway")}
                  {...textErrorHelper(formik, "resultAway")}
                />
              </FormControl>
            </div>
            <hr />
            <div>
              <h4>Match info</h4>
              <div className="mb-5">
                <FormControl>
                  <TextField
                    id="referee"
                    variant="outlined"
                    name="referee"
                    placeholder="Add the referee name"
                    {...formik.getFieldProps("referee")}
                    {...textErrorHelper(formik, "referee")}
                  />
                </FormControl>
              </div>
              <div className="mb-5">
                <FormControl>
                  <TextField
                    id="stadium"
                    variant="outlined"
                    name="stadium"
                    placeholder="Add the stadium name"
                    {...formik.getFieldProps("stadium")}
                    {...textErrorHelper(formik, "stadium")}
                  />
                </FormControl>
              </div>
              <div className="mb-5">
                <FormControl error={selectIsError(formik, "result")}>
                  <Select
                    id="result"
                    name="result"
                    variant="outlined"
                    displayEmpty
                    {...formik.getFieldProps("result")}
                  >
                    <MenuItem value="" disabled>
                      Select a result
                    </MenuItem>
                    <MenuItem value="W">Win</MenuItem>
                    <MenuItem value="L">Lose</MenuItem>
                    <MenuItem value="D">Draw</MenuItem>
                    <MenuItem value="n/a">Non available</MenuItem>
                  </Select>
                  {selectFormHelper(formik, "result")}
                </FormControl>
              </div>
              <div className="mb-5">
                <FormControl error={selectIsError(formik, "final")}>
                  <Select
                    id="final"
                    name="final"
                    variant="outlined"
                    displayEmpty
                    {...formik.getFieldProps("final")}
                  >
                    <MenuItem value="" disabled>
                      Was the game played ?
                    </MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                  {selectFormHelper(formik, "final")}
                </FormControl>
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {formType === "add" ? "Add match" : "Edit match"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddEditMatches;
