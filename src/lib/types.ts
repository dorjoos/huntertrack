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

export interface YwhHunterProfile {
  username: string;
  slug: string;
  public_firstname: string | null;
  public_lastname: string | null;
  hunter_profile: {
    public: boolean;
    website: string | null;
    website_url: string | null;
    github: string | null;
    twitter: string | null;
    skills: string[];
    supported_languages: string[];
  };
  points: number;
  nb_reports: number;
  rank: number | null;
  impact: number | null;
  kyc_status: string;
  avatar: {
    url?: string;
  } | null;
  nationality: string | null;
  joined_on: string;
}
