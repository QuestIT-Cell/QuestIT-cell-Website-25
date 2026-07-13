// App's External Imports
import { Home, Mail, Users, Calendar, UserPlus, MessageSquare, NotebookPen, HelpCircle, Laptop, Images } from "lucide-react";

const menu = [
  {
    name: "Home",
    path: "/#home",
    icon: <Home />,
    mobile_nav: true,
  },
  {
    name: "About",
    path: "/#about",
    icon: <HelpCircle />,
    mobile_nav: false,
  },
  {
    name: "Events",
    path: "/events",
    mobile_nav: true,
    icon: <Calendar />,
  },
  // {
  //   name: "WorkshopToday",
  //   path: "#",
  //   icon: <UserPlus />, // Using UserPlus as generic icon for now
  //   mobile_nav: true,
  //   dropdown: [
  //     {
  //       name: "Registration",
  //       path: "/registration",
  //       icon: <UserPlus />,
  //     },
  //     {
  //       name: "Feedback",
  //       path: "/feedback",
  //       icon: <MessageSquare />,
  //     },
  //   ],
  // },
  {
    name: "Gallery",
    path: "/gallery",
    icon: <Images />,
    mobile_nav: true,
  },
  {
    name: "Team",
    path: "/team",
    icon: <Users />,
    mobile_nav: false,
  },
  {
    icon: <Mail />,
    name: "Contact",
    mobile_nav: true,
    path: "/#contact",
  },
  {
    mobile_nav: false,
    name: "Developers",
    path: "/developers",
    icon: <Laptop />,
  },
];

export default menu;
