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
import ClubModal from "./ClubModal";

const { Option } = Select;
const dateFormat = "YYYY/MM/DD";
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function Clubs() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [currentClub, setCurrentClub] = useState({});
  const [showNum, setShowNum] = useState(50);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("clubName");
  const [searchValue, setSearchValue] = useState(null);

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const fetchData = (currentPage) => {
    API.get(
      "/api/users"
      // {
      //   key: searchKey,
      //   value: searchValue,
      //   operation: "LIKE",
      // },
      //{ params: { page: currentPage - 1, size: showNum } }
    ).then((result) => {
      if (result.status === 200) {
        console.log("result.data", result.data);
        setData(result.data);
        setCurrentPage(currentPage);
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
    //   title: "Action",
    //   key: "action",
    //   render: (text, record) => (
    //     <>
    //       <a
    //         href="#"
    //         style={{
    //           marginRight: 15,
    //         }}
    //         onClick={() => {
    //           setVisible(true);
    //           setCurrentClub(record);
    //         }}
    //       >
    //         Edit Club
    //       </a>
    //       <Space size="middle">
    //         <Popconfirm
    //           title="Disable this user?"
    //           onConfirm={() => confirm(record.id)}
    //           onCancel={cancel}
    //           okText="Yes"
    //           cancelText="No"
    //         >
    //           <a href="#" style={{ color: "red" }}>
    //             Disable Clubs
    //           </a>
    //         </Popconfirm>
    //       </Space>
    //     </>
    //   ),
    // },
  ];

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

  return (
    <>
      <PageTitle title="Manage Clubs" description="All Clubs" />
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
                            <Option value="clubName">Club Name</Option>
                            <Option value="address">Address</Option>
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
                        Add Club
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

                  {/* <Pagination
                    current={currentPage}
                    totalPages={totalPages}
                    prevAction={prevPage}
                    nextAction={nextPage}
                    changeAction={(num) => changePage(num)}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ClubModal
        visible={visible}
        setVisible={(value) => setVisible(value)}
        clubData={currentClub}
        onClear={() => setCurrentClub({})}
        success={() => success()}
      />
    </>
  );
}

export default Clubs;
