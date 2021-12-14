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
  Breadcrumb,
  message,
  DatePicker,
} from "antd";
import { PageTitle, Pagination } from "../../components";
import Timetable from "react-timetable-events";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CalendarModal from "./CalendarModal";
import { useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const dateFormat = "YYYY/MM/DD";

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function Calendar() {
  let params = useParams();
  const { courtID } = params;
  const userData = useSelector((state) => state.authentication.user);
  const [dates, setDates] = useState([moment(), moment().add(7, "days")]);
  const [hackValue, setHackValue] = useState();
  const [events, setEvents] = useState({});
  const [max, setMax] = useState(0);
  const [visible, setVisible] = useState(false);
  const [currentClub, setCurrentClub] = useState({});
  const [currentSchedule, setCurrentSchedule] = useState(1);
  const [isPlayer, setIsPlayer] = useState(false);

  useEffect(() => {
    onFinish();

    setIsPlayer(
      userData.roles.filter((item) => item.roleName === "PLAYER").length > 0
    );
  }, []);

  const success = () => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1000);
    return () => clearTimeout(timer);
  };

  const onFinish = () => {
    const startDate = dates[0];
    const endDate = dates[1];
    const eventObj = {};

    for (
      var m = moment(startDate);
      m.diff(endDate, "days") <= 0;
      m.add(1, "days")
    ) {
      eventObj[m.format("YYYY/MM/DD")] = [];
    }

    API.get(`/hall/${courtID}`).then((result) => setMax(result.data.maxPlayer));

    API.get(`/sch/byHallId/${courtID}`, {
      params: {
        sDate: moment(startDate).format("YYYY-MM-DD"),
        eDate: moment(endDate).format("YYYY-MM-DD"),
      },
    }).then((result) => {
      if (result.status === 200) {
        const data = result.data;

        data.map((item) => {
          const currentDate = moment(item.startDateTime).format("YYYY/MM/DD");
          eventObj[currentDate].push({
            id: item.schId,
            players: item.players,
            name: `${moment(item.startDateTime).format("HH:mm")} - ${moment(
              item.endDateTime
            ).format("HH:mm")}`,
            startTime: new Date(
              moment(item.startDateTime).format("YYYY-MM-DDTHH:mm:ss")
            ),
            endTime: new Date(
              moment(item.endDateTime).format("YYYY-MM-DDTHH:mm:ss")
            ),
          });
        });

        setEvents(eventObj);
      }
    });
  };

  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") > 7;
    const tooEarly = dates[1] && dates[1].diff(current, "days") > 7;
    return tooEarly || tooLate;
  };

  const onOpenChange = (open) => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };

  const showConfirm = (id) => {
    confirm({
      title: "Do you want join?",
      icon: <ExclamationCircleOutlined />,
      content: "Do you want join.",
      okText: "Yes",
      cancelText: "No",
      onOk() {
        API.post(`/sch/join/${id}`).then((result) => {
          if (result.status === 200) {
            notification["success"]({
              message: "Success",
            });

            onFinish();
          }
        });
      },
      onCancel() {
        console.log("No");
      },
    });
  };

  return (
    <>
      <PageTitle title="Calendar" description="Calendar" />
      <div className="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    {/* <div className="col-lg-12">
                      <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                          <a href="/">Clubs</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                          <a href="">Courts</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Basketball 1</Breadcrumb.Item>
                      </Breadcrumb>
                    </div> */}
                    <div className="col-lg-8">
                      <Form
                        layout="inline"
                        style={{ marginTop: 10, marginBottom: 10 }}
                        initialValues={{
                          date: dates,
                        }}
                      >
                        <Form.Item name="date" label="Select date">
                          <RangePicker
                            value={hackValue || dates}
                            disabledDate={disabledDate}
                            onOpenChange={onOpenChange}
                            onCalendarChange={(val) => setDates(val)}
                          />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                          <Button type="primary" onClick={() => onFinish()}>
                            Show
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                    {!isPlayer && (
                      <div
                        className="col-lg-4"
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
                    )}
                  </div>
                  <div className="table-responsive">
                    <Timetable
                      events={events}
                      renderEvent={({
                        event,
                        defaultAttributes,
                        classNames,
                      }) => {
                        const isFull =
                          event.players.length === max ? "full" : "";
                        return (
                          <div
                            {...defaultAttributes}
                            title={event.name}
                            key={event.id}
                            onClick={() =>
                              isPlayer && isFull
                                ? Modal.error({
                                    title: "Court full",
                                    content: "Sorry, choose another day",
                                  })
                                : showConfirm(event.id)
                            }
                            className={`${classNames.event} eclub-event ${isFull}`}
                          >
                            <span className={classNames.event_info}>
                              {event.name}
                            </span>
                            <span className={classNames.event_info}>
                              {event.players.length}/{max}
                            </span>
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CalendarModal
        success={() => success()}
        courtID={courtID}
        visible={visible}
        setVisible={(value) => setVisible(value)}
        scheduleData={currentSchedule}
        onClear={() => setCurrentSchedule({})}
      />
    </>
  );
}

export default Calendar;
