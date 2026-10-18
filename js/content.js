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
  intro: 'Designer and photographer in New York.',
  introPlace: 'New York',   // spins through introSpin on the home page, then lands here
  introSpin: ['Paris', 'Tokyo', 'London', 'Lisbon', 'Berlin', 'Seoul', 'Milan', 'Oslo', 'Sydney', 'Rome', 'Madrid', 'Kyoto'],
  email: 'tobykessler.work@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tobykessler/' }
  ],

  about: {
    bio: [
      'Marketing and proposal strategist specializing in construction and real estate. Experienced in content development and optimization. Formally trained in photography and design. I bring a creative, solution-driven approach that consistently helps win clients and delivers results.'
    ],
    skills: ['Brand & marketing design', 'Proposals & RFP packages', 'Web design', 'Tradeshow & environmental', 'Social content', 'Photography']
  },

  design: [
    {
      id: 'tf-cornerstone',
      company: 'TF Cornerstone',
      summary: 'At TF Cornerstone, I helped shape the marketing strategy for one of New York City’s largest real estate developers, with over 10,000 units across the city. I produced short-form social videos, wrote blog posts to engage current and prospective tenants, and led production of the Artists in Focus program, featuring local artists whose work is showcased in TF Cornerstone buildings through written spotlights, interviews, and video features. I was also involved in the launch and lease-up efforts for 595 Dean Street, as well as 2-20 and 2-21 Malt Drive, two significant residential developments in Brooklyn and Long Island City.',
      page: 'design-tf-cornerstone.html',   // has its own page, set up below
      summaryOnPageOnly: true,   // the description shows only on its own page
      sections: [
        {
          id: 'artists-in-focus',
          label: 'Video',
          title: 'Artists In Focus',
          credits: 'Production Team: Toby Kessler, Robbie Noble',   // shown under the videos
          // Videos with captions (caption text from images/text/Artists in Focus Captions.rtf).
          // An @handle in a caption becomes an Instagram link.
          videos: [
            { title: 'Judith Weller', src: 'images/tf-cornerstone/artists%20in%20focus/judith-artists%20in%20focus.mp4', poster: 'images/tf-cornerstone/artists%20in%20focus/judith-artists%20in%20focus.jpg', width: 720, height: 900, caption: 'For over 30 years, Judith Weller has pushed the limits of metal, shaping steel into raw human expression. Steel Ants Tango, her piece at 2-21 Malt Drive, is a reflection on movement, both in dance and in life. Inspired by the resilience of ants, the rhythm of tango, and her own journey as an artist, it’s a testament to transformation, perseverance, and play.' },
            { title: 'Christine Galvez', src: 'images/tf-cornerstone/artists%20in%20focus/christine-artists-in-focus.mp4', poster: 'images/tf-cornerstone/artists%20in%20focus/christine-artists-in-focus.jpg', width: 720, height: 1280, caption: 'Christine’s work gives metal a second life, shaped by fire, patience, and a sharp eye for transformation. She shares how each piece takes form.' },
            { title: 'Matthew Shlian', src: 'images/tf-cornerstone/artists%20in%20focus/matthew-artists-in-focus.mp4', poster: 'images/tf-cornerstone/artists%20in%20focus/matthew-artists-in-focus.jpg', width: 720, height: 1280, caption: 'Paper artist @matthewshlian creates intricate designs that draw from the building’s creative identity. Taking cues from Frank Lloyd Wright, and the Art Deco movement, his work infuses the space with thoughtful, geometric layers, adding depth and character to its modern aesthetic. Step inside Matt’s process and see how his artistry enhances Malt Drive’s vision.' },
            { title: 'Caroline McKeough', src: 'images/tf-cornerstone/artists%20in%20focus/caroline-artists-in-focus.mp4', poster: 'images/tf-cornerstone/artists%20in%20focus/caroline-artists-in-focus.jpg', width: 720, height: 1280, caption: 'Creating a sense of home starts the moment you step inside. Caroline McKeough shares how the lobby was designed to feel like a moment of calm at the end of the day.' }
          ]
        },
        {
          id: 'floor-plans',
          title: 'Floor Plans',
          items: [
            { src: 'images/tf-cornerstone/floorplans/220MALT_803-TK_GR-Notes_125%25-200%25.jpg', width: 1855, height: 2400, title: '220 Malt Drive', meta: 'Floor plan' }
          ]
        },
        {
          id: 'email-templates',
          full: true,   // show whole emails, no cropping
          zoom: true,   // click in the lightbox to zoom in and scroll
          title: 'Email Templates',
          items: [
            { src: 'images/tf-cornerstone/email%20templates/2023-10-13_OLR_595-Dean-St-Final-(1)-1.jpg', width: 1200, height: 4200, title: '595 Dean St', meta: 'Email' },
            { src: 'images/tf-cornerstone/email%20templates/Malt_Dr_2024-9-06-2024-OLR-1.jpg', width: 1200, height: 4725, title: 'Malt Drive', meta: 'Email' },
            { src: 'images/tf-cornerstone/email%20templates/Weekly-Listings-Midtown-4-Template_2024-10-24-1.jpg', width: 1200, height: 4761, title: 'Weekly Listings, Midtown', meta: 'Email' }
          ]
        },
        {
          id: 'print-advertising',
          title: 'Print Advertising And Assets',
          items: [
            { src: 'images/tf-cornerstone/print%20advertising/2024_myTFC_ReferAFriend-1.jpg', width: 1934, height: 2400, title: 'MyTFC Refer-A-Friend', meta: 'Print' },
            { src: 'images/tf-cornerstone/print%20advertising/CP-Refer-A-Friend-Card-Revised-08-28-23-1.jpg', width: 988, height: 2400, title: 'Refer-A-Friend Card, Front', meta: 'Print' },
            { src: 'images/tf-cornerstone/print%20advertising/CP-Refer-A-Friend-Card-Revised-08-28-23-2.jpg', width: 988, height: 2400, title: 'Refer-A-Friend Card, Back', meta: 'Print' },
            { src: 'images/tf-cornerstone/print%20advertising/Malt-Drive-Welcome-Card.jpg', width: 1500, height: 2100, title: 'Malt Drive Welcome Card', meta: 'Print' }
          ]
        }
      ],
      // Blog posts: add one line per post, e.g.
      //   { title: 'Post Title', meta: 'Category', url: 'https://...', image: 'images/tf-cornerstone/blog/post.jpg' },
      // image is optional; without it the card shows a plain panel.
      blog: [
        { title: 'How To Take The NYC Ferry From Long Island City And Hunter’s Point South', meta: 'Living in NYC', url: 'https://tfc.com/blog/living-in-nyc/how-to-take-the-nyc-ferry-long-island-city-queens', image: 'images/tf-cornerstone/blog%20previews/How%20to%20Take%20the%20NYC%20Ferry%20from%20Long%20Island%20City%20and%20Hunter%27s%20Point%20South.jpeg' },
        { title: 'Explore The Amenities At Malt Drive', meta: 'Apartment hunt guide', url: 'https://tfc.com/blog/nyc-apartment-hunt-guide/explore-the-amenities-at-malt-drive', image: 'images/tf-cornerstone/blog%20previews/malt-drive-ammenity-blog-cover.jpeg' },
        { title: 'Weekend Getaway Ideas From TFC Buildings', meta: 'Community', url: 'https://tfc.com/blog/tfc-nyc-community/weekend-getaway-ideas-from-tfc-buildings', image: 'images/tf-cornerstone/blog%20previews/Weekend%20Getaway%20Ideas%20from%20TFC%20Buildings.jpeg' },
        { title: 'Introducing 2-20 And 2-21 Malt Drive: TFC’s Newest Buildings', meta: 'News & events', url: 'https://tfc.com/blog/news-events/introducing-220-221-malt-drive-hunters-point-south-queens', image: 'images/tf-cornerstone/blog%20previews/Introducing%202-20%20and%202-21%20Malt%20Drive%20-%20TFC%27s%20Newest%20Buildings.jpeg' },
        { title: 'Malt Drive Artists In Focus: Matthew Shlian', meta: 'News & events', url: 'https://tfc.com/blog/news-events/matt-shlian-220-malt-drive', image: 'images/tf-cornerstone/blog%20previews/Malt%20Drive-%20Artists%20in%20Focus%20Matthew%20Shlian.jpeg' },
        { title: 'How To Furnish A Small Apartment', meta: 'Living in NYC', url: 'https://tfc.com/blog/living-in-nyc/decorating-with-limited-space-establishing-a-functional-living-room', image: 'images/tf-cornerstone/blog%20previews/How%20To%20Furnish%20a%20Small%20Apartment.jpeg' },
        { title: 'Explore The Amenities At 595 Dean St', meta: 'Apartment hunt guide', url: 'https://tfc.com/blog/nyc-apartment-hunt-guide/595-dean-st-amenities-luxury-apartments-brooklyn', image: 'images/tf-cornerstone/blog%20previews/Explore%20The%20Amenities%20at%20595%20Dean%20St.jpeg' },
        { title: 'Chelsea Piers Fitness Prospect Heights Welcomes 595 Dean St', meta: 'News & events', url: 'https://tfc.com/blog/news-events/special-offer-50-off-chelsea-piers-fitness-prospect-heights', image: 'images/tf-cornerstone/blog%20previews/Chelsea%20Piers%20Fitness%20Prospect%20Heights%20Welcomes%20595%20Dean%20St.jpeg' },
        { title: 'Sculpture Garden At Hunter’s Point South', meta: 'News & events', url: 'https://tfc.com/blog/news-events/sculpture-garden-at-hunters-point-south', image: 'images/tf-cornerstone/blog%20previews/culpture%20Garden%20at%20Hunter%27s%20Point%20South.jpeg' }
      ]
    },
    {
      id: 'car-community',
      company: 'Car Community',
      summary: 'Event posters, illustration and photography from the car scene.',
      page: 'design-car-community.html',
      homeLabel: 'Design And Photography',
      homePhotos: [   // photos added to the home page preview, after the design work
        'images/car%20community/photography/_MG_8849-Edit-Edit%20copy.jpg',
        'images/car%20community/photography/_K8A1249.jpg'
      ],
      sections: [
        {
          id: 'car-photography',
          label: 'Photography',
          title: 'Photography',
          preview: false,  // Design page and home show the design work instead
          items: [
            { src: 'images/car%20community/photography/lightingfinalmiata2KESSLER.jpg', width: 2400, height: 1714, alt: 'Red Miata at night under lit fencing' },
            { src: 'images/car%20community/photography/_K8A1249.jpg', width: 2400, height: 1600, alt: 'Teal coupe parked by a green fence' },
            { src: 'images/car%20community/photography/_MG_0695-Edit2.jpg', width: 2400, height: 1600, alt: 'Orange supercar with doors open in a showroom' },
            { src: 'images/car%20community/photography/Untitled-1.jpg', width: 1500, height: 1500, alt: 'Black and white collage of a car meet' },
            { src: 'images/car%20community/photography/_MG_8849-Edit-Edit%20copy.jpg', width: 2400, height: 1530, alt: 'Race car on track under grey sky' },
            { src: 'images/car%20community/photography/16152583722_afbd046ca7_o.jpg', width: 2172, height: 1448, alt: 'Silver sports car rear detail' },
            { src: 'images/car%20community/photography/_C0A0282-Edit1.jpg', width: 2400, height: 1350, alt: 'Close-up of a silver car body' }
          ]
        },
        {
          id: 'car-design',
          title: 'Design',
          items: [
            { src: 'images/car%20community/design/PTS-LAUGINGMAN-DRAFT.jpg', width: 1920, height: 2400, title: 'Cars & Coffee Poster', meta: 'Print' },
            { src: 'images/car%20community/design/e30m3vector.jpg', width: 2400, height: 1600, title: 'E30 M3 Illustration', meta: 'Illustration' }
          ]
        }
      ]
    },
    {
      id: 'logos',
      company: 'Logos',
      collection: true,   // a set of work, not a client; left out of the About list
      summary: 'Logo and identity work.',
      items: [
        { src: 'images/logos/Rebel_Talent_Cirlce_Final_SMALL_WARP.png', width: 1440, height: 1440, title: 'Rebel Talent Circle', meta: 'Logo' },
        { src: 'images/logos/elaphant-db-2-elmer_text.png', width: 1440, height: 1440, title: 'Rebel Talent Wordmark', meta: 'Logo' },
        { src: 'images/logos/Screen%20Shot%202020-08-24%20at%202.27.10%20PM.png', width: 1600, height: 1527, title: 'Type!', meta: 'Logo' }
      ]
    },
    {
      id: 'triton',
      company: 'Triton Construction',
      summary: 'I am currently the marketing coordinator at Triton Construction, a full-service construction manager and consulting firm working on projects across New York City, the Hudson Valley, Long Island, and Florida.',
      tags: 'Design, Proposals, Photography, Events, Web Design',
      links: [                // shown instead of images
        { text: 'Triton Construction Website', href: 'https://tritonconstruction.net/' },
        { text: 'Contact Me', href: 'contact.html' }
      ],
      items: []
    }
  ],

  photography: {
    summary: 'Art documentary and personal work.',
    // Each section shows 6 photos on the Photography page and everything on its own page.
    sections: [
      {
        id: 'personal-work',
        title: 'Personal Work',
        page: 'photography-personal-work.html',
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
      },
      {
        id: 'art-documentary',
        title: 'Art Documentary',
        page: 'photography-art-documentary.html',
        summary: 'Paintings by Logan Roach.',
        items: [
          // Full paintings first, then details
          { src: 'images/art%20documentary/Logan%20Roach%20August%202024/LR-08-15-24-1.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, full view' },
          { src: 'images/art%20documentary/Logan%20Roach%20August%202024/LR-08-15-24-4.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, full view' },
          { src: 'images/art%20documentary/Logan%20Roach%20August%202024/LR-08-15-24-7.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, full view' },
          { src: 'images/art%20documentary/LR_May/LR_May-1.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, full view' },
          { src: 'images/art%20documentary/LR_May/LR_May-2.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, full view' },
          { src: 'images/art%20documentary/LR_May/LR_May-3.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, full view' },
          { src: 'images/art%20documentary/LR_May/LR_May-4.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, full view' },
          { src: 'images/art%20documentary/LR_May/LR_May-5.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, full view' },
          { src: 'images/art%20documentary/Logan%20Roach%20August%202024/LR-08-15-24-2.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, detail' },
          { src: 'images/art%20documentary/Logan%20Roach%20August%202024/LR-08-15-24-3.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, detail' },
          { src: 'images/art%20documentary/Logan%20Roach%20August%202024/LR-08-15-24-5.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, detail' },
          { src: 'images/art%20documentary/Logan%20Roach%20August%202024/LR-08-15-24-6.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, detail' },
          { src: 'images/art%20documentary/Logan%20Roach%20August%202024/LR-08-15-24-8.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, detail' },
          { src: 'images/art%20documentary/Logan%20Roach%20August%202024/LR-08-15-24-9.jpg', width: 2400, height: 1600, alt: 'Painting by Logan Roach, detail' }
        ]
      }
    ]
  }
};
