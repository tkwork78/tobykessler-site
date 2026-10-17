/*
  ============================================================
  YOUR CONTENT — edit this file to update the site.
  ============================================================
  For each image:
    src     the image file inside the images/ folder
    width   the image's real width in pixels   } only the ratio matters,
    height  the image's real height in pixels  } but it must be right
    title   bold line under the image
    meta    grey line under the title (client, type, year)
    alt     short description for screen readers (optional)

  To swap a placeholder: put your photo in the right images/ folder
  (e.g. images/triton/website.jpg), change src to that name,
  and update width and height.
  The first 3 images of each section also appear on the home page.

  About page: edit the "about" block below. Each line in "bio" is one
  paragraph. Experience is built from the "design" list automatically.
*/
window.SITE = {
  name: 'Toby Kessler',
  intro: 'Designer and photographer in New York. Marketing, proposals, social content and personal photography.',
  email: 'tobykessler.work@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' }
  ],

  about: {
    bio: [
      'I\'m a designer and photographer based in New York. I work in-house on marketing, proposal, web and social design, and I shoot personal photography on the side.',
      'Right now I\'m Marketing & Proposal Coordinator at Triton Construction. Before that I developed social media and content for TF Cornerstone.'
    ],
    skills: ['Brand & marketing design', 'Proposals & RFP packages', 'Web design', 'Tradeshow & environmental', 'Social content', 'Photography']
  },

  design: [
    {
      id: 'triton',
      company: 'Triton Construction',
      role: 'Marketing & Proposal Coordinator',
      years: '2025 – present',
      summary: 'Website, tradeshow, proposal and project documentation design for a construction company with offices in New York City, Upstate New York and Florida.',
      items: [
        { src: 'images/triton/website-redesign.svg', width: 1600, height: 1000, title: 'Website redesign', meta: 'Web — 2026' },
        { src: 'images/triton/nyssba-booth.svg', width: 1600, height: 1067, title: 'NYSSBA tradeshow booth', meta: 'Environmental — 2026' },
        { src: 'images/triton/proposal-cover.svg', width: 1080, height: 1400, title: 'Proposal design', meta: 'Print — 2026' },
        { src: 'images/triton/project-sheet.svg', width: 1200, height: 1200, title: 'Project sheets', meta: 'Print — 2025' },
        { src: 'images/triton/rfp-package.svg', width: 1600, height: 1000, title: 'RFP response package', meta: 'Print — 2026' },
        { src: 'images/triton/tradeshow-banner.svg', width: 900, height: 1600, title: 'Tradeshow banner', meta: 'Print — 2026' }
      ]
    },
    {
      id: 'tf-cornerstone',
      company: 'TF Cornerstone',
      role: 'Social Media & Content Developer',
      years: '2023 – 2025',
      summary: 'Social campaigns, launch content and photography for a New York real estate developer.',
      items: [
        { src: 'images/tf-cornerstone/social-campaign.svg', width: 1080, height: 1350, title: 'Social campaign', meta: 'Social — 2024' },
        { src: 'images/tf-cornerstone/building-launch.svg', width: 1600, height: 900, title: 'Building launch', meta: 'Video & stills — 2024' },
        { src: 'images/tf-cornerstone/resident-event.svg', width: 1600, height: 1067, title: 'Resident events', meta: 'Photography — 2024' },
        { src: 'images/tf-cornerstone/instagram-grid.svg', width: 1200, height: 1200, title: 'Instagram grid', meta: 'Social — 2023' },
        { src: 'images/tf-cornerstone/content-series.svg', width: 1080, height: 1350, title: 'Content series', meta: 'Social — 2025' },
        { src: 'images/tf-cornerstone/amenity-shoot.svg', width: 1600, height: 1067, title: 'Amenity shoot', meta: 'Photography — 2025' }
      ]
    }
  ],

  photography: {
    summary: 'Personal work.',
    items: [
      { src: 'images/photography/photo-01.svg', width: 1600, height: 1067, title: 'Untitled', meta: 'New York, 2025' },
      { src: 'images/photography/photo-02.svg', width: 1000, height: 1500, title: 'Untitled', meta: 'New York, 2025' },
      { src: 'images/photography/photo-03.svg', width: 1600, height: 1067, title: 'Untitled', meta: '2024' },
      { src: 'images/photography/photo-04.svg', width: 1200, height: 1500, title: 'Untitled', meta: '2024' },
      { src: 'images/photography/photo-05.svg', width: 1600, height: 900, title: 'Untitled', meta: '2024' },
      { src: 'images/photography/photo-06.svg', width: 1067, height: 1600, title: 'Untitled', meta: '2023' },
      { src: 'images/photography/photo-07.svg', width: 1600, height: 1067, title: 'Untitled', meta: '2023' },
      { src: 'images/photography/photo-08.svg', width: 1200, height: 1200, title: 'Untitled', meta: '2022' },
      { src: 'images/photography/photo-09.svg', width: 1600, height: 1067, title: 'Untitled', meta: '2021' }
    ]
  }
};
