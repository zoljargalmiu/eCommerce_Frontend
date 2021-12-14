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
import ScheduleModal from "./ScheduleModal";

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

function Schedule() {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      id: 1,
      startDate: moment("2021/10/01", dateFormat),
      endDate: moment("2021/10/01", dateFormat),
    },
    {
      id: 2,
      startDate: moment("2021/10/01", dateFormat),
      endDate: moment("2021/10/01", dateFormat),
    },
  ]);
  const [roles, setRoles] = useState([]);
  const [showNum, setShowNum] = useState(50);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentSchedule, setCurrentSchedule] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("courtName");
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
      id: 1,
      title: "Start Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => moment(text).format(dateFormat),
    },
    {
      id: 2,
      title: "End Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => moment(text).format(dateFormat),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setCurrentSchedule(record);
              setVisible(true);
            }}
          >
            Edit
          </Button>
          <Space size="middle">
            <Popconfirm
              title="Delete this schedule?"
              onConfirm={() => confirm(record.id)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#" style={{ color: "red" }}>
                Delete Schedule
              </a>
            </Popconfirm>
          </Space>
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
      <PageTitle title="Manage Schedule" description="Schedule" />
      <div className="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div
                      className="col-lg-12"
                      style={{ textAlign: "right", paddingBottom: 20 }}
                    >
                      <Button
                        shape="round"
                        onClick={() => setVisible(true)}
                        icon={<PlusOutlined />}
                        size="large"
                      >
                        Create Schedule
                      </Button>
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

      <ScheduleModal
        visible={visible}
        setVisible={(value) => setVisible(value)}
        scheduleData={currentSchedule}
        onClear={() => setCurrentSchedule({})}
      />
    </>
  );
}

export default Schedule;
