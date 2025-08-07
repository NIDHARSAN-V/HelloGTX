// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Row,
//   Col,
//   Statistic,
//   Input,
//   Menu,
//   Button,
//   Typography,
//   Layout,
//   Form,
//   Select,
//   InputNumber
// } from 'antd';
// import {
//   UserAddOutlined,
//   TeamOutlined,
//   BookOutlined,
//   MessageOutlined,
//   FileTextOutlined,
//   SearchOutlined
// } from '@ant-design/icons';
// import { useDispatch } from 'react-redux';
// import { checkCustomerByEmail } from '../../Store/Lead';
// import { useNavigate } from 'react-router-dom';





// const { Title } = Typography;
// const { Sider, Content } = Layout;
// const { Option } = Select;

// const AddCustomerForm = ({ onCancel }) => {
//   const [form] = Form.useForm();
//  const [isExist, setIsExist] = useState(false);

//   const dispatch = useDispatch();

//   const navigate  = useNavigate();

//   const onFinish = (values) => {
//     console.log('Form values:', values);
//   };






// const checkCustomerExist = async (email) => {
//   try {
    
//     const resultAction = await dispatch(checkCustomerByEmail({ email }));

//     const responseData = resultAction.payload;

//     console.log('Customer lookup result:', responseData);

//     if (responseData?.exists) {
//       setIsExist(true);
//     } else {
//       setIsExist(false);
//     }
//   } catch (error) {
//     console.error('Error checking customer:', error);
//     setIsExist(false);
//   }
// };



//   return (
//     <div style={{ maxWidth: '600px', margin: '0 auto' }}>
//       <Title level={3} style={{ marginBottom: '24px' }}>Add Customer</Title>

//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={onFinish}
//       >
//         <Form.Item
//           label="Email ID"
//           name="email"
//           rules={[{ required: true, message: 'Please input email!' }]}
//         >
//           <Input placeholder="Email"
//             onChange={
//               async (e) => {
//                 const email = e.target.value;

//                 checkCustomerExist(email);

//               }
//             } />
//         </Form.Item>


//         {isExist && (
//   <div style={{ color: '#1890ff', marginBottom: '16px' }}>
//     <a>Customer already exists? View here</a>
//   </div>
// )}

// {/* 
//         <Form.Item
//           label="Mobile Number"
//           name="mobile"
//           rules={[{ required: true, message: 'Please input mobile number!' }]}
//         >
//           <InputNumber
//             addonBefore={<div style={{ width: '50px' }}>+91</div>}
//             style={{ width: '100%' }}
//           />
//         </Form.Item>




//         <Form.Item
//           label="First Name"
//           name="firstName"
//           rules={[{ required: true, message: 'Please input first name!' }]}
//         >
//           <Input placeholder="First Name" />
//         </Form.Item>





//         <Form.Item
//           label="Last Name"
//           name="lastName"
//           rules={[{ required: true, message: 'Please input last name!' }]}
//         >
//           <Input placeholder="Last Name" />
//         </Form.Item> */}

//         {/* <Form.Item
//           label="Lead Source"
//           name="leadSource"
//           rules={[{ required: true, message: 'Please select lead source!' }]}
//         >
//           <Select placeholder="Select">
//             <Option value="agency">Agency</Option>
//             <Option value="website">Website</Option>
//             <Option value="referral">Referral</Option>
//             <Option value="social">Social Media</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label="Lead Stage"
//           name="leadStage"
//           rules={[{ required: true, message: 'Please select lead stage!' }]}
//         >
//           <Select placeholder="Select">
//             <Option value="new">New</Option>
//             <Option value="contacted">Contacted</Option>
//             <Option value="qualified">Qualified</Option>
//             <Option value="lost">Lost</Option>
//           </Select>
//         </Form.Item> */}
        

//         <Form.Item>
//           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
//             {/* <Button onClick={onCancel}>Cancel</Button> */}
//             <Button type="primary" htmlType="submit"
            
//               onClick={function()
//                 {
//                   navigate("/");
//                 }
//               }
//             >next</Button>

//           </div>
//         </Form.Item>

      


//       </Form>
//     </div>
//   );
// };

