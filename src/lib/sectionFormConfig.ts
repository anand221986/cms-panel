// lib/sectionFormConfig.ts
export const SECTION_FORM_CONFIG: Record<
  string,
  { label: string; fields: Array<any> }
> = {
  hero: {
    label: "Hero Section",
    fields: [
      {
        name: "image",
        label: "Image",
        type: "image",
      },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "features",
        label: "Features",
        type: "features", // 👈 custom list type
      },
      {
        name: "badge",
        label: "Badge",
        type: "text",
      }, {
        name: "heading",
        label: "Heading",
        type: "heading",
        fields: [
          {
            name: "headingTitle",
            label: "Title",
            type: "text",
            required: true,
          },
          {
            name: "headingsubtitle",
            label: "Subtitle",
            type: "text",
          },
          {
            name: "headinghighlight",
            label: "Highlight Text",
            type: "text",
          }
        ],

      },
      {
        name: "points",
        label: "Points",
        type: "kpi_items1",
        fields: [
          {
            name: "icon",
            label: "Icon",
            type: "icon",
          },
          {
            name: "text",
            label: "Text",
            type: "text",
          },
        ],
      },
      { name: "ctaPrimary", label: "Primary CTA", type: "cta" },
      { name: "ctaSecondary", label: "Secondary CTA", type: "cta" },
      { name: "badges", label: "Badges", type: "badges" },
      // 🔥 KPI / Stats section
      {
        name: "kpi_section",
        label: "KPI / Stats",
        type: "kpi_items", // custom type handled in renderDynamicFields
        fields: [], // no nested fields
      },
      // 👇 NEW CTAs SECTION
      {
        name: "ctas",
        label: "Call To Actions",
        type: "ctas", // custom renderer
        fields: [],
      },
    ],
  },
  leftImageRightContent: {
    label: "Left Image Right Content",
    fields: [
      {
        name: "features",
        label: "Features",
        type: "features", // 👈 custom list type
      },
      {
        name: "badge",
        label: "Badge",
        type: "text",
      }, {
        name: "heading",
        label: "Heading",
        type: "heading",
        fields: [
          {
            name: "headingTitle",
            label: "Title",
            type: "text",
            required: true,
          },
          {
            name: "headingsubtitle",
            label: "Subtitle",
            type: "text",
          },
          {
            name: "headinghighlight",
            label: "Highlight Text",
            type: "text",
          }
        ],
      },
      {
        name: "points",
        label: "Points",
        type: "kpi_items1",
        fields: [
          {
            name: "icon",
            label: "Icon",
            type: "icon",
          },
          {
            name: "text",
            label: "Text",
            type: "text",
          },
        ],
      },
      {
        name: "image",
        label: "Image",
        type: "image",
      },
      {
        name: "content",
        label: "Content",
        type: "quill",
      },
      { name: "ctaPrimary", label: "Primary CTA", type: "cta" },
      { name: "ctaSecondary", label: "Secondary CTA", type: "cta" },
      // 👇 NEW CTAs SECTION
      {
        name: "ctas",
        label: "Call To Actions",
        type: "ctas", // custom renderer
        fields: [],
      },

    ],
  },

  rightImageLeftContent: {
    label: "Right Image Left Content",
    fields: [
      {
        name: "features",
        label: "Features",
        type: "features", // 👈 custom list type
      },
      {
        name: "badge",
        label: "Badge",
        type: "text",
      }, {
        name: "heading",
        label: "Heading",
        type: "heading",
        fields: [
          {
            name: "headingTitle",
            label: "Title",
            type: "text",
            required: true,
          },
          {
            name: "headingsubtitle",
            label: "Subtitle",
            type: "text",
          },
          {
            name: "headinghighlight",
            label: "Highlight Text",
            type: "text",
          }
        ],
      },
      {
        name: "points",
        label: "Points",
        type: "kpi_items1",
        fields: [
          {
            name: "icon",
            label: "Icon",
            type: "icon",
          },
          {
            name: "text",
            label: "Text",
            type: "text",
          },
        ],
      },
      {
        name: "image",
        label: "Image",
        type: "image",
      },
      {

        name: "content",
        label: "Content",
        type: "quill",
      },
      { name: "ctaPrimary", label: "Primary CTA", type: "cta" },
      { name: "ctaSecondary", label: "Secondary CTA", type: "cta" },
      // 👇 NEW CTAs SECTION
      {
        name: "ctas",
        label: "Call To Actions",
        type: "ctas", // custom renderer
        fields: [],
      },
         // 👇 Right Section fields
    {
      name: "rightsectionbadge",
      label: "Right Section Badge",
      type: "text",
    },
    {
      name: "rightsectiontitle",
      label: "Right Section Title",
      type: "text",
    },
    {
      name: "rightsectiondescription",
      label: "Right Section Description",
      type: "textarea",
    },
      

    ],
  }, middleContent: {
    label: "MiddleContent",
    fields: [
      {
        name: "features",
        label: "Features",
        type: "features", // 👈 custom list type
      },
      {
        name: "badge",
        label: "Badge",
        type: "text",
      }, {
        name: "heading",
        label: "Heading",
        type: "heading",
        fields: [
          {
            name: "headingTitle",
            label: "Title",
            type: "text",
            required: true,
          },
          {
            name: "headingsubtitle",
            label: "Subtitle",
            type: "text",
          },
          {
            name: "headinghighlight",
            label: "Highlight Text",
            type: "text",
          }
        ],
      },
      {
        name: "points",
        label: "Points",
        type: "list",
        fields: [
          {
            name: "icon",
            label: "Icon",
            type: "icon",
          },
          {
            name: "text",
            label: "Text",
            type: "text",
          },
        ],
      },
      {
        name: "image",
        label: "Image",
        type: "image",
      },
      {
        name: "content",
        label: "Content",
        type: "quill",
      },
      { name: "ctaPrimary", label: "Primary CTA", type: "cta" },
      { name: "ctaSecondary", label: "Secondary CTA", type: "cta" },
      {
        name: "points",
        label: "Points",
        type: "kpi_items1", // custom type handled in renderDynamicFields
        fields: [], // no nested fields
      },

      // 👇 NEW CTAs SECTION
      {
        name: "ctas",
        label: "Call To Actions",
        type: "ctas", // custom renderer
        fields: [],
      },
      {
        name: "stats",
        label: "Stats",
        type: "stats", // 👈 custom renderer
        fields: [],
      },
      // 👇 Right Section fields
    {
      name: "rightsectionbadge",
      label: "Right Section Badge",
      type: "text",
    },
    {
      name: "rightsectiontitle",
      label: "Right Section Title",
      type: "text",
    },
    {
      name: "rightsectiondescription",
      label: "Right Section Description",
      type: "textarea",
    },
    {
  name: "services",
  label: "Services",
  type: "service_items",
  fields: []
}

    ],
  }, slider: {
    label: "Image Slider",
    fields: [
      {
        name: "images",
        label: "Slider Images",
        type: "image",
        multiple: true, // 🔥 key flag
      },
      {
        name: "caption",
        label: "Caption",
        type: "text",
      },
    // Primary CTA
      {
        name: "primary_cta",
        label: "Primary CTA",
        type: "cta",
        fields: [],
      },

      // Secondary CTA
      {
        name: "secondary_cta",
        label: "Secondary CTA",
        type: "cta",
        fields: [],
      },
     
    ],
  },
  faq: {
    label: "FAQ Section",
    fields: [
      {
        name: "faq_title",
        label: "Title",
        type: "text"
      },
      {
        name: "faq_items",
        label: "FAQ Items",
        type: "faq_items" // custom type handled in UI
      },
    ],
  },
  usp_items: {
    label: "USP Section",
    fields: [
        {
        name: "badge",
        label: "Badge",
        type: "text",
      },

      { name: "usp_items", label: "USP Items", type: "usp_items" },
       {
        name: "points",
        label: "Points",
        type: "kpi_items1", // custom type handled in renderDynamicFields
        fields: [], // no nested fields
      },

      // 👇 NEW CTAs SECTION
      {
        name: "ctas",
        label: "Call To Actions",
        type: "ctas", // custom renderer
        fields: [],
      },
      {
        name: "stats",
        label: "Stats",
        type: "stats", // 👈 custom renderer
        fields: [],
      },
      {
        name: "heading",
        label: "Heading",
        type: "heading",
        fields: [
          {
            name: "headingTitle",
            label: "Title",
            type: "text",
            required: true,
          },
          {
            name: "headingsubtitle",
            label: "Subtitle",
            type: "text",
          },
          {
            name: "headinghighlight",
            label: "Highlight Text",
            type: "text",
          }
        ],
      }
    ],
  },
  blogs: {
    label: "Blogs Section",
    fields: [{}],
  },
  testimonials: {
    label: "Testimonials Section",
    fields: [{}],
  },
  clientsLogoSlider: {
    label: "Client Logo Slider",
    fields: [{ name: "client_items", label: "Clients Items", type: "client_items" }],
  },
  solutions: {
    label: "Solutions Section",
    fields: [
      // Header
      {
        name: "header",
        label: "Header",
        type: "heading",
        fields: [
          { name: "badge", label: "Badge", type: "text", required: true },
          { name: "title", label: "Title", type: "text", required: true },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },

      // Specializations list
      {
        name: "specializations",
        label: "Specializations",
        type: "specializations",
        fields: [
          {
            name: "title",
            label: "Title",
            type: "text",
            required: true,
          },
          {
            name: "description",
            label: "Description",
            type: "text",
          },
          {
            name: "count",
            label: "Count",
            type: "text",
          },
          {
            name: "icon",
            label: "Icon",
            type: "select",
            options: ["code", "dollarSign", "users", "heart"],
          },
          {
            name: "link",
            label: "Link",
            type: "text",
          },
        ],
      },
      // Solutions accordion
      {
        name: "solutions",
        label: "Solutions Accordion",
        type: "solutions",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          {
            name: "icon",
            label: "Icon",
            type: "select",
            options: [
              "briefcase",
              "workflow",
              "handshake",
              "calendarDays",
              "layoutDashboard",
              "cog",
            ],
          },
        ],
      },
 // Primary CTA
      {
        name: "primary_cta",
        label: "Primary CTA",
        type: "cta",
        fields: [],
      },

      // Secondary CTA
      {
        name: "secondary_cta",
        label: "Secondary CTA",
        type: "cta",
        fields: [],
      },
    ],
  },
  // Add other sections as needed
  why_choose: {
    label: "Why Choose TalentBridge",
    fields: [
      {
        name: "header",
        type:"why_choose",
        label: "Header",
       fields: [
          { name: "badge", label: "Badge", type: "text" },
          { 
            name: "title", label: "Title", type: "group", fields: [
              { name: "prefix", label: "Prefix", type: "text" },
              { name: "highlight", label: "Highlight", type: "text" },
              { name: "suffix", label: "Suffix", type: "text" },
            ] 
          },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ]
      },
      {
        name: "stats",
        label: "Stats",
        type: "array",
        itemFields: [
          { name: "value", label: "Value", type: "text" },
          { name: "label", label: "Label", type: "text" },
          { name: "icon", label: "Icon", type: "select", options: ["target","award","users","globe"] },
        ]
      },
      {
        name: "features",
        label: "Features",
        type: "array",
        itemFields: [
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "icon", label: "Icon", type: "select", options: ["shield","clock","globe","users"] },
          { name: "theme", label: "Theme", type: "select", options: ["emerald","teal","green"] },
        ]
      },
      {
        name: "cta",
        label: "Call to Action",
        type: "group",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "link", label: "Link", type: "text" },
        ]
      }
    ]
  },
    workflow_short: {
    label: "Workflow Short Section",
    fields: [
      {
        name: "metrics",
        label: "Top Metrics",
        type: "metrics_items", // reuse your KPI items renderer
      },
      {
        name: "header",
        label: "Header",
        type: "heading",
        fields: [
          { name: "title.prefix", label: "Title Prefix" },
          { name: "title.highlight", label: "Title Highlight" },
          { name: "title.suffix", label: "Title Suffix" },
          { name: "subtitle", label: "Subtitle" },
        ],
      },
      {
        name: "blocks",
        label: "Workflow Blocks",
        type: "workflow_blocks",
      },
    ],
  },
 

 jobs: {
    label: "Jobs Listing Section",
    fields: [{}],
  },
