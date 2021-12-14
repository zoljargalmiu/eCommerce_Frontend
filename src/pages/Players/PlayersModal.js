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
function PlayersModal({
  visible,
  setVisible,
  userData,
  onClear,
  clubs,
  success,
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
        if (isNew) registerPlayer(values);
        else editPlayer(values);

        //registerMembership(values);

        onClear();
        form.resetFields();
        setVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const registerPlayer = (values) => {
    API.post("/player/register", {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      bloodType: values.bloodType,
      //birthDate: moment(values.birthDate, dateFormat),
      //expireDate: moment(values.expireDate, dateFormat),
      gender: values.gender,
      emergencyContactNumber: values.emergencyContactNumber,
      roles: [2],
      //club: values.club,
    })
      .then((result) => {
        if (result.status === 200) {
          notification["success"]({
            message: "Success",
          });
          setVisible(false);

          API.post("/membership/register", {
            expireDate: "2022-12-01",
            player: result.data.userId,
            club: values.club,
          }).then((resultRegister) => success());

          // private Long membershipId;
          // @JsonFormat(pattern="yyyy-MM-dd")
          // private LocalDate expireDate;
          //   private Long player;
          //   private Long club;
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

    // API.post("membership/register", {
    //   expireDate: values.expireDate,
    //   club: values.club,
    //   player: userId,
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

  const editPlayer = (values) => {
    API.post("player/edit/" + userData.userId, {
      name: values.name,
      email: values.email,
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      bloodType: values.bloodType,
      birthDate: null,
      //expireDate: moment(values.expireDate, dateFormat),
      gender: values.gender,
      emergencyContactNumber: values.emergencyContactNumber,
      roles: [2],
      //club: values.club,
    })
      .then((result) => {
        if (result.status === 200) {
          notification["success"]({
            message: "Success",
          });
          setVisible(false);
        }
        success();
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

    // API.post("membership/register", {
    //   expireDate: values.expireDate,
    //   club: values.club,
    //   player: userId,
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

  // const registerMembership = (values) => {
  //   API.post("membership/register", {
  //     expireDate: values.expireDate,
  //     club: values.club,
  //     player: userId,
  //   })
  //     .then((result) => {
  //       if (result.status === 200) {
  //         if (result.data.success) {
  //           notification["success"]({
  //             message: "Success",
  //             description: result.data.message,
  //           });
  //           setVisible(false);
  //         } else {
  //           message.error(result.data.message);
  //         }
  //       }
  //       setConfirmLoading(false);
  //     })
  //     .catch((error) => {
  //       const result = error.response;
  //       if (result.status === 400) {
  //         if (result.data.errors !== undefined) {
  //           if (result.data.errors.length > 0) {
  //             message.error(result.data.errors[0].defaultMessage);
  //           } else {
  //             message.error("Failed!");
  //           }
  //         } else {
  //           message.error(result.data.message);
  //         }
  //       }
  //     });
  // };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <Modal
      title={isNew ? "Add Player" : "Edit Player"}
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
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please fill out this field!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please fill out this field!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select
            placeholder="Gender"
            showSearch
            allowClear
            style={{ width: "100%" }}
          >
            <Option value="M">Male</Option>
            <Option value="F">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Username"
          name="name"
          rules={[
            { required: true, message: "Please fill out username field!" },
          ]}
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
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please fill correct email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone number"
          name="phone"
          rules={[{ required: true, message: "Please fill out phone field!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Contact number"
          name="emergencyContactNumber"
          rules={[
            { required: true, message: "Please fill out contact phone field!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Blood Type"
          name="bloodType"
          rules={[{ required: true, message: "Please select blood type!" }]}
        >
          <Select
            placeholder="Blood Type"
            showSearch
            allowClear
            style={{ width: "100%" }}
          >
            <Option value="A(II)">A(II)</Option>
            <Option value="B(III)">B(III)</Option>
            <Option value="O(I)">O(I)</Option>
            <Option value="AB(IV)">AB(IV)</Option>
          </Select>
        </Form.Item>
        {/* <Form.Item
          label="Birthdate"
          name="birthDate"
          rules={[
            { required: true, message: "Please fill out birthdate field!" },
          ]}
        >
          <DatePicker />
        </Form.Item> */}
        {/* <Form.Item
          label="ExpireDate"
          name="expireDate"
          rules={[
            { required: true, message: "Please fill out expire date field!" },
          ]}
        >
          <DatePicker />
        </Form.Item> */}
        <Form.Item
          label="Club Name"
          name="club"
          rules={[{ required: true, message: "Please select club!" }]}
        >
          <Select
            placeholder="Select"
            showSearch
            allowClear
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

export default PlayersModal;
