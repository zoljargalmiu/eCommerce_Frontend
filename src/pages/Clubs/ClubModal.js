import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  message,
  notification,
} from "antd";
import moment from "moment";
import { API } from "../../_helpers/service";

const { Option } = Select;
const dateFormat = "YYYY/MM/DD";
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

function ClubModal({ visible, setVisible, clubData, onClear, success }) {
  const [form] = Form.useForm();
  const [searchOwner] = Form.useForm();
  const [searchClub] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const isNew = Object.values(clubData) <= 0;

  useEffect(() => {
    form.setFieldsValue({ ...clubData });
  }, [clubData]);

  const handleCancel = () => {
    onClear();
    form.resetFields();
    setVisible(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        registerClub(values);
        onClear();
        form.resetFields();
        setVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const registerClub = (values) => {
    API.post("club/register", {
      name: values.name,
      address: values.address,
      timeZone: values.timeZone,
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

  const onSearchClub = () => {};
  const onSearchOwner = () => {};

  return (
    <Modal
      title={isNew ? "Add Club" : "Edit Club"}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isNew ? "Add" : "Save"}
      cancelText="Cancel"
      width={720}
      confirmLoading={confirmLoading}
      destroyOnClose={true}
    >
      {/* <Form {...formItemLayout} form={searchClub} onFinish={onSearchClub}>
        <Form.Item
          label="Search club by name"
          name="searchValue"
          rules={[{ required: true, message: "Please fill out this field!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form> */}

      {/* <Form {...formItemLayout} form={searchOwner} onFinish={onSearchOwner}>
        <Form.Item
          label="Search owner by name"
          name="searchValue"
          rules={[{ required: true, message: "Please fill out this field!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form> */}

      <Form {...formItemLayout} form={form}>
        <Form.Item
          label="Club Name"
          name="name"
          rules={[
            { required: true, message: "Please fill out club name field!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[
            { required: true, message: "Please fill out address field!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Time Zone"
          name="timeZone"
          rules={[{ required: true, message: "Please select time zone!" }]}
        >
          <Select
            placeholder="Time Zone"
            showSearch
            allowClear
            style={{ width: "100%" }}
          >
            <Option value="UTC -10">UTC -10</Option>
            <Option value="UTC -9">UTC -9</Option>
            <Option value="UTC -8">UTC -8</Option>
            <Option value="UTC -7">UTC -7</Option>
            <Option value="UTC -6">UTC -6</Option>
            <Option value="UTC -5">UTC -5</Option>
            <Option value="UTC -4">UTC -4</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ClubModal;
