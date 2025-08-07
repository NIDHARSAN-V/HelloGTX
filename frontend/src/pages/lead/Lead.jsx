import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Row,
  Col,
  Card,
  message,
  Descriptions,
  Collapse
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { checkCustomerByEmail, registerNewCustomerLead } from '../../Store/Lead';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { registerUser } from '../../Store/AuthSlice';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const AddCustomerForm = ({ onCancel, leadType }) => {
  const [form] = Form.useForm();
  const [isExist, setIsExist] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      if (isExist) {
        // Proceed with lead creation for existing customer
        navigate('/leads/create', { state: { customerId: customerData.customer._id } });
      } else {
        // Register new customer with all collected details
        const registrationData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: 'TempPassword123!',
          confirmPassword: 'TempPassword123!',
          phone: values.phone,
          alternatePhone: values.alternatePhone,
          dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
          role: 'customer',
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            country: values.country || 'India',
            zipCode: values.zipCode
          },
          passport: {
            passportNumber: values.passportNumber,
            countryOfIssue: values.countryOfIssue,
            dateOfIssue: values.passportIssueDate.format('YYYY-MM-DD'),
            dateOfExpiry: values.passportExpiryDate.format('YYYY-MM-DD'),
            placeOfIssue: values.placeOfIssue,
            nationality: values.nationality
          },
          nationality: values.nationality,
          preferredDestinations: values.preferredDestinations || []
        };
        
        console.log("In lead new customer creation" , registrationData);
        const result = await dispatch(registerNewCustomerLead(registrationData));

        console.log(result)
        
        if (result.payload?.success) {
          message.success('Customer registered successfully!');
          console.log(result.payload)
          navigate('/leads/create', { state: { customer:result.payload.data } });
        } else {
          message.error(result.payload?.message || 'Failed to register customer');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkCustomerExist = async (email) => {
    if (!email) {
      setIsExist(false);
      setCustomerData(null);
      setShowDetails(false);
      return;
    }
    
    try {
      const resultAction = await dispatch(checkCustomerByEmail({ email }));
      const responseData = resultAction.payload;

      if (responseData?.exists) {
        setIsExist(true);
        setCustomerData(responseData.customer);
      } else {
        setIsExist(false);
        setCustomerData(null);
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Error checking customer:', error);
      setIsExist(false);
      setCustomerData(null);
      setShowDetails(false);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: '24px' }}>Add {leadType} Customer</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          country: 'India'
        }}
      >
        <Form.Item
          label="Email ID"
          name="email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input 
            placeholder="Email" 
            onChange={(e) => checkCustomerExist(e.target.value)}
          />
        </Form.Item>

        {isExist && (
          <div style={{ marginBottom: '16px' }}>
            <Button 
              type="link" 
              onClick={toggleDetails}
              style={{ padding: 0 }}
            >
              {showDetails ? 'Hide customer details' : 'Customer already exists. Click to view details'}
            </Button>
            
            {showDetails && customerData && (
              <Card style={{ marginTop: 16 }}>
                <Descriptions title="Customer Details" bordered column={1}>
                  <Descriptions.Item label="Name">
                    {customerData.user.firstName} {customerData.user.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {customerData.user.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {customerData.user.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Alternate Phone">
                    {customerData.user.alternatePhone || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {new Date(customerData.user.dateOfBirth).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nationality">
                    {customerData.customer.nationality || 'N/A'}
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Address">
                    {customerData.customer.address?.street || 'N/A'}, 
                    {customerData.customer.address?.city || 'N/A'}, 
                    {customerData.customer.address?.state || 'N/A'}, 
                    {customerData.customer.address?.country || 'N/A'} - 
                    {customerData.customer.address?.zipCode || 'N/A'}
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Passport Number">
                    {customerData.customer.passport?.passportNumber || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Country of Issue">
                    {customerData.customer.passport?.countryOfIssue || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Issue">
                    {customerData.customer.passport?.dateOfIssue ? 
                      new Date(customerData.customer.passport.dateOfIssue).toLocaleDateString() : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Expiry">
                    {customerData.customer.passport?.dateOfExpiry ? 
                      new Date(customerData.customer.passport.dateOfExpiry).toLocaleDateString() : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Preferred Destinations">
                    {customerData.customer.preferredDestinations?.join(', ') || 'N/A'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </div>
        )}

        {!isExist && (
          <>
            <Title level={4} style={{ marginBottom: 16 }}>Personal Information</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'Please input first name!' }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: 'Please input last name!' }]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Mobile Number"
                  name="phone"
                  rules={[{ required: true, message: 'Please input mobile number!' }]}
                >
                  <InputNumber
                    addonBefore={<div style={{ width: '50px' }}>+91</div>}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Alternate Mobile Number"
                  name="alternatePhone"
                >
                  <InputNumber
                    addonBefore={<div style={{ width: '50px' }}>+91</div>}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Date of Birth"
                  name="dateOfBirth"
                  rules={[{ required: true, message: 'Please select date of birth!' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nationality"
                  name="nationality"
                >
                  <Input placeholder="Nationality" />
                </Form.Item>
              </Col>
            </Row>

            <Title level={4} style={{ marginTop: 16 }}>Address Information</Title>
            
            <Form.Item
              label="Street"
              name="street"
            >
              <Input placeholder="Street address" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="City"
                  name="city"
                >
                  <Input placeholder="City" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="State"
                  name="state"
                >
                  <Input placeholder="State" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Country"
                  name="country"
                >
                  <Input placeholder="Country" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Zip Code"
                  name="zipCode"
                >
                  <Input placeholder="Zip Code" />
                </Form.Item>
              </Col>
            </Row>

            <Title level={4} style={{ marginTop: 16 }}>Passport Information</Title>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Passport Number"
                  name="passportNumber"
                  rules={[{ required: true, message: 'Please input passport number!' }]}
                >
                  <Input placeholder="Passport Number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Country of Issue"
                  name="countryOfIssue"
                  rules={[{ required: true, message: 'Please input country of issue!' }]}
                >
                  <Input placeholder="Country of Issue" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Date of Issue"
                  name="passportIssueDate"
                  rules={[{ required: true, message: 'Please select date of issue!' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Date of Expiry"
                  name="passportExpiryDate"
                  rules={[
                    { required: true, message: 'Please select date of expiry!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue('passportIssueDate') || 
                            value > getFieldValue('passportIssueDate')) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Expiry date must be after issue date'));
                      },
                    }),
                  ]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    disabledDate={(current) => {
                      const issueDate = form.getFieldValue('passportIssueDate');
                      return issueDate ? current && current <= issueDate : false;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Place of Issue"
                  name="placeOfIssue"
                >
                  <Input placeholder="Place of Issue" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Passport Nationality"
                  name="passportNationality"
                >
                  <Input placeholder="Passport Nationality" />
                </Form.Item>
              </Col>
            </Row>

            <Title level={4} style={{ marginTop: 16 }}>Travel Preferences</Title>
            
            <Form.Item
              label="Preferred Destinations"
              name="preferredDestinations"
            >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Add preferred destinations"
                tokenSeparators={[',']}
              />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
            >
              {isExist ? 'Proceed with Lead' : 'Register & Create Lead'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCustomerForm;