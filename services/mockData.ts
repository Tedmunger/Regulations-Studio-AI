// This mimics the parsed XML output that 'feedparser' would provide in the Python backend.
// We use this because real-time cross-origin RSS fetching is blocked by browsers.

export const MOCK_RAW_RSS_ITEMS = [
  // FDA (Medicine)
  {
    sourceId: 'fda-drug-safety',
    title: 'URGENT: Voluntary Recall of Acetaminophen Tablets Due to Potential Contamination',
    summary: 'PharmaCorp is issuing a voluntary recall for Lot #4522 due to the presence of trace impurities. This warning applies to all 500mg bottles distributed in the Northeast region.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    link: 'https://www.fda.gov/safety/recalls'
  },
  {
    sourceId: 'fda-drug-safety',
    title: 'Draft Guidance: AI in Drug Manufacturing',
    summary: 'The FDA is issuing draft guidance open for public comment regarding the implementation of Artificial Intelligence in GMP facilities. Comments due by July 30th.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    link: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents'
  },
  {
    sourceId: 'fda-drug-safety',
    title: 'Podcast: Understanding the New Labeling Requirements',
    summary: 'In this episode, we discuss the changes to over-the-counter labeling standards taking effect next year.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    link: 'https://www.fda.gov/drugs/news-events-human-drugs/podcast'
  },

  // EPA (Environment)
  {
    sourceId: 'epa-news',
    title: 'Ban on Certain PFAS Chemicals in Food Packaging Finalized',
    summary: 'The EPA has finalized a ban on three specific PFAS substances used in grease-proofing agents for food packaging, citing health risks.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    link: 'https://www.epa.gov/newsroom'
  },
  {
    sourceId: 'epa-news',
    title: 'Consultation: New Water Quality Standards for Heavy Metals',
    summary: 'We are seeking consultation from industry stakeholders regarding proposed updates to the Clean Water Act limits for lead and copper.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    link: 'https://www.epa.gov/wqs-tech'
  },
  {
    sourceId: 'epa-news',
    title: 'EPA Awards Grant for Urban Garden Projects',
    summary: 'Local communities in Detroit receive $2M in grants to improve green spaces and reduce runoff.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    link: 'https://www.epa.gov/grants'
  },

  // NIST (AI/Tech)
  {
    sourceId: 'nist-tech',
    title: 'NIST Releases AI Risk Management Framework 2.0',
    summary: 'The updated framework provides guidelines for trustworthy AI development.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    link: 'https://www.nist.gov/itm/ai'
  },
  {
    sourceId: 'nist-tech',
    title: 'Request for Information: Quantum Cryptography Standards',
    summary: 'NIST is requesting information/comment from the cryptography community regarding the post-quantum algorithms selected for standardization.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    link: 'https://www.nist.gov/news-events/news'
  },
  {
    sourceId: 'nist-tech',
    title: 'Warning: Vulnerability Detected in Common IoT Protocol',
    summary: 'A critical warning has been issued regarding a buffer overflow vulnerability in the Z-Wave protocol stack used in smart home devices.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    link: 'https://nvd.nist.gov'
  }
];