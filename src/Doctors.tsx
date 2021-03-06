import React, { useEffect, useState } from "react";
import {
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Chip,
  Box,
  Select,
  OutlinedInput,
} from "@material-ui/core";
import { ReactStateDeclaration } from "@uirouter/react";
import { $crud } from "./factories/CrudFactory";
import { UserType } from "./types";
import { MoreVertical } from "react-feather";
import moment from "moment";
import { Pagination } from "@material-ui/lab";
import classNames from "classnames";
import Autocomplete from "@material-ui/lab/Autocomplete";

export function Doctors() {
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [doctors, setDoctors] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [doctor, setDoctor] = useState<UserType>(null);
  const [searchValue, setSearchValue] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();
  let [status, setStatus] = useState<string>("");

  const close = () => {
    setAnchorEl(null);
  };

  const getCountryList = async () => {
    try {
      setLoading(true);
      const data = await $crud.get("get/countryname", {});
      setCountryList(data.data);
    } finally {
      setLoading(false);
    }
  };

  const getDoctors = async () => {
    try {
      setLoading(true);
      let cond = {};
      if (status === "") {
        cond = { role_id: "doctor", search: searchValue };
      } else {
        cond = { role_id: "doctor", search: searchValue, status: status };
      }
      const data = await $crud.post("user/list", {
        page,
        limit,
        cond: cond,
      });
      setDoctors(data.data);
      setPage(data.page);
      setTotalPage(data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (e) => {
    await setStatus(e.target.value);

    status = e.target.value;
    if (status == "") {
      getDoctors();
    } else if (status == "enable") {
      getDoctors();
    } else if (status == "disable") {
      getDoctors();
    } else {
      console.log("1111");
    }
  };

  const searchData = async (e) => {
    await setSearchValue(e.target.value);

    if (searchValue !== "") {
      getDoctors();
    }
  };

  const approved = async (id) => {
    try {
      setLoading(true);
      await $crud.put("user/admin/doctorApprove", { id });
    } finally {
      setLoading(false);
      getDoctors();
    }
  };

  useEffect(() => {
    getDoctors();
    getCountryList();
  }, [page, limit, totalPage]);

  return (
    <Grid className="p-3" container direction="column" wrap="nowrap">
      <Grid container wrap="nowrap" direction="column" component={Paper}>
        <Grid container alignItems="center" className="p-2-all">
          <Typography
            variant="h6"
            component={Grid}
            item
            xs
            className="font-weight-bold pl-3"
          >
            Doctors List
          </Typography>
          <Grid item xs md={4}>
            <TextField
              fullWidth
              label="Search"
              name="searchValue"
              value={searchValue}
              onChange={searchData}
              variant="outlined"
              size="small"
              color="primary"
            />
          </Grid>
          <Grid item xs md={4}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={handleChangeStatus}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="enable">Approved</MenuItem>
              <MenuItem value="disable">Not Approved</MenuItem>
            </Select>
          </Grid>
          {/* <Grid item xs md={4}> */}
          {/* <Select
              fullWidth
              label="Select Country Name"
              variant="outlined"
              color="primary"
              name="selectedCountry"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countryList.map((item, i) => (
                <MenuItem key={i} value={item.countyName}>
                  {item.countyName}
                </MenuItem>
              ))}
            </Select> */}
          {/* <Autocomplete
              id="size-small-standard"
              size="small"
              options={countryList}
              getOptionLabel={(option) => option.countyName}
              defaultValue={countryList[13]}
              onChange={(e) => setSelectedCountry("country", e.target.value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Country-List"
                  placeholder="Country-List"
                />
              )}
            /> */}
          {/* </Grid> */}
        </Grid>
        {loading && <LinearProgress />}
        <Grid className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Profile Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>D.O.B</th>
                <th>Fax</th>
                <th>Mobile No.</th>
                <th>Status</th>
                <th>CreatedAt</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((data, i) => (
                <tr key={i} style={{ verticalAlign: "middle" }}>
                  <td>{i + 1}</td>
                  <td className="text-center">
                    <img
                      src={
                        data.profile_photo ||
                        require("assets/images/default.png")
                      }
                      className="border"
                      style={{ width: 50, height: 50, objectFit: "contain" }}
                    />
                  </td>
                  <td>
                    {data.firstname} {data.lastname}
                  </td>
                  <td>{data.email}</td>
                  <td>{data.dob}</td>
                  <td>{data.fax}</td>
                  <td>{data.phone}</td>
                  <td
                    className={classNames(
                      data["status"] === "enable"
                        ? "text-success"
                        : "text-danger"
                    )}
                  >
                    {data["status"] === "enable" ? "Approved" : "Not Approved"}
                  </td>
                  <td>{moment(data.createdAt).format("DD-mm-YYYY HH:mm")}</td>
                  <td className="text-right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setDoctor(data);
                      }}
                    >
                      <MoreVertical size={16} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Grid>
        <Menu anchorEl={anchorEl} open={open} onClose={close}>
          <MenuItem onClick={close}>View</MenuItem>
          <MenuItem
            disabled={doctor?.isApproved}
            onClick={() => {
              approved(doctor._id);
              close();
            }}
          >
            Approve
          </MenuItem>
          <MenuItem onClick={close}>Delete</MenuItem>
        </Menu>
        <Grid container justify="flex-end" className="p-2">
          <Pagination
            count={totalPage}
            page={page}
            onChange={(e, page) => setPage(page)}
            variant="outlined"
            shape="rounded"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export const states: ReactStateDeclaration[] = [
  {
    url: "/doctors",
    name: "doctors",
    data: {
      title: "Doctors List",
      loggedIn: true,
    },
    component: Doctors,
  },
];
