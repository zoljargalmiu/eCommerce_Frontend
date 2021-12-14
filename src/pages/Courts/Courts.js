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
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CourtModal from "./CourtModal";
import AllCourts from "./AllCourts";
import { Link } from "react-router-dom";

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function Courts() {
  let params = useParams();
  const { clubID } = params;
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [showNum, setShowNum] = useState(50);
  const [isClubOwner, setIsClubOwner] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentCourt, setCurrentCourt] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("courtName");
  const [searchValue, setSearchValue] = useState(null);
  const userData = useSelector((state) => state.authentication.user);

  useEffect(() => {
    fetchData(currentPage);
    fetchGetClubs();

    setIsClubOwner(
      userData.roles.filter((item) => item.roleName === "CLUBOWNER").length > 0
    );
  }, []);

  const fetchGetClubs = () => {
    API.get("club/all").then((result) => {
      if (result.status === 200) {
        setClubs(result.data);
      }
    });
  };

  const fetchData = () => {
    setLoading(true);
    API.get(`hall/byclub/${clubID}`).then((result) => {
      if (result.status === 200) {
        setData(result.data);
        // setCurrentPage(currentPage);
        // setTotalPages(result.data.content.totalPages);
        setLoading(false);
      }
    });
  };

  const success = () => {
    fetchData();
  };

  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      render: (text, row, index) => <>{index + 1}</>,
    },
    {
      title: "Court Name",
      dataIndex: "name",
      key: "name",
      render: (text, row, index) => (
        <Link to={`/calendar/${row.hallId}`}>{text}</Link>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Max Player",
      dataIndex: "maxPlayer",
      key: "maxPlayer",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setCurrentCourt(record);
              setVisible(true);
            }}
          >
            Edit
          </Button>
          {/* <Space size="middle">
            <Popconfirm
              title="Delete this court?"
              onConfirm={() => confirm(record.id)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#" style={{ color: "red" }}>
                Delete Court
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

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        //registerUser(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
    // setVisible(false);
  };

  // const registerUser = (values) => {
  //   setConfirmLoading(true);
  //   API.post("auth/signup", {
  //     username: values.username,
  //     email: values.email,
  //     password: values.password,
  //     registerNumber: values.registerNumber,
  //     firstName: values.firstName,
  //     lastName: values.lastName,
  //     roles: values.role,
  //   })
  //     .then((result) => {
  //       if (result.status === 200) {
  //         if (result.data.success) {
  //           notification["success"]({
  //             message: "Success",
  //             description: result.data.message,
  //           });
  //           setVisible(false);
  //         } else {
  //           message.error(result.data.message);
  //         }
  //       }
  //       setConfirmLoading(false);
  //     })
  //     .catch((error) => {
  //       const result = error.response;
  //       if (result.status === 400) {
  //         if (result.data.errors !== undefined) {
  //           if (result.data.errors.length > 0) {
  //             message.error(result.data.errors[0].defaultMessage);
  //           } else {
  //             message.error("Failed!");
  //           }
  //         } else {
  //           message.error(result.data.message);
  //         }
  //       }
  //     });
  // };

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

  if (!isClubOwner) return <AllCourts clubID={clubID} />;

  return (
    <>
      <PageTitle title="Manage Courts" description="All Courts" />
      <div className="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-8">
                      {/* <Form
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
                            <Option value="courtName">Court Name</Option>
                            <Option value="category">Category</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item name="name" label="Search Value">
                          <Input
                            onChange={(e) => setSearchValue(e.target.value)}
                          />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                          <Button type="primary" onClick={() => onFinish()}>
                            Search
                          </Button>
                        </Form.Item>
                      </Form> */}
                    </div>
                    <div className="col-lg-4" style={{ textAlign: "right" }}>
                      <Button
                        shape="round"
                        onClick={() => setVisible(true)}
                        icon={<PlusOutlined />}
                        size="large"
                        style={{ marginRight: 20 }}
                      >
                        Add Courts
                      </Button>
                    </div>
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

      <CourtModal
        visible={visible}
        setVisible={(value) => setVisible(value)}
        courtData={currentCourt}
        clubs={clubs}
        clubID={clubID}
        success={() => success()}
        onClear={() => setCurrentCourt({})}
        success={() => {
          fetchData(0);
          setCurrentPage(0);
        }}
        clubId={clubID}
      />
    </>
  );
}

export default Courts;
