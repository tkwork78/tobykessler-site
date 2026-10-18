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
  A company with "page" and "sections" gets its own page (see TF Cornerstone).

  About page: edit the "about" block below. Each line in "bio" is one
  paragraph. "Selected work" is built from the "design" list automatically.
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
      'My work spans websites, tradeshow booths, proposals and print for Triton Construction, and social campaigns, launch content and photography for TF Cornerstone.'
    ],
    skills: ['Brand & marketing design', 'Proposals & RFP packages', 'Web design', 'Tradeshow & environmental', 'Social content', 'Photography']
  },

  design: [
    {
      id: 'triton',
      company: 'Triton Construction',
      summary: 'Website, tradeshow, proposal and project documentation design for a construction company with offices in New York City, Upstate New York and Florida.',
      items: [
        { src: 'images/triton/website-redesign.svg', width: 1600, height: 1000, title: 'Website redesign', meta: 'Web' },
        { src: 'images/triton/nyssba-booth.svg', width: 1600, height: 1067, title: 'NYSSBA tradeshow booth', meta: 'Environmental' },
        { src: 'images/triton/proposal-cover.svg', width: 1080, height: 1400, title: 'Proposal design', meta: 'Print' },
        { src: 'images/triton/project-sheet.svg', width: 1200, height: 1200, title: 'Project sheets', meta: 'Print' },
        { src: 'images/triton/rfp-package.svg', width: 1600, height: 1000, title: 'RFP response package', meta: 'Print' },
        { src: 'images/triton/tradeshow-banner.svg', width: 900, height: 1600, title: 'Tradeshow banner', meta: 'Print' }
      ]
    },
    {
      id: 'tf-cornerstone',
      company: 'TF Cornerstone',
      summary: 'Floor plans, email templates and social content for a New York real estate developer.',
      page: 'design-tf-cornerstone.html',   // has its own page, set up below
      sections: [
        {
          id: 'floor-plans',
          title: 'Floor plans',
          items: [
            { src: 'images/tf-cornerstone/floor-plan-01.svg', width: 1600, height: 1200, title: 'Floor plan', meta: 'Placeholder' },
            { src: 'images/tf-cornerstone/floor-plan-02.svg', width: 1600, height: 1200, title: 'Floor plan', meta: 'Placeholder' },
            { src: 'images/tf-cornerstone/floor-plan-03.svg', width: 1600, height: 1200, title: 'Floor plan', meta: 'Placeholder' }
          ]
        },
        {
          id: 'email-templates',
          title: 'Email templates',
          items: [
            { src: 'images/tf-cornerstone/email-01.svg', width: 600, height: 1500, title: 'Email template', meta: 'Placeholder' },
            { src: 'images/tf-cornerstone/email-02.svg', width: 600, height: 1500, title: 'Email template', meta: 'Placeholder' },
            { src: 'images/tf-cornerstone/email-03.svg', width: 600, height: 1500, title: 'Email template', meta: 'Placeholder' }
          ]
        }
      ],
      // Blog posts: add one line per post, e.g.
      //   { title: 'Post title', meta: 'Category', url: 'https://...' },
      blog: [
        { title: 'How to Take the NYC Ferry: Long Island City, Queens', meta: 'Living in NYC', url: 'https://tfc.com/blog/living-in-nyc/how-to-take-the-nyc-ferry-long-island-city-queens' },
        { title: 'Explore the Amenities at Malt Drive', meta: 'Apartment hunt guide', url: 'https://tfc.com/blog/nyc-apartment-hunt-guide/explore-the-amenities-at-malt-drive' },
        { title: 'Weekend Getaway Ideas from TFC Buildings', meta: 'Community', url: 'https://tfc.com/blog/tfc-nyc-community/weekend-getaway-ideas-from-tfc-buildings' },
        { title: 'Introducing 220 & 221 Malt Drive, Hunters Point South', meta: 'News & events', url: 'https://tfc.com/blog/news-events/introducing-220-221-malt-drive-hunters-point-south-queens' },
        { title: 'Matt Shlian at 220 Malt Drive', meta: 'News & events', url: 'https://tfc.com/blog/news-events/matt-shlian-220-malt-drive' },
        { title: 'Decorating with Limited Space: A Functional Living Room', meta: 'Living in NYC', url: 'https://tfc.com/blog/living-in-nyc/decorating-with-limited-space-establishing-a-functional-living-room' },
        { title: '595 Dean St Amenities: Luxury Apartments in Brooklyn', meta: 'Apartment hunt guide', url: 'https://tfc.com/blog/nyc-apartment-hunt-guide/595-dean-st-amenities-luxury-apartments-brooklyn' },
        { title: 'Special Offer: 50% Off Chelsea Piers Fitness, Prospect Heights', meta: 'News & events', url: 'https://tfc.com/blog/news-events/special-offer-50-off-chelsea-piers-fitness-prospect-heights' },
        { title: 'Sculpture Garden at Hunters Point South', meta: 'News & events', url: 'https://tfc.com/blog/news-events/sculpture-garden-at-hunters-point-south' }
      ],
      // Instagram: paste post links (https://www.instagram.com/p/...) into posts to embed them.
      // With no posts, the page shows a link to the account instead.
      instagram: {
        handle: 'tfcornerstone',
        posts: []
      }
    }
  ],

  photography: {
    summary: 'Personal work.',
    items: [
      { src: 'images/photography/blue-and-red-wall.jpg', width: 2400, height: 1500, alt: 'Blue and red painted walls' },
      { src: 'images/photography/jump-start.jpg', width: 1500, height: 1001, alt: 'Two cars being jump-started on a street' },
      { src: 'images/photography/stop-signs.jpg', width: 1500, height: 1001, alt: 'Stop and do-not-enter signs at a street corner' },
      { src: 'images/photography/sunflower-mural.jpg', width: 1001, height: 1500, alt: 'Sunflower mural behind a chain-link fence' },
      { src: 'images/photography/red-trees.jpg', width: 1200, height: 1500, alt: 'Red trees in front of a house' },
      { src: 'images/photography/desert-yucca.jpg', width: 1000, height: 1500, alt: 'Yucca plants outside a desert building' },
      { src: 'images/photography/fallen-tree.jpg', width: 1000, height: 1500, alt: 'Fallen tree across a green bench' },
      { src: 'images/photography/birds-in-sky.jpg', width: 1500, height: 1000, alt: 'Flock of birds against a blue sky' },
      { src: 'images/photography/u-do-it-at-night.jpg', width: 1000, height: 1500, alt: 'U-Do-It sign at night behind a fence' },
      { src: 'images/photography/plastic-bag.jpg', width: 2400, height: 1600, alt: 'Person carrying a large plastic bag on a city sidewalk' },
      { src: 'images/photography/green-house-at-dusk.jpg', width: 1000, height: 1500, alt: 'Green house at dusk' },
      { src: 'images/photography/seagulls.jpg', width: 1200, height: 800, alt: 'Seagulls taking off in a parking lot' },
      { src: 'images/photography/dark-workshop.jpg', width: 1500, height: 1000, alt: 'Dim cluttered workshop' },
      { src: 'images/photography/smoky-park.jpg', width: 2400, height: 1600, alt: 'Tree in a park under smoky orange sky' },
      { src: 'images/photography/overgrown-garden.jpg', width: 2400, height: 1600, alt: 'Overgrown garden in the woods' },
      { src: 'images/photography/hand-with-coin.jpg', width: 1500, height: 1000, alt: 'Open hand holding a coin in window light' }
    ]
  }
};
