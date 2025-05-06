// import { Row } from 'antd';
// import {
//   PageHeader,
//   CustomerList
// } from '../../components';
// import { Helmet } from 'react-helmet-async';

// export const CustomerListPage = () => {

//   return (
//     <div>
//       <Helmet>
//         <title>Customer | CPM Dashboard</title>
//       </Helmet>
//       <PageHeader
//         title="Add New Customer"
//         breadcrumbs={[

//           {
//             title: (
//               <>
//                 <span>Customer</span>
//               </>
//             ),

//           },
//           {
//             title: 'Add Customer',

//           },
//         ]}
//       />
//       <Row
//         gutter={[
//           { xs: 8, sm: 16, md: 24, lg: 32 },
//           { xs: 8, sm: 16, md: 24, lg: 32 },
//         ]}
//       >
//         <CustomerList />
//       </Row>
//     </div>
//   );
// };

import React from "react";
import { Row } from "antd";
import { PageHeader, CustomerList } from "../../components";
import { Helmet } from "react-helmet-async";

const breadcrumbs = [
  {
    title: (
      <>
        <span>Customer</span>
      </>
    ),
  },
  { title: "List" },
];


export const CustomerListPage: React.FC = React.memo(() => {
  return (
    <div>
      <Helmet>
        <title>Customer List | CPM Dashboard</title>
      </Helmet>

      <PageHeader title="Customer List" breadcrumbs={breadcrumbs} />

      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        <CustomerList />
      </Row>
    </div>
  );
});
