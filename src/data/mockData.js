// // mockData.js — used until MongoDB backend is connected

// export const MOCK_INCIDENTS = [
//   {
//     _id: '1',
//     category: 'Harassment',
//     severity: 'high',
//     title: 'Verbal harassment near bus stop',
//     description: 'A man followed me from the bus stop shouting inappropriate remarks. It was around 9pm and the area was poorly lit with no CCTV visible.',
//     location: { name: 'MG Road Bus Stop', lat: 21.197, lng: 81.338 },
//     anonymous: true,
//     user: { name: 'Anonymous', avatar: null },
//     createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
//     likes: 34,
//     comments: 3,
//   },
//   {
//     _id: '2',
//     category: 'Stalking',
//     severity: 'high',
//     title: 'Followed from metro station',
//     description: 'Someone followed me for three streets after I exited the metro. I had to enter a shop to feel safe. This stretch is very dangerous at night.',
//     location: { name: 'Central Metro Station', lat: 21.201, lng: 81.344 },
//     anonymous: true,
//     user: { name: 'Anonymous', avatar: null },
//     createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
//     likes: 21,
//     comments: 5,
//   },
//   {
//     _id: '3',
//     category: 'Unsafe Area',
//     severity: 'medium',
//     title: 'Very dark underpass at night',
//     description: 'The underpass near the railway bridge has no lighting at all. I felt very unsafe walking through after 8pm. Three weeks without a fix.',
//     location: { name: 'Railway Bridge Underpass', lat: 21.193, lng: 81.352 },
//     anonymous: true,
//     user: { name: 'Anonymous', avatar: null },
//     createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
//     likes: 57,
//     comments: 2,
//   },
//   {
//     _id: '4',
//     category: 'Safe Spot',
//     severity: 'low',
//     title: 'Café staff helped me feel safe',
//     description: 'When I felt I was being followed, the café staff let me stay inside and helped me call a cab without asking me to order anything.',
//     location: { name: 'Café Central, Park Road', lat: 21.205, lng: 81.360 },
//     anonymous: false,
//     user: { name: 'Rhea S.', avatar: null },
//     createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
//     likes: 91,
//     comments: 8,
//   },
//   {
//     _id: '5',
//     category: 'Theft',
//     severity: 'medium',
//     title: 'Phone snatched at signal',
//     description: 'Someone on a bike grabbed my phone at the traffic signal. It happened incredibly fast. High risk area especially at dusk.',
//     location: { name: 'Main Square Signal', lat: 21.188, lng: 81.341 },
//     anonymous: false,
//     user: { name: 'Anjali R.', avatar: null },
//     createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//     likes: 28,
//     comments: 1,
//   },
//   {
//     _id: '6',
//     category: 'Harassment',
//     severity: 'high',
//     title: 'Group harassment in market area',
//     description: 'A group of men were making comments at every woman passing through the crowded market area. This happens every single day.',
//     location: { name: 'Old Market, East Gate', lat: 21.195, lng: 81.330 },
//     anonymous: false,
//     user: { name: 'Kavya N.', avatar: null },
//     createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
//     likes: 112,
//     comments: 14,
//   },
//   {
//     _id: '7',
//     category: 'Safe Spot',
//     severity: 'low',
//     title: 'Well-lit park with security',
//     description: 'City Central Park has good lighting and security guards till 10pm. A safe place to walk and exercise.',
//     location: { name: 'City Central Park', lat: 21.210, lng: 81.368 },
//     anonymous: false,
//     user: { name: 'Deepa V.', avatar: null },
//     createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
//     likes: 45,
//     comments: 6,
//   },
//   {
//     _id: '8',
//     category: 'Unsafe Area',
//     severity: 'medium',
//     title: 'Isolated parking lot with no CCTV',
//     description: 'The parking behind the mall has no cameras and very poor lighting. Felt unsafe returning to my car alone at night.',
//     location: { name: 'Mall Parking, West Wing', lat: 21.190, lng: 81.356 },
//     anonymous: true,
//     user: { name: 'Anonymous', avatar: null },
//     createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
//     likes: 19,
//     comments: 0,
//   },
// ];

// export const CATEGORIES = [
//   { label: 'All',         value: 'all',         color: null },
//   { label: 'Harassment',  value: 'Harassment',  color: 'red' },
//   { label: 'Stalking',    value: 'Stalking',    color: 'red' },
//   { label: 'Unsafe Area', value: 'Unsafe Area', color: 'amber' },
//   { label: 'Theft',       value: 'Theft',       color: 'amber' },
//   { label: 'Assault',     value: 'Assault',     color: 'red' },
//   { label: 'Safe Spot ✦', value: 'Safe Spot',   color: 'green' },
// ];

// export function timeAgo(date) {
//   const diff = Date.now() - new Date(date).getTime();
//   const mins  = Math.floor(diff / 60000);
//   const hours = Math.floor(diff / 3600000);
//   const days  = Math.floor(diff / 86400000);
//   if (mins  < 60)  return `${mins}m ago`;
//   if (hours < 24)  return `${hours}h ago`;
//   return `${days}d ago`;
// }

export const INCIDENTS = [
  {
    id: "1",
    category: "Harassment",
    severity: "high",
    description: "Group of men following women near the bus stop late at night.",
    location: { lat: 22.7196, lng: 75.8577, label: "Vijay Nagar, Indore" },
    time: "2 hrs ago",
    reportedBy: "SafeWalker_21",
  },
  {
    id: "2",
    category: "Poor Lighting",
    severity: "medium",
    description: "Entire stretch of road from metro exit to colony gate has no streetlights.",
    location: { lat: 22.7241, lng: 75.8648, label: "Rajwada Area, Indore" },
    time: "5 hrs ago",
    reportedBy: "NightOwl_88",
  },
  {
    id: "3",
    category: "Theft",
    severity: "high",
    description: "Phone snatching reported near the market area, two incidents in one evening.",
    location: { lat: 22.7144, lng: 75.8503, label: "Palasia, Indore" },
    time: "1 day ago",
    reportedBy: "CityWatch_07",
  },
  {
    id: "4",
    category: "Safe Zone",
    severity: "low",
    description: "24/7 police chowki with CCTV coverage. Well lit, safe for solo travel.",
    location: { lat: 22.7310, lng: 75.8700, label: "MG Road, Indore" },
    time: "3 days ago",
    reportedBy: "SafeMap_Bot",
  },
  {
    id: "5",
    category: "Unsafe Road",
    severity: "medium",
    description: "Big pothole causing bike accidents near the flyover. No signage.",
    location: { lat: 22.7090, lng: 75.8650, label: "Bhanwarkuan, Indore" },
    time: "6 hrs ago",
    reportedBy: "RoadRider_55",
  },
];

export const SEVERITY_COLORS = {
  high: { bg: "rgba(232,64,42,0.15)", text: "#f87262", border: "rgba(232,64,42,0.3)" },
  medium: { bg: "rgba(245,166,35,0.15)", text: "#f5c963", border: "rgba(245,166,35,0.3)" },
  low: { bg: "rgba(39,174,96,0.15)", text: "#5dd992", border: "rgba(39,174,96,0.3)" },
};

export const FILTER_CHIPS = ["All", "High", "Medium", "Low", "Harassment", "Theft", "Lighting", "Safe Zone"];