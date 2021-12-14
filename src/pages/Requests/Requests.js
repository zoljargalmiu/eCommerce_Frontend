import React, { useState, useEffect } from "react";
import { API } from "../../_helpers/service";
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
import { PageTitle, Pagination } from "../../components";
import moment from "moment";

const { Option } = Select;
const dateFormat = "YYYY/MM/DD";
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function ManageRequest() {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      id: 1,
      firstName: "Zoljargal",
      lastName: "Byambasuren",
      username: "zoloo",
      email: "zbyambasuren@miu.edu",
      role: "ROLE_OWNER",
      expireDate: moment("2021/10/01", dateFormat),
    },
    {
      id: 2,
      firstName: "Tuguldur",
      lastName: "Ulam-Undrakh",
      username: "tuguldur",
      email: "tulamundrakh@miu.edu",
      role: "ROLE_PLAYER",
      expireDate: moment("2021/10/01", dateFormat),
    },
  ]);

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
  }, []);

  const fetchData = (currentPage) => {
    API.post(
      "users",
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
      title: "№",
      dataIndex: "id",
      key: "id",
      render: (text, row, index) => (
        <>{(currentPage - 1) * showNum + index + 1}</>
      ),
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "First name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Requested Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => moment(text).format(dateFormat),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => approveRequest(record.id)}>
            Approve
          </Button>
          <Space size="middle">
            <Popconfirm
              title="Cancel this request?"
              onConfirm={() => confirm(record.id)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#" style={{ color: "red" }}>
                Cancel
              </a>
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

  const approveRequest = (id) => {
    console.log(id);
  };

  const confirm = (userId) => {
    deleteUser(userId);
  };

  const cancel = (e) => {
    console.log(e);
  };

  const deleteUser = (userId) => {
    API.delete(`request/delete/${userId}`).then((result) => {
      if (result.status === 200) {
        fetchData(1);

        notification["success"]({
          message: "Success",
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
              message: "Success",
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
              message.error("Failed!");
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
      <PageTitle title="Manage Request" description="All Request" />
      <div className="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
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
        title="Add Request"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
        cancelText="Cancel"
        width={720}
        confirmLoading={confirmLoading}
      >
        <Form
          {...formItemLayout}
          form={form}
          initialValues={{ role: "ROLE_OWNER" }}
        >
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please fill out this field!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please fill out this field!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Roles" name="role">
            <Select
              placeholder="Select"
              showSearch
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="ROLE_PLAYER">Player</Option>
              <Option value="ROLE_OWNER">Owner</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please fill out username field!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please fill out password field!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please fill out email field!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please fill out phone field!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ManageRequest;
