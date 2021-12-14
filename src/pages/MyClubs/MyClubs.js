import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components";
import { Card, Col, Row, Spin } from "antd";
import { API } from "../../_helpers/service";
import { Link } from "react-router-dom";
// import dragonclub from "../../assets/images/dragonclub.jpg";
import { connect, useSelector } from "react-redux";

const { Meta } = Card;
function MyClubs() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const userData = useSelector((state) => state.authentication.user);

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const fetchData = (currentPage) => {
    const isPlayer =
      userData.roles.filter((item) => item.roleName === "PLAYER").length > 0;
    API.get(
      `${isPlayer ? "player" : "owner"}/myclubs`
      // {
      //   key: searchKey,
      //   value: searchValue,
      //   operation: "LIKE",
      // },
      //{ params: { page: currentPage - 1, size: showNum } }
    ).then((result) => {
      if (result.status === 200) {
        setData(result.data);
        setCurrentPage(currentPage);
        // setTotalPages(result.data.content.totalPages);
        setLoading(false);
      }
    });
  };

  return (
    <>
      <PageTitle title="My Clubs" />
      <div className="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <Spin spinning={loading}>
                <Row gutter={16}>
                  {data.map((club) => (
                    <Col span={4}>
                      <Link to={`/club/${club.clubId}`}>
                        <Card
                          hoverable
                          style={{ marginBottom: 16 }}
                          cover={<img src="" height="200" width="200" />}
                        >
                          <Meta
                            title={club.name}
                            description={club.description}
                          />
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyClubs;
