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
  Card,
} from "antd";
import { PageTitle, Pagination } from "../../components";
import moment from "moment";
import { Link } from "react-router-dom";
import ProductModal from "./ProductModal";

const { Meta } = Card;

const { Option } = Select;
const dateFormat = "YYYY/MM/DD";
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function Products() {
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
    API.get("/api/products").then((result) => {
      if (result.status === 200) {
        console.log("result.data", result.data);
        setData(result.data);
        // setCurrentPage(currentPage);
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

  //   const { id, title, image, price, category } = product;

  return (
    <>
      <PageTitle title="Products" description="All Products" />
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
                    {/* <div className="col-lg-4" style={{ textAlign: "right" }}>
                      <Button
                        shape="round"
                        onClick={() => setVisible(true)}
                        icon={<PlusOutlined />}
                        size="large"
                        style={{ marginRight: 20 }}
                      >
                        Add Club
                      </Button>
                    </div> */}
                  </div>
                  <div className="cardgrid">
                    {data.map((product) => {
                      console.log(product);
                      return (
                        <Link to={`/product/${product.id}`}>
                          <Card
                            hoverable
                            style={{ width: 240 }}
                            cover={
                              <img
                                alt={product.title}
                                src={product.image}
                                className="cardImage"
                              />
                            }
                            bordered={true}
                          >
                            <Meta
                              title={product.title}
                              description={"$" + product.price}
                            />
                            <p>{product.category}</p>
                          </Card>
                        </Link>
                        // <div className="four wide column" key={product.id}>
                        //   <Link to={`/product/${product.id}`}>
                        //     <div className="ui link cards">
                        //       <div className="card">
                        //         <div className="image">
                        //           <img
                        //             src={product.image}
                        //             alt={product.title}
                        //           />
                        //         </div>
                        //         <div className="content">
                        //           <div className="header">{product.title}</div>
                        //           <div className="meta price">
                        //             {product.price}
                        //           </div>
                        //           <div className="meta">{product.category}</div>
                        //         </div>
                        //       </div>
                        //     </div>
                        //   </Link>
                        // </div>
                      );
                    })}
                  </div>
                  {/* <div className="table-responsive" style={{ marginTop: 10 }}>
                    <Table
                      className="table table-centered table-hover mb-0"
                      columns={columns}
                      dataSource={data}
                      pagination={false}
                      loading={loading}
                    />
                  </div> */}
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

      <ProductModal
        visible={visible}
        setVisible={(value) => setVisible(value)}
        clubData={currentClub}
        onClear={() => setCurrentClub({})}
        success={() => success()}
      />
    </>
  );
}

export default Products;
