import React, { useState, useEffect } from "react";
import { API, cookies } from "../../_helpers/service";
import { PlusOutlined } from "@ant-design/icons";
import {
  Table,
  notification,
  Space,
  Popconfirm,
  Modal,
  Button,
  Form,
  Select,
  Input,
  message,
} from "antd";
import UserModal from "./UserModal.js";
import { PageTitle, Pagination } from "../../components";
import moment from "moment";
import { connect, useSelector } from "react-redux";

const { Option } = Select;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function Users() {
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [roles, setRoles] = useState([]);
  const [showNum, setShowNum] = useState(50);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("firstName");
  const [searchValue, setSearchValue] = useState(null);
  const userData = useSelector((state) => state.authentication.user);
  const loggingIn = useSelector((state) => state.authentication.loggingIn);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchData(currentPage);
    fetchGetRoles();
    fetchGetClubs();
  }, []);

  const fetchGetRoles = () => {
    API.get("/roles").then((result) => {
      if (result.status === 200) {
        console.log(result.data);
        setRoles(result.data);
      }
    });
  };

  const fetchGetClubs = () => {
    API.get("club/all").then((result) => {
      if (result.status === 200) {
        setClubs(result.data);
      }
    });
  };

  const fetchData = (currentPage) => {
    setLoading(true);
    API.get("/api/users", {
      // params: { page: currentPage, size: showNum },
    }).then((result) => {
      console.log("result", result);
      if (result.status === 200) {
        setData(result.data);
        // setCurrentPage(result.data.currentPage);
        // setTotalPages(result.data.totalPages);
        setLoading(false);
      }
    });
  };

  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      render: (text, row, index) => <>{currentPage * showNum + index + 1}</>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    // {
    //   title: "Address",
    //   dataIndex: "address",
    //   key: "address",
    //   // render: (text, record) => text.map((item) => item.name).join(", "),
    // },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <a
            href="#"
            style={{
              marginRight: 15,
            }}
            onClick={() => {
              setVisible(true);
              setCurrentUser(record);
            }}
          >
            Edit User
          </a>
          {/* <Space size="middle">
            <Popconfirm
              title="Disable this user?"
              onConfirm={() => confirm(record.id)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#" style={{ color: "red" }}>
                Disable User
              </a>
            </Popconfirm>
          </Space> */}
        </>
      ),
    },
  ];

  const confirm = (userId) => {
    deleteUser(userId);
  };

  const cancel = (e) => {
    console.log(e);
  };

  const deleteUser = (userId) => {
    API.delete(`user/delete/${userId}`).then((result) => {
      if (result.status === 200) {
        fetchData(1);

        notification["success"]({
          message: "Success",
          description: result.data.message,
        });
      }
    });
  };

  const onFinish = () => {
    setLoading(true);
    API.post(
      //`user/${userId}`,
      {
        key: searchKey,
        value: searchValue,
        operation: "LIKE",
      },
      { params: { page: 0, size: showNum } }
    ).then((result) => {
      if (result.status === 200) {
        // setData(result.data.content.content);
        // setTotalPages(result.data.content.totalPages);
        // setCurrentPage(1);
        setLoading(false);
      }
    });
  };

  const prevPage = () => {
    fetchData(currentPage - 1);
  };

  const nextPage = () => {
    fetchData(currentPage + 1);
  };

  const changePage = (num) => {
    fetchData(num);
  };

  return (
    <>
      <PageTitle title="Manage Users" description="All Users" />
      <div className="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive" style={{ marginTop: 10 }}>
                    <Table
                      className="table table-centered table-hover mb-0"
                      columns={columns}
                      dataSource={data}
                      pagination={false}
                      loading={loading}
                    />
                  </div>

                  <Pagination
                    current={currentPage}
                    totalPages={totalPages}
                    prevAction={prevPage}
                    nextAction={nextPage}
                    changeAction={(num) => changePage(num)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserModal
        visible={visible}
        setVisible={(value) => setVisible(value)}
        userData={currentUser}
        roles={roles}
        clubs={clubs}
        onClear={() => setCurrentUser({})}
        success={() => {
          fetchData(0);
          setCurrentPage(0);
        }}
      />
    </>
  );
}

export default Users;
