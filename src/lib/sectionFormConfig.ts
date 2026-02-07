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
      {
        name: "cta",
        label: "CTA Buttons",
        type: "cta", // 🔥 NEW
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
    fields: [{ name: "usp_items", label: "USP Items", type: "usp_items" }],
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
  // Add other sections as needed
};
