// Core types for the Landart Garden Guide (Build Spec section 6).
// Content lives in typed data files under src/data; these are the shapes those files fill.

export type Tag = string; // e.g. "sun:full", "soil:sandy", "style:modern"

export type MaintenanceLoad = "low" | "balanced" | "high";

export interface QuestionOption {
  id: string;
  label: string;
  helper?: string;
  icon: string; // Tabler outline name, e.g. "ti-sun"
  tags: Tag[];
}

export interface Question {
  id: string;
  title: string;
  helper: string;
  multiSelect?: boolean;
  maxSelect?: number;
  options: QuestionOption[];
}

export interface Plant {
  id: string;
  name: string; // common name
  botanical: string;
  note: string; // one line on why it works
  requires: Tag[]; // must all be present
  prefers: Tag[]; // boosts score
  avoid?: Tag[]; // disqualify if present (e.g. toxic around who:children)
  maintenance: MaintenanceLoad;
  priority?: number; // curated tiebreak, higher wins
}

export interface Feature {
  id: string;
  name: string; // e.g. "Plunge pool"
  note: string;
  prefers: Tag[];
  requiresSize?: Tag[]; // e.g. lap pool needs size:large
  requires?: Tag[]; // general hard requirements
  avoid?: Tag[];
  maintenance: MaintenanceLoad;
  link?: string; // Landart page (path or absolute URL)
  priority?: number;
}

export interface StyleProfile {
  id: string; // matches a style:* tag, e.g. "style:modern"
  name: string; // "Structured and modern"
  summary: string; // 2-3 sentences for the result header
  materials: string; // materials and palette steer
}

export interface LinkTarget {
  label: string;
  url: string; // path (resolved against the Landart site) or absolute URL
  kind: "project" | "service" | "article";
  matchTags: Tag[];
  priority?: number;
}

// --- Answers + result -------------------------------------------------------

// Map of questionId -> selected option ids (array supports multi-select questions).
export type Answers = Record<string, string[]>;

export interface ResultPlant {
  name: string;
  botanical: string;
  note: string;
}

export interface ResultFeature {
  name: string;
  note: string;
  link?: string;
}

export interface ResultLink {
  label: string;
  url: string;
  kind: LinkTarget["kind"];
}

export interface GuideResult {
  style: {
    id: string;
    name: string;
    summary: string;
    materials: string;
  };
  // Tag-matched hero image (path under /public). Renders only if the file exists.
  image: { src: string; alt: string };
  plants: ResultPlant[];
  features: ResultFeature[];
  maintenanceNote: string;
  links: ResultLink[];
  // A short teaser used on the preview screen before capture.
  teaser: {
    styleName: string;
    summaryLine: string;
    headlineItems: string[]; // 2-3 items
  };
}
