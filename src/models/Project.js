const mongoose = require("mongoose");

const ConfigurationSchema = new mongoose.Schema(
  {
    bhk: String,
  },
  { _id: false },
);

const project_info = new mongoose.Schema({
  project_logo: [String],
  project_name: String,
});

const HeroSchema = new mongoose.Schema(
  {
    title: String,
    tagline: String,
    price_range: String,
    land_area: String,
    possession_date: String,
    configurations: [ConfigurationSchema],
    hero_images: [String], // Array of image paths
  },
  { _id: false },
);

const OverviewSchema = new mongoose.Schema(
  {
    overview_title: String,
    overview_subtitle: String,
    overview_description: String,
    overview_gallery_images: [String],
  },
  { _id: false },
);

const HighlightSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: [String],
  },
  { _id: false },
);

const ZoneSchema = new mongoose.Schema(
  {
    image: [String],
    title: String,
    active: Boolean,
  },
  { _id: false },
);

const LocationCategorySchema = new mongoose.Schema(
  {
    category: String,
    items: [String],
  },
  { _id: false },
);

const LocationAdvantageSchema = new mongoose.Schema(
  {
    location_section_title: String,
    location_section_subtitle: String,
    map_embed_url: String,
    location_categories: [LocationCategorySchema],
  },
  { _id: false },
);

const LayoutSchema = new mongoose.Schema(
  {
    name: String,
    image: [String],
    carpet_area: String,
    saleable_area: String,
    car_parks: String,
  },
  { _id: false },
);

const LayoutAndFloorplanSchema = new mongoose.Schema(
  {
    layouts: [LayoutSchema],
    master_layout_description: String,
  },
  { _id: false },
);

const AboutSchema = new mongoose.Schema(
  {
    left_image: [String],
    left_title: String,
    realty_title: String,
    realty_description: String,
    group_title: String,
    group_description: String,
  },
  { _id: false },
);

const ProjectSchema = new mongoose.Schema(
  {
    project: project_info,
    hero: HeroSchema,
    overview: OverviewSchema,
    amenities: [String],
    highlights: [HighlightSchema],
    zones: [ZoneSchema],
    location_advantage: LocationAdvantageSchema,
    layout_and_floorplan: LayoutAndFloorplanSchema,
    about: AboutSchema,
    fresh_project: Boolean,
    development: Boolean,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", ProjectSchema);
