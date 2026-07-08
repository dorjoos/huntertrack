export interface YwhHacktivityItem {
  date: string;
  status: string;
  bug_type: {
    name: string;
    slug: string;
    description: string | null;
    link: string | null;
    remediation_link: string | null;
  };
  hunter: {
    username: string;
    slug: string;
    kyc_status: string;
    avatar: {
      url?: string;
    } | null;
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
