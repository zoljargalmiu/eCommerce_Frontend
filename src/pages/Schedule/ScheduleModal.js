import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Input, DatePicker, TimePicker } from "antd";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const { Option } = Select;
const { RangePicker } = DatePicker;

function ScheduleModal({ visible, setVisible, scheduleData, onClear }) {
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
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const registerSchedule = (values) => {
    // setConfirmLoading(true);
    // API.post("auth/signup", {
    //   username: values.username,
    //   email: values.email,
    //   password: values.password,
    //   registerNumber: values.registerNumber,
    //   firstName: values.firstName,
    //   lastName: values.lastName,
    //   roles: values.role,
    // })
    //   .then((result) => {
    //     if (result.status === 200) {
    //       if (result.data.success) {
    //         notification["success"]({
    //           message: "Success",
    //           description: result.data.message,
    //         });
    //         setVisible(false);
    //       } else {
    //         message.error(result.data.message);
    //       }
    //     }
    //     setConfirmLoading(false);
    //   })
    //   .catch((error) => {
    //     const result = error.response;
    //     if (result.status === 400) {
    //       if (result.data.errors !== undefined) {
    //         if (result.data.errors.length > 0) {
    //           message.error(result.data.errors[0].defaultMessage);
    //         } else {
    //           message.error("Failed!");
    //         }
    //       } else {
    //         message.error(result.data.message);
    //       }
    //     }
    //   });
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
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please fill out this field!" }]}
        >
          <RangePicker />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select category!" }]}
        >
          <TimePicker.RangePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ScheduleModal;
