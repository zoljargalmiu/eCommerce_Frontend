import React, { useState, useEffect } from "react";
import { API } from "../../_helpers/service";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Table,
  notification,
  Space,
  Popconfirm,
  Modal,
  Button,
  DatePicker,
  Form,
  Select,
  Upload,
  Spin,
  Input,
  message,
  TreeSelect,
} from "antd";
import { connect } from "react-redux";
import { userActions, alertActions } from "../../_actions";
import { PageTitle, Pagination } from "../../components";
import moment from "moment";

const { TreeNode } = TreeSelect;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function UsersDeactivated() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showNum, setShowNum] = useState(50);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("firstName");
  const [searchValue, setSearchValue] = useState(null);

  useEffect(() => {
    fetchData(currentPage);
    fetchGetRoles();
  }, []);

  const fetchGetRoles = () => {
    API.get("settings/roles").then((result) => {
      if (result.status === 200) {
        setRoles(result.data.content);
      }
    });
  };

  const fetchData = (currentPage) => {
    API.get(
      "users/offline",
      {
        key: searchKey,
        value: searchValue,
        operation: "LIKE",
      },
      { params: { page: currentPage - 1, size: showNum } }
    ).then((result) => {
      if (result.status === 200) {
        setData(result.data.content.content);
        setCurrentPage(currentPage);
        setTotalPages(result.data.content.totalPages);
        setLoading(false);
      }
    });
  };

  const columns = [
    {
      title: "???",
      dataIndex: "id",
      key: "id",
      render: (text, row, index) => (
        <>{(currentPage - 1) * showNum + index + 1}</>
      ),
    },
    {
      title: "???????? ??????",
      dataIndex: "age",
      key: "age",
      render: (text, record) => (
        <a>{record.lastName + ". " + record.firstName}</a>
      ),
    },
    {
      title: "???????????????????????? ??????",
      dataIndex: "username",
      key: "username",
      render: (text, record) => <Link to={`/user/${record.id}`}>{text}</Link>,
    },
    {
      title: "??????????",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "????????????",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="???????????????? ???????????? ?????"
            onConfirm={() => confirmActive(record.id)}
            onCancel={cancel}
            okText="????????"
            cancelText="????????"
          >
            <a href="#">???????????????? ????????????</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const confirm = (userId) => {
    deleteUser(userId);
  };

  const confirmActive = (userId) => {
    activeUser(userId);
  };

  const cancel = (e) => {
    console.log(e);
  };

  const deleteUser = (userId) => {
    API.delete(`user/delete/${userId}`).then((result) => {
      if (result.status === 200) {
        fetchData(1);

        notification["success"]({
          message: "??????????????????",
          description: result.data.message,
        });
      }
    });
  };

  const activeUser = (userId) => {
    API.post(`user/activate/${userId}`).then((result) => {
      if (result.status === 200) {
        fetchData(1);

        notification["success"]({
          message: "??????????????????",
          description: result.data.message,
        });
      }
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        registerUser(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
    // setVisible(false);
  };

  const registerUser = (values) => {
    setConfirmLoading(true);
    API.post("auth/signup", {
      username: values.username,
      email: values.email,
      password: values.password,
      registerNumber: values.registerNumber,
      firstName: values.firstName,
      lastName: values.lastName,
      roles: values.role,
    })
      .then((result) => {
        if (result.status === 200) {
          if (result.data.success) {
            notification["success"]({
              message: "??????????????????",
              description: result.data.message,
            });
            setVisible(false);
          } else {
            message.error(result.data.message);
          }
        }
        setConfirmLoading(false);
      })
      .catch((error) => {
        const result = error.response;
        if (result.status === 400) {
          if (result.data.errors !== undefined) {
            if (result.data.errors.length > 0) {
              message.error(result.data.errors[0].defaultMessage);
            } else {
              message.error("?????????? ????????????");
            }
          } else {
            message.error(result.data.message);
          }
        }
      });
  };

  const onFinish = () => {
    setLoading(true);
    API.post(
      "users",
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
      <PageTitle
        title="?????????????????????????? ????????????????"
        description="?????????????????? ???????? ?????????????????????????? ????????????????"
        right={
          <Button
            shape="round"
            onClick={() => setVisible(true)}
            icon={<PlusOutlined />}
            size="large"
          >
            ?????????????????? ??????????
          </Button>
        }
      />
      <div className="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-8">
                      <Form
                        layout="inline"
                        style={{ marginBottom: 10 }}
                        initialValues={{ type: searchKey }}
                      >
                        <Form.Item name="type" label="????????????">
                          <Select
                            value={searchKey}
                            style={{ width: 300 }}
                            onChange={(val) => setSearchKey(val)}
                            allowClear
                          >
                            <Option value="lastName">????????</Option>
                            <Option value="firstName">???????????? ??????</Option>
                            <Option value="username">???????????????????????? ??????</Option>
                            <Option value="role">???????????????????????? ??????</Option>
                            <Option value="email">??????????</Option>
                          </Select>
                        </Form.Item>
                        {searchKey === "role" ? (
                          <Form.Item name="name" label="???????? ????????">
                            <Select
                              style={{ width: 300 }}
                              onChange={(val) => setSearchValue(val)}
                              allowClear
                            >
                              {roles.map((role) => (
                                <Option key={role.id} value={role.id}>
                                  {role.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        ) : (
                          <Form.Item name="name" label="???????? ????????">
                            <Input
                              onChange={(e) => setSearchValue(e.target.value)}
                            />
                          </Form.Item>
                        )}
                        <Form.Item {...tailLayout}>
                          <Button type="primary" onClick={() => onFinish()}>
                            ????????
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                  <div className="table-responsive">
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

      <Modal
        title="?????????????????? ??????????"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="??????????"
        cancelText="??????????"
        width={720}
        confirmLoading={confirmLoading}
      >
        <Form
          {...formItemLayout}
          form={form}
          initialValues={{ bookCondition: "NEW" }}
        >
          <Form.Item
            label="????????"
            name="lastName"
            rules={[{ required: true, message: "?????? ?????????????? ????!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="??????"
            name="firstName"
            rules={[{ required: true, message: "?????? ?????????????? ????!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="?????????????????? ??????" name="role">
            <Select
              placeholder="?????????????? ????"
              showSearch
              allowClear
              mode="multiple"
              style={{ width: "100%" }}
            >
              <Option value="ROLE_ADMIN">??????????</Option>
              <Option value="ROLE_DRIVER">????????????</Option>
              <Option value="ROLE_LIBRARIAN">?????????? ????????</Option>
              <Option value="ROLE_TEACHER">????????</Option>
              <Option value="ROLE_KITCHEN">????????????</Option>
              <Option value="ROLE_EMPLOYEE">??????????????</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="???????????????????????? ??????"
            name="username"
            rules={[
              { required: true, message: "???????????????????????? ?????? ?????????????? ????!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="???????? ????"
            name="password"
            rules={[{ required: true, message: "???????? ???? ?????????????? ????!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="?????????? ????????"
            name="email"
            rules={[{ required: true, message: "?????????? ???????? ?????????????? ????!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="???????????????????? ????????????"
            name="registerNumber"
            rules={[
              { required: true, message: "???????????????????? ???????????? ?????????????? ????!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function mapState(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return { user, users };
}

const actionCreators = {
  getUsers: userActions.getAll,
  deleteUser: userActions.delete,
};

const connectedUsers = connect(mapState, actionCreators)(UsersDeactivated);
export { connectedUsers as UsersDeactivated };
