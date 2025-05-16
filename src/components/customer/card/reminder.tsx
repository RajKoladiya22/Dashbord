import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Modal,
  Select,
  DatePicker,
  Input,
  Space,
  Typography,
  Divider,
  Descriptions,
  Timeline,
  Button,
  Badge,
  Statistic,
  Tag,
  Empty,
  message,
  Form,
} from "antd";
import {
  CalendarOutlined,
  AlertOutlined,
  ShopOutlined,
  ContactsOutlined,
  ExclamationCircleOutlined,
  ProfileOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import {
  fetchReminders,
  updateReminder,
} from "../../../redux/slice/products/reminder.slice";
import { useAppDispatch } from "../../../hooks";
import type { RootState } from "../../../redux/store";
import dayjs, { Dayjs } from "dayjs";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";
import "./style.css";
import { ReminderData } from "../../../redux/APITypes";
import AutoDismissAlert from "../../Alert";

const { Text } = Typography;

const { Meta } = Card;
const { RangePicker } = DatePicker;
const { Title } = Typography;

export const ReminderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reminders, loading, error } = useSelector(
    (state: RootState) => state.reminders
  );

  // Filters state
  const [timeWindow, setTimeWindow] = useState<
    | "next15"
    | "next30"
    | "nextMonth"
    | "last15"
    | "last30"
    | "custom"
    | "thisMonth"
  >("next30");
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchTextCustomer, setSearchTextCustomer] = useState("");
  const [searchTextPartner, setSearchTextPartner] = useState("");

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selected, setSelected] = useState<ReminderData | null>(null);

  const [isEditDatesVisible, setIsEditDatesVisible] = useState(false);

  const [form] = Form.useForm();

  // List
  const [category, setCategory] = useState<
    "all" | "withPartner" | "withoutPartner"
  >("all");

  const onAutofill = (id: string) => {
    // mode=autofill fills dates server-side
    dispatch(
      updateReminder({
        id,
        query: "mode=autofill",
        data: {},
      })
    )
      .unwrap()
      .then(() => closeModal())
      .then(() => message.success("Renewal dates autofilled!"))
      .catch((msg) => message.error(msg));
  };

  const onCancelRenewal = (id: string) => {
    dispatch(
      updateReminder({
        id,
        query: "mode=cancel", // your backend should interpret this
        data: { renewal: false },
      })
    )
      .unwrap()
      .then(() => {
        message.success("Renewal cancelled");
        closeModal();
      })
      .catch((msg) => message.error(msg));
  };

  const showEditDates = () => {
    setIsEditDatesVisible(true);
  };
  const closeEditDates = () => {
    setIsEditDatesVisible(false);
  };

  const handleRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null // Handle case where dates can be null or Dayjs
    // dateStrings: [string, string]
  ) => {
    if (dates) {
      // Ensure that both dates are non-null before updating state
      const [startDate, endDate] = dates;
      if (startDate && endDate) {
        setRange([startDate, endDate]);
      } else {
        setRange(null); // If one of the dates is null, clear the range
      }
    } else {
      setRange(null); // If dates is null, clear the range
    }
  };

  const displayReminders = useMemo(() => {
    switch (category) {
      case "withPartner":
        return reminders.filter((r) => !!r.customer.partner);
      case "withoutPartner":
        return reminders.filter((r) => !r.customer.partner);
      default:
        return reminders;
    }
  }, [reminders, category]);

  // Fetch reminders whenever filters change
  useEffect(() => {
    const payload: any = { timeWindow };
    if (timeWindow === "custom" && range) {
      payload.startDate = range[0].format("YYYY-MM-DD");
      payload.endDate = range[1].format("YYYY-MM-DD");
    }
    // console.log("searchTextCustomer--->", searchTextCustomer);

    if (searchText) payload.productName = searchText;
    if (searchTextCustomer) payload.customerSearch = searchTextCustomer;
    if (searchTextPartner) payload.partnerSearch = searchTextPartner;
    // console.log("payload--->", payload);

    dispatch(fetchReminders(payload));
  }, [
    dispatch,
    timeWindow,
    range,
    searchText,
    searchTextCustomer,
    searchTextPartner,
  ]);

  // Debounce search input
  const onSearchChange = useCallback(
    debounce((value: string) => setSearchText(value.trim()), 300),
    []
  );
  const onCustomerSearchChange = useCallback(
    debounce((value: string) => setSearchTextCustomer(value.trim()), 300),
    []
  );
  const onPartnerSearchChange = useCallback(
    debounce((value: string) => setSearchTextPartner(value.trim()), 300),
    []
  );

  const showModal = (item: ReminderData) => {
    setSelected(item);
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setIsModalVisible(false);
    setSelected(null);
  };

  // const TimelineCompact = ({ purchase, renewal, expiry }) => (
  // <Timeline mode="left" className="compact-timeline">
  //   <Timeline.Item
  //     dot={<CalendarOutlined />}
  //     label={dayjs(purchase).format('MMM D')}
  //   />
  //   <Timeline.Item
  //     dot={<ReloadOutlined />}
  //     label={dayjs(renewal).format('MMM D')}
  //   />
  //   <Timeline.Item
  //     dot={<WarningOutlined />}
  //     label={dayjs(expiry).format('MMM D')}
  //     color="red"
  //   />
  // </Timeline>
  // );

  //   const CustomerBadge = ({ customer }) => (
  //   <Space className="customer-badge">
  //     <Avatar size="small" src={customer.logo}>
  //       {customer.companyName[0]}
  //     </Avatar>
  //     <strong ellipsis>{customer.companyName}</strong>
  //     {customer.partner && (
  //       <Tag  color="geekblue">
  //         {customer.partner.companyName}
  //       </Tag>
  //     )}
  //   </Space>
  // );

  function openWhatsApp(number: string, message: string) {
    // Ensure only digits; prepend country code
    // const digits = number.replace(/\D/g, "");
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "width=600,height=700");
  }

  const openWhatsAppCustomer = (reminder: any) => {
    const formattedDate = new Date(reminder.expiryDate).toLocaleDateString(
      "en-GB"
    );
    let shareText =
      `*Subject: Renewal Reminder - ${reminder.product.productName}*\n\n` +
      `Dear ${
        reminder.customer.contactPerson || reminder.customer.companyName
      },\n` +
      `Your *${reminder.product.productName}* subscription with *${reminder.admin.companyName}* is due for renewal on *${formattedDate}*.\n\n` +
      `To continue uninterrupted access to real-time business insights, reports, and automation features, kindly renew before the due date.\n\n` +
      `For renewal assistance, contact us at 📞 *${reminder.admin.contactInfo.phone}* or ✉ *${reminder.admin.email}*\n` +
      `Renew today and stay ahead in business! 🚀\n\n` +
      `Best Regards,\n${reminder.admin.companyName}\n\n\n` +
      `*Company:*  ${reminder.admin.companyName}\n` +
      `*Contact:*  ${reminder.admin.firstName} ${reminder.admin.lastName}\n` +
      `*Contact Number:*  ${reminder.admin.contactInfo.phone}`;
    const formattedNumber = reminder.customer.mobileNumber.startsWith("+91")
      ? reminder.customer.mobileNumber
      : `+91${reminder.customer.mobileNumber}`;

    openWhatsApp(formattedNumber, shareText);
  };

  const openWhatsAppPartner = (reminder: any) => {
    const formattedDate = new Date(reminder.expiryDate).toLocaleDateString(
      "en-GB"
    );
    let shareText =
      `*Subject: Renewal Reminder - ${reminder.product.productName}*\n\n` +
      `Dear ${
        reminder.customer.contactPerson || reminder.customer.companyName
      },\n` +
      `Your *${reminder.product.productName}* subscription with *${reminder.customer.partner.companyName}* is due for renewal on *${formattedDate}*.\n\n` +
      `To continue uninterrupted access to real-time business insights, reports, and automation features, kindly renew before the due date.\n\n` +
      `For renewal assistance, contact us at 📞 *${reminder.customer.partner.contactInfo.phone}* or ✉ *${reminder.customer.partner.email}*\n` +
      `Renew today and stay ahead in business! 🚀\n\n` +
      `Best Regards,\n${reminder.customer.partner.companyName}\n\n\n` +
      `*Company:*  ${reminder.customer.partner.companyName}\n` +
      `*Contact:*  ${reminder.customer.partner.firstName} ${reminder.customer.partner.lastName}\n` +
      `*Contact Number:*  ${reminder.customer.partner.contactInfo.phone}`;

    const formattedNumber = reminder.customer.mobileNumber.startsWith("+91")
      ? reminder.customer.mobileNumber
      : `+91${reminder.customer.mobileNumber}`;

    openWhatsApp(formattedNumber, shareText);
  };

  return (
    <div className="reminder-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        {/* Title can be shown or toggled depending on context */}
        {/* <Title level={2} className="header-title">
          <AlertOutlined /> Renewal Management
          </Title> */}

        <div className="filter-bar">
          <div className="filter-controls">
            {/* <Select
              value={window}
              onChange={setTimeWindow}
              suffixIcon={<CalendarOutlined />}
              className="time-filter"
              popupClassName="filter-dropdown"
              style={{ minWidth: 180 }}
            >
              <Option value="next15">
                <Badge color="red" /> Next 15 Days
              </Option>
              <Option value="next30">
                <Badge color="orange" /> Next 30 Days
              </Option>
              <Option value="nextMonth">
                <Badge color="gold" /> Next Month
              </Option>
              <Option value="last15">Last 15 Days</Option>
              <Option value="last30">Last 30 Days</Option>
              <Option value="custom">Custom Range</Option>
            </Select> */}

            <Select
              value={timeWindow}
              onChange={setTimeWindow}
              options={[
                { label: "📅 This Month", value: "thisMonth" },
                { label: "🕒 Next 15 Days", value: "next15" },
                { label: "📅 Next 30 Days", value: "next30" },
                { label: "🗓️ Next Month", value: "nextMonth" },
                { label: "⏪ Last 15 Days", value: "last15" },
                { label: "⏮️ Last 30 Days", value: "last30" },
                { label: "🎚️ Custom", value: "custom" },
              ]}
              style={{ width: "200px" }}
            />

            {timeWindow === "custom" && (
              <RangePicker
                value={range}
                onChange={handleRangeChange}
                className="custom-range-picker"
                presets={[
                  {
                    label: "Last 7 Days",
                    value: [dayjs().subtract(7, "d"), dayjs()],
                  },
                  {
                    label: "Last Month",
                    value: [dayjs().subtract(1, "month"), dayjs()],
                  },
                ]}
                style={{ minWidth: 250 }}
              />
            )}

            <Input.Search
              placeholder="🔍Search products..."
              onSearch={setSearchText}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
              // enterButton={<SearchOutlined />}
              className="search-input"
              style={{ flexGrow: 1, minWidth: 200, maxWidth: 300 }}
            />
            <Input.Search
              placeholder="🏢Search customer..."
              onSearch={setSearchTextCustomer}
              onChange={(e) => onCustomerSearchChange(e.target.value)}
              allowClear
              // enterButton={<SearchOutlined />}
              className="search-input"
              style={{ flexGrow: 1, minWidth: 200, maxWidth: 300 }}
            />
            {category !== "withoutPartner" && (
              <Input.Search
                placeholder="🤝Search partner..."
                onSearch={setSearchTextPartner}
                onChange={(e) => onPartnerSearchChange(e.target.value)}
                allowClear
                // enterButton={<SearchOutlined />}
                style={{ flexGrow: 1, minWidth: 200, maxWidth: 300 }}
              />
            )}
            {reminders.filter((r) => !r.customer.partner) ? (
              ""
            ) : (
              <Input.Search
                placeholder="Search partner..."
                onSearch={setSearchTextPartner}
                onChange={(e) => onPartnerSearchChange(e.target.value)}
                allowClear
                enterButton={<SearchOutlined />}
                className="search-input"
                style={{ flexGrow: 1, minWidth: 200, maxWidth: 300 }}
              />
            )}
          </div>

          <div className="metrics-bar">
            <Space size="large">
              <Statistic
                title="Total Reminders"
                value={displayReminders.length}
                prefix={<ProfileOutlined />}
              />
              <Statistic
                title="Expiring Soon"
                value={
                  displayReminders.filter(
                    (r) => dayjs(r.expiryDate).diff(dayjs(), "days") < 7
                  ).length
                }
                prefix={<ExclamationCircleOutlined />}
              />
            </Space>
          </div>
        </div>
      </div>

      <Space.Compact className="category-filters">
        {/* <Select
              value={category}
              onChange={(value) => setCategory(value)}
              style={{ width: 160, marginLeft: 16 }}
            >
              <Option value="all">All Reminders</Option>
              <Option value="withPartner">Partner</Option>
              <Option value="withoutPartner">Without Partner</Option>
            </Select> */}
        <Button
          type={category === "all" ? "primary" : "default"}
          onClick={() => setCategory("all")}
        >
          All ({reminders.length})
        </Button>
        <Button
          type={category === "withPartner" ? "primary" : "default"}
          onClick={() => setCategory("withPartner")}
        >
          Partner ({reminders.filter((r) => r.customer.partner).length})
        </Button>
        <Button
          type={category === "withoutPartner" ? "primary" : "default"}
          onClick={() => setCategory("withoutPartner")}
        >
          Without Partner ({reminders.filter((r) => !r.customer.partner).length}
          )
        </Button>
      </Space.Compact>

      {/* Content Section */}
      <div className="reminder-content">
        {/* Status Indicators */}

        {/* Reminder Cards Grid */}
        <div className="reminder-grid">
          {error && (
            <AutoDismissAlert
              message="Error"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              onClose={() => null}
              durationMs={10000} // 10 seconds
            />
          )}
          {!loading && !error && displayReminders?.length === 0 ? (
            <Empty description="No partner members found." />
          ) : (
            <Row gutter={[16, 16]} justify="start">
              {displayReminders?.map((r: ReminderData, index) => {
                const daysRemaining = dayjs(r.expiryDate).diff(dayjs(), "days");

                return (
                  <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                    <Badge.Ribbon
                      text={`${daysRemaining}d`}
                      color={
                        daysRemaining <= 7
                          ? "red"
                          : daysRemaining <= 30
                          ? "orange"
                          : "green"
                      }
                    >
                      <Card
                        key={r.id}
                        className={`reminder-card ${
                          !r.status ? "expired-card" : ""
                        }`}
                        onClick={() => showModal(r)}
                        hoverable
                        cover={
                          <div className="product-media">
                            {/* <img
                        alt={r.product.productName}
                        src={r.product.imageUrl || `https://via.placeholder.com/150?text=${r.product.productName}`}
                      /> */}
                            <Tag className="price-tag">
                              ₹ {r.product.productPrice}
                            </Tag>
                          </div>
                        }
                        actions={[
                          <span onClick={(e) => e.stopPropagation()}>
                            <Button
                              key="notify"
                              icon={<NotificationOutlined />}
                              style={{ margin: "5px" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openWhatsAppCustomer(r);
                              }}
                            >
                              Notify Customer
                            </Button>

                            {category !== "withoutPartner" &&
                              r.customer.partner && (
                                <Button
                                  key="notify-partner"
                                  icon={<NotificationOutlined />} //openWhatsAppPartner
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openWhatsAppPartner(r);
                                  }}
                                >
                                  Notify Partner
                                </Button>
                              )}
                          </span>,
                        ]}
                        // cover={
                        //   <div className="product-media">
                        //     <div className="card-header">
                        //       <CustomerBadge customer={r.customer} />
                        //     </div>
                        //   </div>
                        // }
                      >
                        <Meta
                          title={
                            <>
                              <strong>{r.product.productName}</strong>
                              {/* <strong ellipsis={{ tooltip: r.product.productName }}>
                              {r.product.productName}
                            </strong> */}
                              <Tag
                                color={r.status ? "green" : "red"}
                                icon={
                                  r.status ? (
                                    <CheckCircleOutlined />
                                  ) : (
                                    <CloseCircleOutlined />
                                  )
                                }
                                className="status-tag"
                              >
                                {r.status ? "Active" : "Expired"}
                              </Tag>
                            </>
                          }
                          description={
                            <Space direction="vertical">
                              <div className="company-info">
                                <ShopOutlined /> {r.customer.companyName}
                              </div>
                              <div className="expiry-info">
                                <CalendarOutlined />
                                Expires:{" "}
                                {dayjs(r.expiryDate).format("MMM D, YYYY")}
                              </div>
                            </Space>
                          }
                          // description={
                          //   <TimelineCompact
                          //     purchase={r.purchaseDate}
                          //     renewal={r.renewalDate}
                          //     expiry={r.expiryDate}
                          //   />
                          // }
                        />
                      </Card>
                    </Badge.Ribbon>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      </div>

      {/* Enhanced Detail Modal */}
      <Modal
        style={{ top: 10 }}
        // visible={isModalVisible}
        open={isModalVisible}
        afterOpenChange={(open) => !open && closeModal()}
        title={
          <>
            <AlertOutlined /> Renewal Details
          </>
        }
        onCancel={closeModal}
        footer={[
          <Space key="footer">
           {/* <Button key="history" icon={<HistoryOutlined />}>
             View History
           </Button>,
           <Button key="notify" icon={<NotificationOutlined />}>
             Notify Customer
           </Button>, */}
           
            {/* Cancel Renewal */}
            {selected && (
              <Button
                danger
                icon={<CloseCircleOutlined />}
                loading={loading}
                disabled={loading}
                onClick={() => onCancelRenewal(selected.id)}
              >
                Cancel Renewal
              </Button>
            )}

            {/* Autofil Renewal (existing) */}
            {selected && (
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                loading={loading} // show spinner during update
                disabled={!selected.status || loading} // guard against invalid state
                onClick={() => onAutofill(selected.id)}
                aria-label="Initiate Renewal Autofill"
              >
                Initiate Renewal
              </Button>
            )}

            {/* Edit Dates */}
            {selected && (
              <Button
                icon={<CalendarOutlined />}
                onClick={showEditDates}
                disabled={loading}
              >
                Edit Dates
              </Button>
            )}
          </Space>,
        ]}
        className="detail-modal"
        width={800}
        centered
      >
        {selected && (
          <>
            <div className="modal-content">
              {/* Product Section */}
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Product" span={2}>
                  <Space>
                    {/* <img
                    src={selected.product.imageUrl}
                    alt={selected.product.productName}
                    className="product-image"
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }}
                  /> */}
                    <div>
                      <Title level={4} style={{ margin: "0" }}>
                        {selected.product.productName}
                      </Title>
                      <Text type="secondary">
                        {selected.product.description}
                      </Text>
                    </div>
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label="Price">
                  ₹ {selected.product.productPrice}
                </Descriptions.Item>

                <Descriptions.Item label="Specifications">
                  <ul className="spec-list">
                    {Object.entries(selected.product?.specifications || {}).map(
                      ([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      )
                    )}
                  </ul>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              {/* Timeline Section */}
              <Title level={5}>Renewal Timeline</Title>
              <Timeline mode="alternate">
                <Timeline.Item
                  color="green"
                  label={dayjs(selected.purchaseDate).format("MMM D, YYYY")}
                >
                  Purchase Date
                </Timeline.Item>
                <Timeline.Item
                  color="blue"
                  label={dayjs(selected.expiryDate).format("MMM D, YYYY")}
                >
                  Expiry Date
                </Timeline.Item>
                <Timeline.Item
                  color="red"
                  label={dayjs(selected.renewalDate).format("MMM D, YYYY")} //renewalDate
                >
                  Next Renewal
                </Timeline.Item>
              </Timeline>

              <Divider />

              {/* Customer Section */}
              <Descriptions
                bordered
                title={
                  <>
                    <ContactsOutlined /> Customer Details
                  </>
                }
              >
                <Descriptions.Item label="Company">
                  {selected.customer.companyName}
                </Descriptions.Item>
                <Descriptions.Item label="Contact">
                  {selected.customer.contactPerson}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selected.customer.mobileNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={2}>
                  <a href={`mailto:${selected.customer.email}`}>
                    {selected.customer.email}
                  </a>
                </Descriptions.Item>
                {/* <Descriptions.Item label="Address" span={3}>
                {selected.customer.address.street},{" "}
                {selected.customer.address.area}
              </Descriptions.Item> */}
              </Descriptions>

              {/* Partner Section */}
              {selected.customer.partner ? (
                <>
                  <Divider />
                  <Descriptions
                    bordered
                    title={
                      <>
                        <ContactsOutlined /> Partner Details
                      </>
                    }
                  >
                    <Descriptions.Item label="Company">
                      {selected.customer.partner.companyName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Contact">
                      {selected.customer.partner.firstName}{" "}
                      {selected.customer.partner.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      {selected.customer.partner?.contactInfo?.mobileNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email" span={2}>
                      <a href={`mailto:${selected.customer.partner.email}`}>
                        {selected.customer.partner.email}
                      </a>
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="Address" span={3}>
                {selected.customer.address.street},{" "}
                {selected.customer.address.area}
              </Descriptions.Item> */}
                  </Descriptions>
                </>
              ) : (
                ""
              )}
            </div>
          </>
        )}
      </Modal>

      {/* manual Date Modal */}
      <Modal
        title="Edit Renewal Dates"
        open={isEditDatesVisible}
        onCancel={closeEditDates}
        onOk={() => {
          form.validateFields().then((values) => {
            const { purchaseDate, expiryDate, renewalDate } = values;
            dispatch(
              updateReminder({
                id: selected!.id,
                query: "mode=manual",
                data: {
                  purchaseDate: purchaseDate.toISOString(),
                  expiryDate: expiryDate.toISOString(),
                  renewalDate: renewalDate.toISOString(),
                },
              })
            )
              .unwrap()
              .then(() => {
                message.success("Dates updated");
                closeEditDates();
                closeModal();
              })
              .catch((msg) => message.error(msg));
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="purchaseDate"
            label="Purchase Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="expiryDate"
            label="Expiry Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="renewalDate"
            label="Renewal Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
