import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
  TimePicker,
  message,
  notification,
} from "antd";
import moment from "moment";
import { API } from "../../_helpers/service";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const { Option } = Select;
const { RangePicker } = DatePicker;

function CalendarModal({
  visible,
  setVisible,
  scheduleData,
  courtID,
  onClear,
  success,
}) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const isNew = Object.values(scheduleData) <= 0;

  useEffect(() => {
    form.setFieldsValue({ ...scheduleData });
  }, [scheduleData]);

  const handleCancel = () => {
    onClear();
    form.resetFields();
    setVisible(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        registerSchedule(values);
        onClear();
        form.resetFields();
        setVisible(false);
        success();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const registerSchedule = (values) => {
    const date = moment(values.date).format("YYYY-MM-DD");
    const startTime = moment(values.time[0]).format("HH:mm");
    const endTime = moment(values.time[1]).format("HH:mm");

    var startDate = moment(date + " " + startTime);
    var endDate = moment(date + " " + endTime);

    setConfirmLoading(true);

    API.post("sch/register", {
      startDateTime: startDate,
      endDateTime: endDate,
      hallId: courtID,
    })
      .then((result) => {
        if (result.status === 200) {
          notification["success"]({
            message: "Success",
          });
          setVisible(false);
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

  return (
    <Modal
      title={isNew ? "Create Schedule" : "Edit Schedule"}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isNew ? "Create" : "Save"}
      cancelText="Cancel"
      width={720}
      confirmLoading={confirmLoading}
      destroyOnClose={true}
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please fill out this field!" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Time"
          name="time"
          rules={[{ required: true, message: "Please select time!" }]}
        >
          <TimePicker.RangePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CalendarModal;
