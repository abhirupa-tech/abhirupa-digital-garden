/**
 * Career history for the About page timeline. Sourced from LinkedIn and grouped
 * by company (newest first) so the timeline can express a sensible hierarchy:
 * a company, then the progression of roles held within it.
 */

export type RoleIcon = 'agent' | 'pane' | 'mic' | 'sigma' | 'mobile';

export type CareerRole = {
  title: string;
  /** Line-art glyph shown on the role card. */
  icon: RoleIcon;
  /** Full-time, Internship, … */
  employment: string;
  /** Human-readable span, e.g. "Mar 2025 — Present". */
  period: string;
  /** Tenure length, e.g. "1 yr 5 mos". */
  duration: string;
  location: string;
  /** On-site / Remote / Hybrid, when noted. */
  mode?: string;
  summary: string;
  stack: string[];
};

export type CareerCompany = {
  company: string;
  /** Big display marker for the group — the starting year. */
  year: string;
  /** Full span across all roles, e.g. "2020 — 2025". */
  span: string;
  /** Total tenure at the company, when it spans multiple roles. */
  totalDuration?: string;
  location: string;
  /** Roles held, most senior / most recent first. */
  roles: CareerRole[];
};

export const career: CareerCompany[] = [
  {
    company: 'Slack',
    year: '2025',
    span: '2025 — Present',
    location: 'Bengaluru, India',
    roles: [
      {
        title: 'Senior Frontend Engineer, SMTS',
        icon: 'agent',
        employment: 'Full-time',
        period: 'Mar 2025 — Present',
        duration: '1 yr 5 mos',
        location: 'Bengaluru, India',
        mode: 'On-site',
        summary:
          'Building user experiences for the Slackforce Intelligence team — primarily the Agent Profile View and the Slack Admin pages for Enterprise and Biz users. Also integrated Salesforce MCP servers within Slackbot, and the Salesforce Agents that followed.',
        stack: ['React.js', 'TypeScript'],
      },
    ],
  },
  {
    company: 'Microsoft',
    year: '2020',
    span: '2020 — 2025',
    totalDuration: '4 yrs 3 mos',
    location: 'Noida, India',
    roles: [
      {
        title: 'Software Engineer 2',
        icon: 'pane',
        employment: 'Full-time',
        period: 'Feb 2023 — Mar 2025',
        duration: '2 yrs 2 mos',
        location: 'India',
        summary:
          'Worked intensively on performance and user experience for the Microsoft Copilot side pane across every M365 Office app and platform. Shared ownership of the integrated, seamless Copilot experience.',
        stack: ['ReactJS', 'TypeScript', 'Relay', 'Fluent UI'],
      },
      {
        title: 'Software Engineer',
        icon: 'mic',
        employment: 'Full-time',
        period: 'Jul 2021 — Mar 2025',
        duration: '3 yrs 9 mos',
        location: 'Noida, India',
        summary:
          'Contributed to voice dictation capabilities in Word and Outlook for Android, and improved the microphone click funnel. Tech stack spanned Android, a shared C++ library, and Kotlin for Outlook mobile integration.',
        stack: ['Android', 'C++', 'Kotlin'],
      },
      {
        title: 'Software Engineering Intern',
        icon: 'sigma',
        employment: 'Internship',
        period: 'Jan 2021 — Jul 2021',
        duration: '7 mos',
        location: 'Noida, India',
        summary:
          "Built mathematical expression conversion — from voice to math-powered text within Word on the web — letting users 'speak out' complicated equations.",
        stack: ['Speech', 'Word Web'],
      },
      {
        title: 'Software Engineer Intern',
        icon: 'mobile',
        employment: 'Internship',
        period: 'May 2020 — Jul 2020',
        duration: '3 mos',
        location: 'India',
        summary:
          'Developed a Language Understanding Intelligent System for an iOS application.',
        stack: ['LUIS', 'iOS'],
      },
    ],
  },
];
