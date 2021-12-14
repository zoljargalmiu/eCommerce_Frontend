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

function History() {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      id: 1,
      clubName: "MIU Rec Center",
      courtName: "Basketball #10",
      playerCount: "9/10",
      role: "ROLE_OWNER",
      gameDate: moment("2021/10/01", dateFormat),
    },
    {
      id: 2,
      clubName: "MIU Rec Center",
      courtName: "Tennis #2",
      playerCount: "2/6",
      role: "ROLE_OWNER",
      gameDate: moment("2021/10/01", dateFormat),
    },
    {
      id: 3,
      clubName: "MIU Rec Center",
      courtName: "Football #6",
      playerCount: "3/8",
      role: "ROLE_OWNER",
      gameDate: moment("2021/10/01", dateFormat),
    },
  ]);
  const [roles, setRoles] = useState([]);
  const [showNum, setShowNum] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("clubName");
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
      title: "Club name",
      dataIndex: "clubName",
      key: "clubName",
    },
    {
      title: "Court name",
      dataIndex: "courtName",
      key: "courtName",
    },
    {
      title: "Game date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => moment(text).format(dateFormat),
    },
    {
      title: "Attended players",
      dataIndex: "playerCount",
      key: "playerCount",
    },
  ];

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
      <PageTitle title="History" description="History" />
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
                        <Form.Item name="type" label="Field">
                          <Select
                            value={searchKey}
                            style={{ width: 300 }}
                            onChange={(val) => setSearchKey(val)}
                            allowClear
                          >
                            <Option value="clubName">Club Name</Option>
                            <Option value="courtName">Court Name</Option>
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
                      </Form>
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
    </>
  );
}

export default History;
