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
import PlayersModal from "./PlayersModal.js";
import { PageTitle, Pagination } from "../../components";
import moment from "moment";
import { connect, useSelector } from "react-redux";

const { Option } = Select;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function Players() {
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [roles, setRoles] = useState([]);
  const [showNum, setShowNum] = useState(50);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlayer, setIsPlayer] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("firstName");
  const [searchValue, setSearchValue] = useState(null);
  const userData = useSelector((state) => state.authentication.user);
  const loggingIn = useSelector((state) => state.authentication.loggingIn);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchData(currentPage);
    fetchGetClubs();

    setIsPlayer(
      userData.roles.filter((item) => item.roleName === "PLAYER").length > 0
    );
  }, []);

  const success = () => {
    fetchData(currentPage);
  };

  const fetchGetClubs = () => {
    API.get("owner/myclubs").then((result) => {
      if (result.status === 200) {
        setClubs(result.data);
      }
    });
  };

  const fetchData = (currentPage) => {
    setLoading(true);
    API.get("owner/myplayers", {
      params: { page: currentPage, size: showNum },
    }).then((result) => {
      if (result.status === 200) {
        setData(result.data.myplayers);
        setCurrentPage(result.data.currentPage);
        setTotalPages(result.data.totalPages);
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
      title: "First name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Username",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Contact Number",
      dataIndex: "emergencyContactNumber",
      key: "emergencyContactNumber",
    },
    {
      title: "Blood Type",
      dataIndex: "bloodType",
      key: "bloodType",
    },
    // {
    //   title: "Birthdate",
    //   dataIndex: "birthDate",
    //   key: "birthDate",
    //   render: (text, record) => moment(text).format(dateFormat),
    // },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          {!isPlayer && (
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
          )}
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
        setData(result.data.content.content);
        setTotalPages(result.data.content.totalPages);
        setCurrentPage(1);
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
      <PageTitle title="Manage Players" description="All Players" />
      <div className="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    {/* <div className="col-lg-8">
                      <Form
                        layout="inline"
                        style={{ marginBottom: 10 }}
                        initialValues={{ type: searchKey }}
                      >
                        <Form.Item name="type" label="Field">
                          <Select
                            value={searchKey}
                            style={{ width: 300 }}
                            onChange={(val) => setSearchKey(val)}
                            allowClear
                          >
                            <Option value="lastName">Last Name</Option>
                            <Option value="firstName">First Name</Option>
                            <Option value="name">Username</Option>
                            <Option value="role">User role</Option>
                            <Option value="email">Email</Option>
                          </Select>
                        </Form.Item>
                        {searchKey === "role" ? (
                          <Form.Item name="name" label="Search value">
                            <Select
                              style={{ width: 300 }}
                              onChange={(val) => setSearchValue(val)}
                              allowClear
                            >
                              <Option key="player" value="player">
                                Player
                              </Option>
                              <Option key="owner" value="owner">
                                Owner
                              </Option>
                            </Select>
                          </Form.Item>
                        ) : (
                          <Form.Item name="name" label="Search Value">
                            <Input
                              onChange={(e) => setSearchValue(e.target.value)}
                            />
                          </Form.Item>
                        )}
                        <Form.Item {...tailLayout}>
                          <Button type="primary" onClick={() => onFinish()}>
                            Search
                          </Button>
                        </Form.Item>
                      </Form>
                    </div> */}
                    {!isPlayer && (
                      <div className="col-lg-12" style={{ textAlign: "right" }}>
                        <Button
                          shape="round"
                          onClick={() => setVisible(true)}
                          icon={<PlusOutlined />}
                          size="large"
                        >
                          Add Player
                        </Button>
                      </div>
                    )}
                  </div>
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

      <PlayersModal
        visible={visible}
        setVisible={(value) => setVisible(value)}
        userData={currentUser}
        clubs={clubs}
        success={() => success()}
        onClear={() => setCurrentUser({})}
      />
    </>
  );
}

export default Players;
