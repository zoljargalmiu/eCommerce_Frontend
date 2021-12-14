import React, { useState, useEffect } from "react";
import { API } from "../../_helpers/service";
import { PageTitle } from "../../components";
import { Card, Col, Row } from "antd";
// import basketball from "../../assets/images/basketball.jpg";
import { Link } from "react-router-dom";

const { Meta } = Card;
function AllCourts({ clubID }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    API.get(`hall/byclub/${clubID}`).then((result) => {
      if (result.status === 200) {
        setData(result.data);
        setLoading(false);
      }
    });
  };

  return (
    <>
      <PageTitle title="All courts" description="Courts" />
      <div className="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <Row gutter={16}>
                {data.map((court) => (
                  <Col span={4}>
                    <Link to={`/calendar/${court.hallId}`}>
                      <Card
                        hoverable
                        style={{ marginBottom: 16 }}
                        cover={<img src="" height="200" width="200" />}
                      >
                        <Meta title={court.name} />
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllCourts;
