import "./NewEmployee.css";
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
import { addEmployee } from "../../app/slices/employeeListSlice";
import dayjs from "dayjs";
import { setDepartments, setUSstates } from "../../app/slices/selectDataSlice";
import EmployeeModal from "nino-react-modal";

/**
 * Display the employee creation page.
 * @component
*/
export default function NewEmployee() {
  const dispatch = useDispatch();
  const today = dayjs();

  const USstateList = useSelector((state) => state.selectData.USstates);
  const departmentList = useSelector((state) => state.selectData.departments);

  const [employee, setEmployee] = useState({});
  const [USstate, setUSstate] = useState("");
  const [department, setDepartment] = useState("");
  const [birthday, setBirthday] = useState(today.year(today.year() - 16));
  const [startDate, setStartDate] = useState(today);
  const [modal, setModal] = useState(false);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [streetError, setStreetError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const zipCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
  const [zipCodeError, setZipCodeError] = useState(false);

  useEffect(() => {
    document.title = "HRNet – Add an employee";
  }, []);

  useEffect(() => {
    const fetchData = async (URL, action, setFirst) => {
      try {
        const response = await fetch(URL);
        const JSONData = await response.json();
        dispatch(action(JSONData));
        setFirst(JSONData[0]);
      } catch (error) {
        console.log(error);
      }
    };

    if (USstateList.length === 0) {
      fetchData("./USstates.json", setUSstates, setUSstate);
    } else if (USstate === "") {
      setUSstate(USstateList[0]);
    }
    if (departmentList.length === 0) {
      fetchData("./departments.json", setDepartments, setDepartment);
    } else if (department === "") {
      setDepartment(departmentList[0]);
    }
  }, [USstateList, departmentList, USstate, department, dispatch]);

  const testFormValue = (property, setError) => {
    if (!property) {
      setError(true);
    } else if (setError === setZipCodeError && !zipCodeRegex.test(property)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const employee = Object.fromEntries(formData.entries());
    console.log(employee);
    employee.state = USstate;
    employee.department = department;
    employee.birthday = dayjs(birthday).toISOString();
    employee.startDate = dayjs(startDate).toISOString();

    if (
      employee.firstName &&
      employee.lastName &&
      employee.street &&
      employee.city &&
      zipCodeRegex.test(employee.zipCode)
    ) {
      dispatch(addEmployee(employee));
      setEmployee(employee);
      setModal(true);
    }
  };

  return (
    <div className="newEmployee">
      <Header />
      <h1 className="newEmployee-title">Add an employee</h1>
      <form className="newEmployee-form" onSubmit={handleSubmit}>
        <Card title="Personal information">
          <div className="newEmployee-contentRow">
            <TextField
              sx={{ width: "100%" }}
              name="firstName"
              label="First name"
              variant="outlined"
              error={firstNameError}
              helperText={firstNameError && "Please enter a first name."}
              onBlur={(event) =>
                testFormValue(event.target.value, setFirstNameError)
              }
              onChange={(event) =>
                testFormValue(event.target.value, setFirstNameError)
              }
            />
            <TextField
              sx={{ width: "100%" }}
              name="lastName"
              label="Last name"
              variant="outlined"
              error={lastNameError}
              helperText={lastNameError && "Please enter a last name."}
              onBlur={(event) =>
                testFormValue(event.target.value, setLastNameError)
              }
              onChange={(event) =>
                testFormValue(event.target.value, setFirstNameError)
              }
            />
            <DatePicker
              sx={{ width: "100%" }}
              label="Birthday"
              value={birthday}
              onChange={(newBirthday) => setBirthday(newBirthday)}
              maxDate={today.year(today.year() - 16)}
            />
          </div>
        </Card>
        <Card title="Address">
          <div className="newEmployee-contentRow">
            <TextField
              sx={{ width: "100%" }}
              name="street"
              label="Street"
              variant="outlined"
              error={streetError}
              helperText={streetError && "Please enter a street."}
              onBlur={(event) =>
                testFormValue(event.target.value, setStreetError)
              }
              onChange={(event) =>
                testFormValue(event.target.value, setStreetError)
              }
            />
            <TextField
              sx={{ width: "100%" }}
              name="city"
              label="City"
              variant="outlined"
              error={cityError}
              helperText={cityError && "Please enter a city."}
              onBlur={(event) => testFormValue(event.target.value, setCityError)}
              onChange={(event) => testFormValue(event.target.value, setCityError)}
            />
          </div>
          <div className="newEmployee-contentRow">
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="stateSelect">State</InputLabel>
              <Select
                name="state"
                labelId="stateSelect"
                value={USstate}
                onChange={(event) => setUSstate(event.target.value)}
                label="State"
              >
                {USstateList.map((state) => (
                  <MenuItem value={state} key={state.abbreviation}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              sx={{ width: "100%" }}
              name="zipCode"
              label="Zip code"
              variant="outlined"
              error={zipCodeError}
              helperText={zipCodeError && "Please enter a valid US zip code."}
              onBlur={(event) =>
                testFormValue(event.target.value, setZipCodeError)
              }
              onChange={(event) =>
                testFormValue(event.target.value, setZipCodeError)
              }
            />
          </div>
        </Card>
        <Card title="Company information">
          <div className="newEmployee-contentRow">
            <DatePicker
              name="startDate"
              sx={{ width: "100%" }}
              label="Start date"
              value={startDate}
              onChange={(newStartDate) => setStartDate(newStartDate)}
            />
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="departmentSelect">Department</InputLabel>
              <Select
                name="department"
                labelId="departmentSelect"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                label="Department"
              >
                {departmentList.map((department) => (
                  <MenuItem
                    value={department}
                    key={departmentList.indexOf(department)}
                  >
                    {department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Card>
        <button className="newEmployee-submitButton" type="submit">
          Create employee
        </button>
      </form>

      {modal && (
      <EmployeeModal
        open={modal}
        onClose={() => setModal(false)}
        containerClass="modal-container"
        closeClass="modal-close"
      >
        <h2 className="modal-title">Employee created!</h2>
        <p className="modal-text">
          {employee.firstName} {employee.lastName} in {employee.department}
        </p>
        <p className="modal-text">{employee.street}</p>
        <p className="modal-text">
          {employee.city}, {employee.state.name} – {employee.zipCode}
        </p>
        <p className="modal-text">Born on {dayjs(employee.birthday).format("MMMM D YYYY")}</p>
        <p className="modal-text">Started on {dayjs(employee.startDate).format("MMMM D YYYY")}</p>
      </EmployeeModal>
      )}
    </div>
  );
}
