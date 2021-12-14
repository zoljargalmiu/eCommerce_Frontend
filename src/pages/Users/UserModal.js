import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
  notification,
  message,
} from "antd";
import { API } from "../../_helpers/service";
import moment from "moment";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const { Option } = Select;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
function UserModal({
  visible,
  setVisible,
  userData,
  onClear,
  roles,
  success,
  clubs,
}) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const isNew = Object.values(userData) <= 0;

  useEffect(() => {
    form.setFieldsValue({ ...userData });
  }, [userData]);

  const handleCancel = () => {
    onClear();
    form.resetFields();
    setVisible(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isNew) registerUser(values);
        else editUser(values);
        onClear();
        form.resetFields();
        setVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const registerUser = (values) => {
    API.post("owner/register", {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      bloodType: null,
      birthDate: null,
      gender: null,
      emergencyContactNumber: null,
      roles: [3],
      clubs: values.club,
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

  const editUser = (values) => {
    console.log("userId: " + userData.userId);
    API.post("/api/users" + userData.userId, {
      name: values.name,
      userName: values.userName,
      status: values.status,
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
      title={isNew ? "Add User" : "Edit User"}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isNew ? "Add" : "Save"}
      cancelText="Cancel"
      width={720}
      confirmLoading={confirmLoading}
      destroyOnClose={true}
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please fill out this field!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Username"
          name="userName"
          rules={[
            { required: true, message: "Please fill out username field!" },
          ]}
        >
          <Input disabled={!isNew} />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please fill out this field!" }]}
        >
          <Input disabled={!isNew} />
        </Form.Item>

        {isNew && (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please fill out password field!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item
          label="Role"
          name="role"
          rules={[
            {
              required: true,
              type: "role",
              message: "Please fill out email field!",
            },
          ]}
        >
          <Input disabled={!isNew} />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select club!" }]}
        >
          <Select
            placeholder="Select"
            showSearch
            allowClear
            mode="multiple"
            style={{ width: "100%" }}
          >
            {clubs.map((club) => (
              <Option key={club.clubId} value={club.clubId} data={club}>
                {club.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserModal;
