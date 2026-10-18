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
      summary: 'Floor plans, email templates and print advertising for a New York real estate developer.',
      page: 'design-tf-cornerstone.html',   // has its own page, set up below
      sections: [
        {
          id: 'floor-plans',
          title: 'Floor plans',
          items: [
            { src: 'images/tf-cornerstone/floorplans/220MALT_803-TK_GR-Notes_125%25-200%25.jpg', width: 1855, height: 2400, title: '220 Malt Drive', meta: 'Floor plan' }
          ]
        },
        {
          id: 'email-templates',
          title: 'Email templates',
          items: [
            { src: 'images/tf-cornerstone/email%20templates/2023-10-13_OLR_595-Dean-St-Final-(1)-1.jpg', width: 1200, height: 4200, title: '595 Dean St', meta: 'Email' },
            { src: 'images/tf-cornerstone/email%20templates/Malt_Dr_2024-9-06-2024-OLR-1.jpg', width: 1200, height: 4725, title: 'Malt Drive', meta: 'Email' },
            { src: 'images/tf-cornerstone/email%20templates/Weekly-Listings-Midtown-4-Template_2024-10-24-1.jpg', width: 1200, height: 4761, title: 'Weekly listings, Midtown', meta: 'Email' }
          ]
        },
        {
          id: 'print-advertising',
          title: 'Print advertising',
          items: [
            { src: 'images/tf-cornerstone/print%20advertising/2024_myTFC_ReferAFriend-1.jpg', width: 1934, height: 2400, title: 'myTFC refer-a-friend', meta: 'Print' },
            { src: 'images/tf-cornerstone/print%20advertising/CP-Refer-A-Friend-Card-Revised-08-28-23-1.jpg', width: 988, height: 2400, title: 'Refer-a-friend card, front', meta: 'Print' },
            { src: 'images/tf-cornerstone/print%20advertising/CP-Refer-A-Friend-Card-Revised-08-28-23-2.jpg', width: 988, height: 2400, title: 'Refer-a-friend card, back', meta: 'Print' },
            { src: 'images/tf-cornerstone/print%20advertising/Malt-Drive-Welcome-Card.jpg', width: 1500, height: 2100, title: 'Malt Drive welcome card', meta: 'Print' }
          ]
        }
      ],
      // Blog posts: add one line per post, e.g.
      //   { title: 'Post title', meta: 'Category', url: 'https://...', image: 'images/tf-cornerstone/blog/post.jpg' },
      // image is optional; without it the card shows a plain panel.
      blog: [
        { title: 'How to Take the NYC Ferry from Long Island City and Hunter’s Point South', meta: 'Living in NYC', url: 'https://tfc.com/blog/living-in-nyc/how-to-take-the-nyc-ferry-long-island-city-queens', image: 'images/tf-cornerstone/blog%20previews/How%20to%20Take%20the%20NYC%20Ferry%20from%20Long%20Island%20City%20and%20Hunter%27s%20Point%20South.jpeg' },
        { title: 'Explore the Amenities at Malt Drive', meta: 'Apartment hunt guide', url: 'https://tfc.com/blog/nyc-apartment-hunt-guide/explore-the-amenities-at-malt-drive', image: 'images/tf-cornerstone/blog%20previews/malt-drive-ammenity-blog-cover.jpeg' },
        { title: 'Weekend Getaway Ideas from TFC Buildings', meta: 'Community', url: 'https://tfc.com/blog/tfc-nyc-community/weekend-getaway-ideas-from-tfc-buildings', image: 'images/tf-cornerstone/blog%20previews/Weekend%20Getaway%20Ideas%20from%20TFC%20Buildings.jpeg' },
        { title: 'Introducing 2-20 and 2-21 Malt Drive: TFC’s Newest Buildings', meta: 'News & events', url: 'https://tfc.com/blog/news-events/introducing-220-221-malt-drive-hunters-point-south-queens', image: 'images/tf-cornerstone/blog%20previews/Introducing%202-20%20and%202-21%20Malt%20Drive%20-%20TFC%27s%20Newest%20Buildings.jpeg' },
        { title: 'Malt Drive Artists in Focus: Matthew Shlian', meta: 'News & events', url: 'https://tfc.com/blog/news-events/matt-shlian-220-malt-drive', image: 'images/tf-cornerstone/blog%20previews/Malt%20Drive-%20Artists%20in%20Focus%20Matthew%20Shlian.jpeg' },
        { title: 'How to Furnish a Small Apartment', meta: 'Living in NYC', url: 'https://tfc.com/blog/living-in-nyc/decorating-with-limited-space-establishing-a-functional-living-room', image: 'images/tf-cornerstone/blog%20previews/How%20To%20Furnish%20a%20Small%20Apartment.jpeg' },
        { title: 'Explore the Amenities at 595 Dean St', meta: 'Apartment hunt guide', url: 'https://tfc.com/blog/nyc-apartment-hunt-guide/595-dean-st-amenities-luxury-apartments-brooklyn', image: 'images/tf-cornerstone/blog%20previews/Explore%20The%20Amenities%20at%20595%20Dean%20St.jpeg' },
        { title: 'Chelsea Piers Fitness Prospect Heights Welcomes 595 Dean St', meta: 'News & events', url: 'https://tfc.com/blog/news-events/special-offer-50-off-chelsea-piers-fitness-prospect-heights', image: 'images/tf-cornerstone/blog%20previews/Chelsea%20Piers%20Fitness%20Prospect%20Heights%20Welcomes%20595%20Dean%20St.jpeg' },
        { title: 'Sculpture Garden at Hunter’s Point South', meta: 'News & events', url: 'https://tfc.com/blog/news-events/sculpture-garden-at-hunters-point-south', image: 'images/tf-cornerstone/blog%20previews/culpture%20Garden%20at%20Hunter%27s%20Point%20South.jpeg' }
      ]
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
