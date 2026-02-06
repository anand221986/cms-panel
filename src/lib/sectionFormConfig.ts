// lib/sectionFormConfig.ts
export const SECTION_FORM_CONFIG: Record<
  string,
  { label: string; fields: Array<any> }
> = {
  hero: {
    label: "Hero Section",
    fields: [
      // { name: "hero_image", label: "Hero Image URL", type: "text" },
      {
        name: "image",
        label: "Image",
        type: "image",
      },
      { name: "description", label: "Description", type: "textarea" },
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
    ],
  },

  // stats: {
  //   label: "Stats Section",
  //   fields: [
  //     { name: "stats_title", label: "Title", type: "text" },
  //     { name: "stats_items", label: "Items (JSON)", type: "json" },
  //   ],
  // },

//  stats: {
//     label: "Stats Section",
//     fields: [
//       {
//         name: "stats_items",
//         label: "Stats Items",
//         type: "array",
//         fields: [
//           { name: "value", label: "Value", type: "text" },
//           { name: "label", label: "Label", type: "text" },
//         ],
//       },
//     ],
//   },

//   journey: {
//     label: "Journey Section",
//     fields: [
//       { name: "timeline", label: "Timeline (JSON)", type: "json" },
//     ],
//   },
  leftImageRightContent: {
    label: "Left Image Right Content",
    fields: [
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

    ],
  },

  rightImageLeftContent: {
    label: "Right Image Left Content",
    fields: [
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
    fields: [{ }],
  },
     testimonials: {
    label: "Testimonials Section",
    fields: [{ }],
  },

    clientsLogoSlider: {
    label: "Client Logo Slider",
     fields: [{ name: "client_items", label: "Clients Items", type: "client_items" }],
  },




  // Add other sections as needed
};