//   footer: {
//   label: "Footer",
//   fields: [
//     {
//       name: "company",
//       label: "Company Info",
//       type: "footer",
//       fields: [
//         { name: "name", label: "Company Name", type: "text" },
//         { name: "description", label: "Description", type: "textarea" },
//         { name: "phone", label: "Phone", type: "text" },
//         { name: "email", label: "Email", type: "text" },
//         { name: "address", label: "Address", type: "text" },
//         { name: "logo", label: "Logo", type: "image" },
//       ],
//     },

//     {
//       name: "employer_links",
//       label: "Employer Links",
//       type: "list",
//       fields: [
//         { name: "label", label: "Label", type: "text" },
//         { name: "url", label: "URL", type: "text" },
//       ],
//     },

//     {
//       name: "jobseeker_links",
//       label: "Job Seeker Links",
//       type: "list",
//       fields: [
//         { name: "label", label: "Label", type: "text" },
//         { name: "url", label: "URL", type: "text" },
//       ],
//     },

//     {
//       name: "newsletter",
//       label: "Newsletter",
//       type: "group",
//       fields: [
//         { name: "title", label: "Title", type: "text" },
//         { name: "description", label: "Description", type: "textarea" },
//       ],
//     },

//     {
//       name: "copyright",
//       label: "Copyright Text",
//       type: "text",
//     },
//   ],
// },


};
