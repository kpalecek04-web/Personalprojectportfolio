    const PROJECTS = [
      {
        id: 'wild-bill-pickles',
        color: '#ffedd4',
        tagline: `Food business relaunch · Student Business Incubator`,
        title: `Wild Bill Pickles`,
        organization: `Wild Bill Pickles, Student Business Incubator`,
        category: 'entre',
        logo: 'images/wbp/logo.png',
        documentUrl: '#wild-bill',
        documentLabel: `Student Business Incubator`,
        theme: 'wbp',
        story: [
          { text: `Wild Bill Pickles was built over 20 years ago in the deep east pines of Nacogdoches, Texas, by a man known as Wild Bill, AKA, my dad.`, photos: [['images/wbp/jars.jpg', 'Two jars of Wild Bill Pickles held side by side']] },
          { text: `The company was the perfect mix of Texas and spice that when handed over to people as Christmas gifts, party favors and end of year teacher thank yous, it was addictive. I grew up spicing pickles with my family, but one day life got busy and we stopped, for almost 10 years.`, photos: [['images/wbp/park.jpg', 'Holding a jar of pickles outdoors at night']] },
          { text: `Today I decided to see what it would be like to pull a small family business out of the ground and dust it off some.`, photos: [['images/wbp/presenting.jpg', 'Presenting the Wild Bill Pickles logo on a screen']] },
          { text: `What was thought to be a marketing project turned full on supply chain, revitalizing recipes to fit a modern preference and entering into a new market with a new customer base, and oh what fun it was!`, photos: [['images/wbp/display.jpg', 'A Wild Bill Pickles display stocked with jars'], ['images/wbp/table.jpg', 'Sampling pickles at a table with students']] },
          { text: `Check out some photos and see the next card to hear about the student business incubator internship that helped me to build to where I am today!`, photos: [['images/wbp/team.jpg', 'Group photo of students at an event'], ['images/wbp/stage.jpg', 'Speaking on a stage'], ['images/wbp/stadium.jpg', 'A football stadium with a person pointing at the field']] }
        ],
        description: `Revitalized a small food business nearly 10 years after closure through a 10-week entrepreneurship program, rebuilding the business model, brand positioning, and go-to-market strategy.`,
        role: `Business Developer`,
        date: `Jan 2025 – Aug 2026`,
        location: `Bentonville, AR`,
        outcome: `Reworked local sourcing, pricing, and production strategy — adapting the recipe and ingredients to create a viable path toward relaunch and sustainable growth.`,
        skills: ['CPG', 'Entrepreneurship', 'Unit Economics', 'Sourcing Strategy', 'Marketing', 'Public Speaking', 'Communication']
      },
      {
        id: 'experience-fayetteville',
        color: '#ff5325',
        tagline: `Sports tourism research · McMillon Innovation Studio`,
        image: 'images/experience-fayetteville.png',
        theme: 'ef',
        title: `Experience Fayetteville`,
        organization: `McMillon Innovation Studio`,
        category: 'orgs',
        logo: '',
        documentUrl: '',
        documentLabel: `View Project`,
        description: `Leading a multidisciplinary team of 4 researching the feasibility of a multisport complex and its potential impact on Fayetteville's sports tourism economy.`,
        role: `Project Manager`,
        date: `Aug 2026 – Present`,
        location: `Fayetteville, AR`,
        outcome: `Directed research across demand, land requirements, development costs, profitability, growth models, and funding — applying human-centered design and stakeholder research alongside traditional market research.`,
        skills: ['Project Management', 'Market Research', 'Feasibility Analysis']
      },
      {
        id: 'nestle-digiorno',
        color: '#ffffff',
        theme: 'dg',
        detailView: 'dialog',
        tagline: `In-store operations · McMillon Innovation Studio`,
        title: `Nestlé Design Team — DiGiorno`,
        organization: `McMillon Innovation Studio`,
        category: 'projects',
        logo: 'images/DiGiorno.png',
        documentUrl: '',
        documentLabel: `View Project`,
        description: `Developing solutions to streamline in-store operations for DiGiorno pizza stocking through customer discovery, interviews, and prototype testing.`,
        role: `Design Team Member`,
        date: `Jan 2025 – Present`,
        location: `Fayetteville, AR`,
        outcome: `Conducted repeated prototype testing in real retail contexts, refining solutions for usability and efficiency with a cross-disciplinary team.`,
                // Videos: paste a YouTube or Vimeo link (or a file path like 'videos/demo.mp4'), then remove the // marks.
        // videos: [{ url: 'https://youtu.be/VIDEO_ID', title: 'Prototype walkthrough' }],
        skills: ['Design Thinking', 'Customer Discovery', 'Prototyping']
      },
      {
        id: 'dublin-recruiting',
        color: '#475868',
        theme: 'ei',
        tagline: `Tech recruiting · Eirkoo Recruitment`,
        title: `Tech Recruiting Pipeline`,
        organization: `Eirkoo Recruitment, Dublin`,
        category: 'projects',
        logo: 'images/Eirkoo.png',
        documentUrl: '',
        documentLabel: `View Project`,
        description: `Processed and formatted 100+ résumés daily, supporting efficient candidate screening and placement across active searches.`,
        role: `Recruitment Intern`,
        date: `Feb 2023 – Apr 2023`,
        location: `Dublin, Ireland`,
        outcome: `Conducted outreach to 30+ prospective clients and supported candidate placement, interview coordination, and day-to-day recruiting operations.`,
        skills: ['Recruiting Ops', 'Cross-Border Talent', 'Process Design']
      },
      {
        // TODO(katie): confirm this card's role, date, and description. The text was written from the
        // project slide ("By: Katie, Jackie, Oscar, Sofia") and the Chick-fil-A adaptation files.
        id: 'marketing-expansion-plan',
        color: '#dd0033',
        theme: 'cfa',
        tagline: `Chick-fil-A in Mexico · Team of four`,
        title: `Marketing Expansion Plan`,
        organization: `Team project · Chick-fil-A in Mexico`,
        category: 'projects',
        logo: 'images/chickfila-mexico.jpg',
        documentUrl: '',
        documentLabel: `View Report`,
        description: `A market expansion plan for bringing Chick-fil-A to Mexico, built with a team of four.`,
        role: `Lead Researcher`,
        date: `Fall 2025`,
        location: `Mexico`,
        outcome: `Researched the Mexican market and adapted the menu and marketing approach to local tastes.`,
        skills: ['Market Entry Strategy', 'Marketing', 'Research']
      },
      {
        // TODO(katie): confirm the role. The text comes from the "Management Plan: CAVA in Spain"
        // final presentation (Dec 2025).
        id: 'management-expansion-plan',
        color: '#2b2622',
        theme: 'cava',
        image: 'images/cava-expansion.jpg',
        tagline: `CAVA in Spain · Management plan`,
        title: `Management Expansion Plan`,
        organization: `CAVA in Spain`,
        category: 'projects',
        logo: '',
        documentUrl: '',
        documentLabel: `View Report`,
        description: `While studying abroad in Spain, I learned about international management practices across different economies. A team of students and I conducted a research study and developed a plan to put these practices into perspective.

Below, you'll find a Management Plan and Expansion Analysis exploring whether the fast-casual restaurant CAVA could successfully expand into Spain. The analysis examines organizational culture, formal and informal structures, SWOT analysis, goals, strategic planning, and staffing considerations.`,
        role: `Team Member`,
        date: `Fall 2025`,
        location: `Spain`,
        outcome: `Analyzed CAVA's organizational culture and structure, then recommended localizing the menu, optimizing pricing and value, and building brand awareness in Spain.`,
        skills: ['International Management', 'Organizational Culture', 'Localization'],
        documents: [
          { url: 'images/Documents/FINAL%20PAPER%20MANAGEMENT.pdf', title: `CAVA Management Expansion Plan`, subtitle: `International Management Analysis`, type: `PDF` }
        ]
      }
    ];