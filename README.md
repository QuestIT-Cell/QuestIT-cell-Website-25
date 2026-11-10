# QuestIT Cell Website 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.0.0-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

The official website of **QuestIT Cell**, the IT society of VESIT (Vivekanand Education Society's Institute of Technology), Mumbai. This modern, feature-rich platform showcases our events, team, gallery, and alumni testimonials while serving as a hub for tech enthusiasts.

🌐 **Live Site:** [questit.vesit.ves.ac.in](https://questit.vesit.ves.ac.in)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Website Sections](#-website-sections)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Developers](#-developers)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Modern UI/UX:** Sleek, responsive design with smooth animations powered by Framer Motion
- **Progressive Web App (PWA):** Installable on devices for native-like experience
- **Dynamic Event Management:** Showcase workshops, hackathons, and competitions
- **Interactive Gallery:** Projector-inspired and orbital memory sections
- **Team Showcase:** Polaroid-style member profiles with BE, TE, and SE groups
- **Alumni Testimonials:** Animated carousel featuring success stories
- **Genesis Integration:** Seamless subpath routing to Genesis 1.0 and Genesis 2.0 microsites
- **SEO Optimized:** Enhanced metadata and indexing for better discoverability
- **Mobile Responsive:** Fully optimized for all screen sizes

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16.3.8](https://nextjs.org/) (React 19.3.0)
- **Styling:** [Tailwind CSS 4.3.3](https://tailwindcss.com/)
- **Animations:** [Framer Motion 14.0.0](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Charts:** [Recharts 3.10.1](https://recharts.org/)
- **Animations:** [Lottie React](https://www.npmjs.com/package/lottie-react), Canvas Confetti

### Backend
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose 9.11.0](https://mongoosejs.com/)
- **State Management:** Cookies with `cookies-next`

### DevOps & Deployment
- **Hosting:** [Vercel](https://vercel.com/)
- **Domain:** VESIT subdomain with CNAME configuration
- **Version Control:** Git & GitHub

---

## 🎨 Website Sections

### 1. **Home**
Hero section with dynamic typewriter effect, introducing QuestIT Cell and its mission.

### 2. **About**
- **Who We Are:** Overview of QuestIT Cell's vision and purpose
- **Statistics Dashboard:** Interactive charts showing events, members, and workshops
- **Event & Member Split Analysis:** Visual breakdowns by academic year

### 3. **Events**
- **Featured Events:** Homepage carousel of 6 latest events
- **Full Events Page:** Chronologically sorted list with modal previews
- **Special Event Cards:** Custom designs for Genesis 1.0, Genesis 2.0, and Vibe W Quest
- **Event Details:** Speakers, dates, descriptions, and external links
- **Notable Events:**
  - Genesis 2.0 Hackathon (October 2026)
  - SIH Insider Workshop (August-September 2026)
  - Vibe W Quest (August 2026)
  - Bridge The Gap & Career Connect (February 2026)

### 4. **Gallery**
- **Projector Section:** Slideshow-style event photo showcase
- **Orbital Memory Section:** Revolving 3D photo carousel
- **Spiral Gallery:** Interactive spiral layout of memorable moments

### 5. **Team**
- **Quest IT Council 2026-27:** Current council members (BE, TE, SE)
- **Quest IT Council 2025-26:** Previous year's team
- **Quest IT Council 2024-25:** Alumni members
- **Polaroid Clothesline Design:** Unique card-based member profiles
- **Member Details:** Name, designation, email, GitHub, LinkedIn

### 6. **Developers**
Editorial-style 3D card stack showcasing website contributors with:
- Developer portraits in interactive card deck
- Work titles and detailed contributions
- Social links (GitHub, LinkedIn, Email)
- Smooth navigation and hover effects

### 7. **Contact**
- Contact form for inquiries
- Location map (VESIT, Mumbai)
- Social media links
- Faculty coordinators information

### 8. **What They Say (Testimonials)**
Animated testimonial carousel featuring alumni from:
- JPMorgan Chase
- Trinity College Dublin
- Northeastern University
- ISS Stoxx
- Fincons Group

### 9. **Footer**
- Quick links to all sections
- Social media integration
- Developer credits
- Copyright information

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/QuestIT-Cell/QuestIT-cell-Website-25.git
cd QuestIT-cell-Website-25
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
QuestIT-cell-Website-25/
├── public/
│   ├── images/
│   │   ├── dev_images/          # Developer photos
│   │   ├── team2026/            # Team member photos (BE, TE, SE)
│   │   ├── team2025/
│   │   ├── gallery-images/      # Event gallery photos
│   │   ├── speaker_photos/      # Event speaker photos
│   │   └── screenshots/         # Testimonial photos
│   └── animations/              # Lottie animation files
├── src/
│   ├── app/                     # Next.js app directory
│   │   └── (routes)/            # Page routes
│   ├── components/
│   │   ├── developers/          # Developer section components
│   │   ├── gallery/             # Gallery components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── home.jsx             # Home page component
│   │   ├── about.jsx            # About section
│   │   ├── events.jsx           # Events section
│   │   ├── team.jsx             # Team section
│   │   └── testimonials.jsx    # Testimonials section
│   ├── constants/
│   │   ├── developers.js        # Developer data
│   │   ├── events.js            # Event data
│   │   ├── team.js              # Team member data
│   │   ├── testimonials.js      # Testimonial data
│   │   └── menu.js              # Navigation menu
│   ├── lib/                     # Utility functions
│   └── modules/                 # Helper modules
├── .env.local                   # Environment variables (not in repo)
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── package.json                 # Dependencies

```

---

## 👨‍💻 Developers

The QuestIT website was built and maintained by our talented development team:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/AtharvaLotankar11">
        <img src="https://github.com/AtharvaLotankar11.png" width="100px;" alt="Atharva Lotankar"/>
        <br />
        <sub><b>Atharva Lotankar</b></sub>
      </a>
      <br />
      <sub>Frontend & Web Management</sub>
    </td>
    <td align="center">
      <a href="https://github.com/Shravanya178">
        <img src="https://github.com/Shravanya178.png" width="100px;" alt="Shravanya Andhale"/>
        <br />
        <sub><b>Shravanya Andhale</b></sub>
      </a>
      <br />
      <sub>Deployment & Domain</sub>
    </td>
    <td align="center">
      <a href="https://github.com/jaykerkar0405">
        <img src="https://github.com/jaykerkar0405.png" width="100px;" alt="Jay Kerkar"/>
        <br />
        <sub><b>Jay Kerkar</b></sub>
      </a>
      <br />
      <sub>Frontend Architecture & PWA</sub>
    </td>
    <td align="center">
      <a href="https://github.com/Pranavlovescode">
        <img src="https://github.com/Pranavlovescode.png" width="100px;" alt="Pranav Titambe"/>
        <br />
        <sub><b>Pranav Titambe</b></sub>
      </a>
      <br />
      <sub>Backend Development</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/thetwobraincells">
        <img src="https://github.com/thetwobraincells.png" width="100px;" alt="Shivam Mishra"/>
        <br />
        <sub><b>Shivam Mishra</b></sub>
      </a>
      <br />
      <sub>Genesis Integration</sub>
    </td>
    <td align="center">
      <a href="https://github.com/codecruncher0723">
        <img src="https://github.com/codecruncher0723.png" width="100px;" alt="Karthik Kotian"/>
        <br />
        <sub><b>Karthik Kotian</b></sub>
      </a>
      <br />
      <sub>Gallery & Developer Section</sub>
    </td>
    <td align="center">
      <a href="https://github.com/avanikillekar">
        <img src="https://github.com/avanikillekar.png" width="100px;" alt="Avani Killekar"/>
        <br />
        <sub><b>Avani Killekar</b></sub>
      </a>
      <br />
      <sub>Team Section Architecture</sub>
    </td>
    <td align="center">
      <a href="https://github.com/C172007">
        <img src="https://github.com/C172007.png" width="100px;" alt="Chaitali Rane"/>
        <br />
        <sub><b>Chaitali Rane</b></sub>
      </a>
      <br />
      <sub>Media Standardization</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/themanishawari">
        <img src="https://github.com/themanishawari.png" width="100px;" alt="Manish Awari"/>
        <br />
        <sub><b>Manish Awari</b></sub>
      </a>
      <br />
      <sub>Event Campaign Integration</sub>
    </td>
    <td align="center">
      <a href="https://github.com/sarrakhadse07">
        <img src="https://github.com/sarrakhadse07.png" width="100px;" alt="Sarra Khadse"/>
        <br />
        <sub><b>Sarra Khadse</b></sub>
      </a>
      <br />
      <sub>Data Visualization</sub>
    </td>
    <td align="center">
      <a href="https://github.com/Sankymane">
        <img src="https://github.com/Sankymane.png" width="100px;" alt="Sankalp Mane"/>
        <br />
        <sub><b>Sankalp Mane</b></sub>
      </a>
      <br />
      <sub>Layout Optimization</sub>
    </td>
    <td></td>
  </tr>
</table>

---

## 🤝 Contributing

We welcome contributions from the QuestIT community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style and structure
- Test your changes thoroughly
- Update documentation as needed
- Write clear commit messages

---

## 📄 License

This project is maintained by QuestIT Cell, VESIT. All rights reserved.

---

## 📞 Contact

**QuestIT Cell, VESIT**  
Vivekanand Education Society's Institute of Technology  
Collector's Colony, Chembur, Mumbai - 400074

- 🌐 Website: [questit.vesit.ves.ac.in](https://questit.vesit.ves.ac.in)
- 📧 Email: questit@ves.ac.in
- 💼 LinkedIn: [QuestIT VESIT](https://www.linkedin.com/company/questit-vesit)
- 📷 Instagram: [@questit_cell](https://www.instagram.com/questit_cell)
- 🐙 GitHub: [QuestIT-Cell](https://github.com/QuestIT-Cell)

---

<p align="center">
  Made with ❤️ by QuestIT Cell Development Team
</p>

<p align="center">
  <sub>Empowering tech enthusiasts since 2019</sub>
</p>
