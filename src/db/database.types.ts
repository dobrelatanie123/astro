export interface Claim {
  claim_id: string;
  video_id: string;
  timestamp: string;
  segment_text: string;
  author_mentioned: string | null;
  author_normalized: string | null;
  institution_mentioned: string | null;
  finding_summary: string;
  confidence: 'high' | 'medium' | 'low';
  primary_query: string;
  paper_url: string | null;
  paper_title: string | null;
  paper_authors: string | null;
  paper_year: number | null;
  paper_abstract: string | null;
  verification_verdict: 'verified' | 'partially_supported' | 'inconclusive' | 'partially_refuted' | 'refuted' | 'no_paper_found' | null;
  verification_explanation: string | null;
  verification_score: number | null;  // -100 to +100
  verified_from: 'abstract' | 'full_text' | 'none' | null;
  is_open_access: boolean;
  verified_at: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      claims: {
        Row: Claim;
        Insert: Partial<Claim> & Pick<Claim, 'claim_id' | 'video_id' | 'segment_text' | 'finding_summary' | 'confidence' | 'primary_query'>;
        Update: Partial<Claim>;
      };
    };
  };
}

