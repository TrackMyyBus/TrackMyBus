// src/lib/mock-data.js

export const roles = ["student", "parent", "driver", "admin"];

export const routes = {
  A: {
    id: "A",
    name: "Route A",
    path: [
      { x: 20, y: 200 },
      { x: 120, y: 160 },
      { x: 220, y: 210 },
      { x: 320, y: 170 },
      { x: 420, y: 220 },
      { x: 520, y: 180 },
    ],
    stops: [
      { x: 20, y: 200, label: "Stop 1" },
      { x: 160, y: 180, label: "Stop 2" },
      { x: 300, y: 205, label: "Stop 3" },
      { x: 440, y: 175, label: "Stop 4" },
      { x: 520, y: 185, label: "School" },
    ],
  },
  B: {
    id: "B",
    name: "Route B",
    path: [
      { x: 40, y: 180 },
      { x: 180, y: 140 },
      { x: 260, y: 160 },
      { x: 360, y: 130 },
      { x: 520, y: 150 },
    ],
    stops: [
      { x: 40, y: 180, label: "Stop 1" },
      { x: 180, y: 140, label: "Stop 2" },
      { x: 260, y: 160, label: "Stop 3" },
      { x: 520, y: 150, label: "School" },
    ],
  },
};

export const buses = [
  {
    id: "BUS-101",
    route: "A",
    driver: "R. Kumar",
    position: { x: 300, y: 205 },
  },
  {
    id: "BUS-202",
    route: "B",
    driver: "S. Mehta",
    position: { x: 260, y: 160 },
  },
  {
    id: "BUS-303",
    route: "A",
    driver: "A. Singh",
    position: { x: 120, y: 160 },
  },
];

export const students = [
  { name: "Anya Sharma", roll: "ST-012", route: "A", busId: "BUS-101" },
  { name: "Ravi Patel", roll: "ST-034", route: "B", busId: "BUS-202" },
];

export const drivers = [
  { name: "Rakesh Kumar", busId: "BUS-101", route: "A" },
  { name: "Sonia Mehta", busId: "BUS-202", route: "B" },
];

export const notifications = {
  student: [
    {
      id: "n1",
      message: "Bus delayed by 10 min",
      time: "2m ago",
      type: "alert",
    },
    {
      id: "n2",
      message: "New stop added to Route A",
      time: "1h ago",
      type: "info",
    },
  ],
  parent: [
    {
      id: "n3",
      message: "Your child’s bus is 5 stops away",
      time: "5m ago",
      type: "info",
    },
  ],
  driver: [
    {
      id: "n4",
      message: "Admin: New safety checklist",
      time: "10m ago",
      type: "alert",
    },
  ],
  admin: [
    {
      id: "n5",
      message: "3 buses active, 1 maintenance due",
      time: "Just now",
      type: "info",
    },
  ],
};

export const schools = [{ name: "Green Valley High", routes: ["A", "B"] }];
