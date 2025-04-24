const mongoose = require("mongoose");

const SLASchema = new mongoose.Schema({
  deliveryTime: { type: Number, required: true },
  lastMileTravel: { type: Number, required: true },
  serviceability: { type: String, required: true },
  slaString: { type: String, required: true },
  lastMileTravelString: { type: String, required: true },
  iconType: { type: String, required: true },
});

const AvailabilitySchema = new mongoose.Schema({
  nextCloseTime: { type: String, required: true },
  opened: { type: Boolean, required: true },
});

const BadgesV2Schema = new mongoose.Schema({
  entityBadges: {
    imageBased: { type: Object, default: {} },
    textBased: { type: Object, default: {} },
    textExtendedBadges: { type: Object, default: {} },
  },
});

const AggregatedDiscountInfoV3Schema = new mongoose.Schema({
  header: { type: String, required: true },
  subHeader: { type: String, required: true },
});

const LoyaltyDiscoverPresentationInfoSchema = new mongoose.Schema({
  logoCtx: {
    text: { type: String, required: true },
    logo: { type: String, required: true },
  },
  freedelMessage: { type: String, required: true },
});

const DifferentiatedUISchema = new mongoose.Schema({
  displayType: { type: String, required: true },
  differentiatedUiMediaDetails: {
    lottie: { type: Object, default: {} },
    video: { type: Object, default: {} },
  },
});

const ExternalRatingsSchema = new mongoose.Schema({
  aggregatedRating: {
    rating: { type: String, default: "--" },
  },
});

const InfoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  cloudinaryImageId: { type: String, required: true },
  locality: { type: String, required: true },
  areaName: { type: String, required: true },
  costForTwo: { type: String, required: true },
  cuisines: { type: [String], required: true },
  avgRating: { type: Number, required: true },
  parentId: { type: String, required: true },
  avgRatingString: { type: String, required: true },
  totalRatingsString: { type: String, required: true },
  sla: { type: SLASchema, required: true },
  availability: { type: AvailabilitySchema, required: true },
  badges: { type: Object, default: {} },
  isOpen: { type: Boolean, required: true },
  type: { type: String, required: true },
  badgesV2: { type: BadgesV2Schema, required: true },
  aggregatedDiscountInfoV3: { type: AggregatedDiscountInfoV3Schema, required: false },
  loyaltyDiscoverPresentationInfo: { type: LoyaltyDiscoverPresentationInfoSchema, required: false },
  differentiatedUi: { type: DifferentiatedUISchema, required: true },
  reviewsSummary: { type: Object, default: {} },
  displayType: { type: String, required: true },
  restaurantOfferPresentationInfo: { type: Object, default: {} },
  externalRatings: { type: ExternalRatingsSchema, required: true },
  ratingsDisplayPreference: { type: String, required: true },
});

const AnalyticsSchema = new mongoose.Schema({
  context: { type: String, required: false },
});

const CTASchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, required: true },
});

const AllRestaurantSchema = new mongoose.Schema(
  {
    info: { type: InfoSchema, required: true },
    analytics: { type: AnalyticsSchema, required: false },
    cta: { type: CTASchema, required: true },
  },
  { timestamps: true }
);

const AllRestaurants = mongoose.model("AllRestaurant", AllRestaurantSchema);
module.exports = AllRestaurants;
