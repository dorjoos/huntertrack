export interface YwhHacktivityItem {
  date: string;
  report: {
    hunter: {
      username: string;
      slug: string;
      kyc_status: string;
      avatar: {
        url?: string;
      } | null;
    };
    bug_type: {
      name: string;
      short_name: string;
      slug: string;
      description: string;
      link: string;
      remediation_link: string | null;
    };
  };
  status: {
    workflow_state: string;
  };
}

export interface YwhHacktivityResponse {
  items: YwhHacktivityItem[];
}
