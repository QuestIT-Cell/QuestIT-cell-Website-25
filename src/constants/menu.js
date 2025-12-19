// App's External Imports
import { Home, Mail, Users, Calendar, UserPlus, MessageSquare } from "lucide-react";

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
    mobile_nav: false,
  },
  {
    name: "Events",
    path: "/#events",
    mobile_nav: true,
    icon: <Calendar />,
  },
  {
    name: "Registration",
    path: "/registration",
    icon: <UserPlus />,
    mobile_nav: true,
  },
  {
    name: "Feedback",
    path: "/feedback",
    icon: <MessageSquare />,
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
  },
];

export default menu;
