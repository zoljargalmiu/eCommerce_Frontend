import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
  InputNumber,
  message,
  notification,
} from "antd";
import { API } from "../../_helpers/service";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const { Option } = Select;
function CourtModal({
  visible,
  setVisible,
  courtData,
  onClear,
  clubs,
  success,
  clubId,
}) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const isNew = Object.values(courtData) <= 0;

  useEffect(() => {
    form.setFieldsValue({ ...courtData });
  }, [courtData]);

  const handleCancel = () => {
    onClear();
    form.resetFields();
    setVisible(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isNew) registerCourt(values);
        else editCourt(values);
        onClear();
        form.resetFields();
        setVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const registerCourt = (values) => {
    setConfirmLoading(true);
    API.post("hall/register", {
      name: values.name,
      maxPlayer: values.maxPlayer,
      category: values.category,
      club: clubId,
    })
      .then((result) => {
        if (result.status === 200) {
          notification["success"]({
            message: "Success",
          });
          setVisible(false);
          success();
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

  const editCourt = (values) => {
    setConfirmLoading(true);

    API.post("hall/edit/" + courtData.hallId, {
      name: values.name,
      maxPlayer: values.maxPlayer,
      category: values.category,
      club: courtData.club,
    })
      .then((result) => {
        if (result.status === 200) {
          notification["success"]({
            message: "Success",
          });
          setVisible(false);
          success();
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
      title={isNew ? "Add Court" : "Edit Court"}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isNew ? "Add" : "Save"}
      cancelText="Cancel"
      width={720}
      confirmLoading={confirmLoading}
      destroyOnClose={true}
    >
      <Form {...formItemLayout} form={form} initialValues={{ maxPlayer: 1 }}>
        <Form.Item
          label="Court Name"
          name="name"
          rules={[{ required: true, message: "Please fill out this field!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select category!" }]}
        >
          <Select
            placeholder="Select"
            showSearch
            allowClear
            style={{ width: "100%" }}
          >
            <Option value="BASKETBALL">BASKETBALL</Option>
            <Option value="TABLETENNIS">TABLETENNIS</Option>
            <Option value="TABLETENNIS">BADMINTON</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Max Player"
          name="maxPlayer"
          rules={[{ required: true, message: "Please select max player!" }]}
        >
          <InputNumber min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CourtModal;
