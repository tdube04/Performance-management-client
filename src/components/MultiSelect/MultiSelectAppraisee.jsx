import React, { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import axiosClient from "../../authentication/axios-client";
import swal from "sweetalert";
import { useStateContext } from "../../context/ContextProvider";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SelectAppraisee() {
  const [personName, setPersonName] = useState("");
  const [users, setUsers] = useState([]);
  const {
    userName,
    setUserName,
    userType,
    setUserType,
    profileData,
    setProfileData,
  } = useStateContext();

  useEffect(() => {
    axiosClient.get(`/searchUserByDivision?Division=${profileData.divisionName}`).then((response) => {
      console.log(response.data);
      setUsers(response.data.content);
    });
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(personName);

    if (personName) {
      axiosClient
        .put("/assignUserAppraisees", null, {
          params: {
            appraiseeEmail: personName,
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data === "Unable to assign") {
            swal({
              text: "Appraisee already Assigned",
              icon: "error",
              button: "OK!",
            });
          } else if (response.data === "successfully assigned") {
            swal({
              text: "Appraisee Assigned Successfully",
              icon: "success",
              button: "OK!",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          swal({
            text: error.response.data,
            icon: "error",
            button: "OK!",
          });
        });
    }
  };

  return (
    <div>
      <label>Select Appraisee</label>
      <FormControl sx={{ m: 1, width: 400 }}>
        {/* <InputLabel id="demo-multiple-checkbox-label">Name</InputLabel> */}

        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected}
          MenuProps={MenuProps}
        >
          {users &&
            users.filter(user => user.username !== userName).map((user, index) => (
              <MenuItem sx={{ width: 400 }} key={index} value={user.username}>
                {user.name} {user.surname} - {user.username}
              </MenuItem>
            ))}
        </Select>
        <div className="btn-addPillar">
          <button
            className="pillar-btn"
            onClick={handleSubmit}
            style={{ borderRadius: "25px" }}
          >
            Save
          </button>
        </div>
      </FormControl>
    </div>
  );
}