// const Lead = () => {
//   const [stats, setStats] = useState({
//     leads: 0,
//     bookings: 0,
//     responseRate: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [showAddCustomer, setShowAddCustomer] = useState(false);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const mockData = {
//           leads: 11441,
//           bookings: 4243,
//           responseRate: 78
//         };
//         setStats(mockData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Dashboard data fetch error:', error);
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   const handleB2CLead = () => {
//     setShowAddCustomer(true);
//   };

//   const handleB2BLead = () => {
//     setShowAddCustomer(true);
//   };

//   const handleCancelAddCustomer = () => {
//     setShowAddCustomer(false);
//   };

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={setCollapsed}
//         width={250}
//         theme="light"
//         style={{
//           boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
//           overflow: 'auto',
//           height: '100vh',
//           position: 'fixed',
//           left: 0
//         }}
//       >
//         <div style={{ padding: collapsed ? '16px 8px' : '16px' }}>
//           <Title level={4} style={{ marginBottom: 16 }}>
//             {collapsed ? 'R' : 'Reports'}
//           </Title>
//         </div>

//         <Menu
//           mode="inline"
//           defaultSelectedKeys={['reports']}
//           items={[
//             { key: 'reports', icon: <FileTextOutlined />, label: 'Dashboard Reports' },
//             { key: 'queries', icon: <FileTextOutlined />, label: 'Customer Queries' },
//             { key: 'leads', icon: <FileTextOutlined />, label: 'Lead Analytics' },
//             { key: 'campaign', icon: <FileTextOutlined />, label: 'Campaign Metrics' },
//           ]}
//         />
//       </Sider>

//       <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
//         <Content style={{ padding: '24px', background: '#fff' }}>
//           {showAddCustomer ? (
//             <AddCustomerForm onCancel={handleCancelAddCustomer} />
//           ) : (
//             <>
//               <Title level={2} style={{ marginBottom: 24 }}>CRM Dashboard</Title>

//               <div style={{ marginBottom: 32 }}>
//                 <Title level={4} style={{ marginBottom: 16 }}>Lead Generation</Title>
//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <Button
//                       type="primary"
//                       icon={<UserAddOutlined />}
//                       size="large"
//                       block
//                       onClick={handleB2CLead}
//                       style={{ height: 60, fontSize: 16 }}
//                     >
//                       NEW B2C Lead
//                     </Button>
//                   </Col>
//                   <Col span={12}>
//                     <Button
//                       type="primary"
//                       icon={<TeamOutlined />}
//                       size="large"
//                       block
//                       onClick={handleB2BLead}
//                       style={{ height: 60, fontSize: 16 }}
//                     >
//                       NEW B2B Lead
//                     </Button>
//                   </Col>
//                 </Row>
//               </div>

//               <div style={{ marginBottom: 32 }}>
//                 <Title level={4} style={{ marginBottom: 16 }}>Performance Metrics</Title>
//                 <Row gutter={16}>
//                   <Col span={8}>
//                     <Card hoverable>
//                       <Statistic
//                         title="Leads & Queries"
//                         value={stats.leads}
//                         prefix={<MessageOutlined />}
//                         loading={loading}
//                         valueStyle={{ fontSize: 28 }}
//                       />
//                     </Card>
//                   </Col>
//                   <Col span={8}>
//                     <Card hoverable>
//                       <Statistic
//                         title="Confirmed Bookings"
//                         value={stats.bookings}
//                         prefix={<BookOutlined />}
//                         loading={loading}
//                         valueStyle={{ fontSize: 28 }}
//                       />
//                     </Card>
//                   </Col>
//                   <Col span={8}>
//                     <Card hoverable>
//                       <Statistic
//                         title="Response Rate"
//                         value={stats.responseRate}
//                         suffix="%"
//                         loading={loading}
//                         valueStyle={{ fontSize: 28 }}
//                       />
//                     </Card>
//                   </Col>
//                 </Row>
//               </div>

//               <div>
//                 <Input
//                   placeholder="Search across CRM..."
//                   prefix={<SearchOutlined />}
//                   style={{ width: '100%', maxWidth: 500 }}
//                   size="large"
//                   allowClear
//                 />
//               </div>
//             </>
//           )}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default Lead;





import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Menu,
  Button,
  Typography,
  Layout,
  Form,
  Select,
  InputNumber,
  DatePicker,
  message
} from 'antd';
import {
  UserAddOutlined,
  TeamOutlined,
  BookOutlined,
  MessageOutlined,
  FileTextOutlined,
  SearchOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { checkCustomerByEmail } from '../../Store/Lead';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { registerUser } from '../../Store/AuthSlice';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const AddCustomerForm = ({ onCancel, leadType }) => {
  const [form] = Form.useForm();
  const [isExist, setIsExist] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      if (isExist) {
        // Proceed with lead creation for existing customer
        console.log('Proceeding with existing customer:', customerData);
        navigate('/leads/create', { state: { customerId: customerData.customer._id } });
      } else {
        // Register new customer
        const registrationData = {
          ...values,
          role: 'customer',
          dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
          address: {
            street: values.street || '',
            city: values.city || '',
            state: values.state || '',
            country: values.country || '',
            zipCode: values.zipCode || ''
          }
        };
        
        const result = await dispatch(registerUser(registrationData));
        
        if (result.payload?.success) {
          message.success('Customer registered successfully!');
          navigate('/leads/create', { state: { customerId: result.payload.customer._id } });
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
      return;
    }
    
    try {
      const resultAction = await dispatch(checkCustomerByEmail({ email }));
      const responseData = resultAction.payload;

      if (responseData?.exists) {
        setIsExist(true);
        setCustomerData(responseData);
      } else {
        setIsExist(false);
        setCustomerData(null);
      }
    } catch (error) {
      console.error('Error checking customer:', error);
      setIsExist(false);
      setCustomerData(null);
    }
  };

  const viewCustomerDetails = () => {
    setShowCustomerDetails(true);
  };

  const backToForm = () => {
    setShowCustomerDetails(false);
  };

  if (showCustomerDetails && customerData) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={backToForm}
          style={{ marginBottom: 16 }}
        >
          Back
        </Button>
        
        <Card title="Customer Details">
          <Title level={4}>Personal Information</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Name: </Text>
              <Text>{customerData.user.firstName} {customerData.user.lastName}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Email: </Text>
              <Text>{customerData.user.email}</Text>
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginTop: 8 }}>
            <Col span={12}>
              <Text strong>Phone: </Text>
              <Text>{customerData.user.phone}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Date of Birth: </Text>
              <Text>{new Date(customerData.user.dateOfBirth).toLocaleDateString()}</Text>
            </Col>
          </Row>
          
          <Title level={4} style={{ marginTop: 24 }}>Address</Title>
          <Row gutter={16}>
            <Col span={24}>
              <Text>
                {customerData.customer.address.street}, {customerData.customer.address.city}, 
                {customerData.customer.address.state}, {customerData.customer.address.country} - 
                {customerData.customer.address.zipCode}
              </Text>
            </Col>
          </Row>
          
          <div style={{ marginTop: 24 }}>
            <Button 
              type="primary" 
              onClick={() => navigate('/leads/create', { state: { customerId: customerData.customer._id } })}
            >
              Proceed with Lead Creation
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: '24px' }}>Add {leadType} Customer</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
          <div style={{ color: '#1890ff', marginBottom: '16px' }}>
            <a onClick={viewCustomerDetails}>Customer already exists. View details here</a>
          </div>
        )}

        {!isExist && (
          <>
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

            <Form.Item
              label="Alternate Mobile Number"
              name="alternatePhone"
            >
              <InputNumber
                addonBefore={<div style={{ width: '50px' }}>+91</div>}
                style={{ width: '100%' }}
              />
            </Form.Item>

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

const Lead = () => {
  const [stats, setStats] = useState({
    leads: 0,
    bookings: 0,
    responseRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [leadType, setLeadType] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const mockData = {
          leads: 11441,
          bookings: 4243,
          responseRate: 78
        };
        setStats(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleB2CLead = () => {
    setLeadType('B2C');
    setShowAddCustomer(true);
  };

  const handleB2BLead = () => {
    setLeadType('B2B');
    setShowAddCustomer(true);
  };

  const handleCancelAddCustomer = () => {
    setShowAddCustomer(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        theme="light"
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0
        }}
      >
        <div style={{ padding: collapsed ? '16px 8px' : '16px' }}>
          <Title level={4} style={{ marginBottom: 16 }}>
            {collapsed ? 'R' : 'Reports'}
          </Title>
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={['reports']}
          items={[
            { key: 'reports', icon: <FileTextOutlined />, label: 'Dashboard Reports' },
            { key: 'queries', icon: <FileTextOutlined />, label: 'Customer Queries' },
            { key: 'leads', icon: <FileTextOutlined />, label: 'Lead Analytics' },
            { key: 'campaign', icon: <FileTextOutlined />, label: 'Campaign Metrics' },
          ]}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Content style={{ padding: '24px', background: '#fff' }}>
          {showAddCustomer ? (
            <AddCustomerForm 
              onCancel={handleCancelAddCustomer} 
              leadType={leadType}
            />
          ) : (
            <>
              <Title level={2} style={{ marginBottom: 24 }}>CRM Dashboard</Title>

              <div style={{ marginBottom: 32 }}>
                <Title level={4} style={{ marginBottom: 16 }}>Lead Generation</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Button
                      type="primary"
                      icon={<UserAddOutlined />}
                      size="large"
                      block
                      onClick={handleB2CLead}
                      style={{ height: 60, fontSize: 16 }}
                    >
                      NEW B2C Lead
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      type="primary"
                      icon={<TeamOutlined />}
                      size="large"
                      block
                      onClick={handleB2BLead}
                      style={{ height: 60, fontSize: 16 }}
                    >
                      NEW B2B Lead
                    </Button>
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: 32 }}>
                <Title level={4} style={{ marginBottom: 16 }}>Performance Metrics</Title>
                <Row gutter={16}>
                  <Col span={8}>
                    <Card hoverable>
                      <Statistic
                        title="Leads & Queries"
                        value={stats.leads}
                        prefix={<MessageOutlined />}
                        loading={loading}
                        valueStyle={{ fontSize: 28 }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card hoverable>
                      <Statistic
                        title="Confirmed Bookings"
                        value={stats.bookings}
                        prefix={<BookOutlined />}
                        loading={loading}
                        valueStyle={{ fontSize: 28 }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card hoverable>
                      <Statistic
                        title="Response Rate"
                        value={stats.responseRate}
                        suffix="%"
                        loading={loading}
                        valueStyle={{ fontSize: 28 }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>

              <div>
                <Input
                  placeholder="Search across CRM..."
                  prefix={<SearchOutlined />}
                  style={{ width: '100%', maxWidth: 500 }}
                  size="large"
                  allowClear
                />
              </div>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Lead;


