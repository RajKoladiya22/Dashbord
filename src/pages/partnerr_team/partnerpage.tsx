import { PageHeader, PartnerList } from "../../components";

import { Helmet } from "react-helmet-async";
import React from "react";

export const PartnerPage: React.FC = React.memo(() => {
  return (
    <div>
      <Helmet>
        <title>Partner | CPM Dashboard</title>
      </Helmet>
      <PageHeader
        title="Our Partners"
        breadcrumbs={[
          {
            title: (
              <>
                <span>Partner-Team</span>
              </>
            ),
          },
          {
            title: "Partner",
          },
        ]}
      />

      <PartnerList />
    </div>
  );
});
