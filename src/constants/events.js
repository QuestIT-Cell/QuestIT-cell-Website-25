const events = [
  {
    date: "January 2025",
    title: "WebDev Odyssey",
    speakers: [
      {
        id: 1,
        name: "Jay Kerkar",
        designation: "JR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736243132/QuestIT/Team/SE/jay-kerkar_ksqatl.png",
      },
      {
        id: 2,
        name: "Anish Tawade",
        designation: "JR Graphics Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736242752/QuestIT/Team/SE/anish-tawade_ejnuxi.jpg",
      },
      {
        id: 3,
        name: "Shravanya Andhale",
        designation: "JR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736243128/QuestIT/Team/SE/shravanya-andhale_usemz5.jpg",
      },
      {
        id: 4,
        name: "Sameeksha Sankpal",
        designation: "JR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736243127/QuestIT/Team/SE/sameeksha-sankpal_ljptpu.jpg",
      },
      {
        id: 5,
        name: "Pranav Titambe",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736244063/QuestIT/Team/TE/pranav-titambe_faqqqs.jpg",
      },
      {
        id: 6,
        name: "Dhruv Maurya",
        designation: "SR Graphics Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736244062/QuestIT/Team/TE/dhruv-maurya_dqgcsw.jpg",
      },
      {
        id: 7,
        name: "Pratik Patil",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736245706/QuestIT/Team/TE/pratik-patil_jt1vpl.png",
      },
    ],
    image:
      "https://res.cloudinary.com/bytewise0405/image/upload/v1736183250/QuestIT/Events/webdev-odyssey_rvq5hj.jpg",
    description:
      "A 5-day workshop to master web development basics and build a gamified financial literacy app based on Nomura's challenge, with hands-on learning in HTML, CSS, React, Node.js, and MongoDB.",
  },
  {
    date: "October 2024",
    title: "Intern Quest",
    speakers: [
      {
        id: 1,
        name: "Niyati Gaonkar",
        designation: "Barclays Intern",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736183225/QuestIT/Team/Former%20Members/niyati-gaonkar_abxvre.jpg",
      },
      {
        id: 2,
        name: "Pranathi Narsupalli",
        designation: "Arcon Intern",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736183226/QuestIT/Team/Former%20Members/pranathi-narsupalli_sxg0h7.jpg",
      },
    ],
    image:
      "https://res.cloudinary.com/bytewise0405/image/upload/v1742231052/QuestIT/Events/intern-quest_ucwnua.jpg",
    description:
      "A workshop designed for TE students to guide them on finding internships and securing pre-placement offers. The session covered strategies to identify the right opportunities, effective networking techniques, and practical advice from senior speakers who shared their internship journeys and success stories.",
  },
  {
    title: "Code Matrix",
    date: "February 2024",
    speakers: [
      {
        id: 1,
        name: "Raghav Mundhara",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736245319/QuestIT/Team/BE/raghav-mundhara_xvser5.jpg",
      },
      {
        id: 2,
        name: "Shreyash Dasade",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736246615/QuestIT/Team/Former%20Members/shreyash-dasade_cmgphd.png",
      },
      {
        id: 3,
        name: "Nilanchal Panda",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736246615/QuestIT/Team/Former%20Members/nilanchal-panda_sq9tzk.png",
      },
    ],
    image:
      "https://res.cloudinary.com/bytewise0405/image/upload/v1736246856/QuestIT/Events/code-matrix_awxosv.jpg",
    description:
      "A dynamic workshop focused on Data Structures and Algorithms. The session covered key topics, including containers, algorithms, and iterators, with an emphasis on hands-on learning through real-world examples and interactive exercises.",
  },
  {
    date: "January 2024",
    title: "Invictus 2024",
    image:
      "https://res.cloudinary.com/bytewise0405/image/upload/v1736183250/QuestIT/Events/invictus-2024_zxtfpp.jpg",
    description:
      "ISTE-VESIT and Quest-IT, in collaboration with VESIT-IQAC, VESIT-IIC, and Network Marvels, hosted the Invictus Hackathon, powered by GeeksforGeeks and academically supported by Scrimba. This event encouraged participants to demonstrate teamwork, innovation, and coding skills in a competitive environment. Teams of 2-4 members competed for a chance to win cash prizes worth ₹30,000/- along with exciting goodies.",
  },
  {
    title: "API Alchemy",
    date: "September 2023",
    speakers: [
      {
        id: 1,
        name: "Raghav Mundhara",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736245319/QuestIT/Team/BE/raghav-mundhara_xvser5.jpg",
      },
      {
        id: 2,
        name: "Shreyash Dasade",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736246615/QuestIT/Team/Former%20Members/shreyash-dasade_cmgphd.png",
      },
      {
        id: 3,
        name: "Nilanchal Panda",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736246615/QuestIT/Team/Former%20Members/nilanchal-panda_sq9tzk.png",
      },
      {
        id: 4,
        name: "Anket Kadam",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736245320/QuestIT/Team/BE/anket-kadam_lj5i5d.png",
      },
      {
        id: 5,
        name: "Darash Mishra",
        designation: "Guest",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736245507/QuestIT/Team/Former%20Members/darash-mishra_iybbsm.jpg",
      },
    ],
    image:
      "https://res.cloudinary.com/bytewise0405/image/upload/v1736244986/QuestIT/Events/api-alchemy_k7bidr.jpg",
    description:
      "Workshop comprised of Node.js, Express.js, API development, Postman, and MongoDB Atlas. Participants learned about the advantages of Node.js, middleware, routing, and RESTful API principles. The session included practical demonstrations of CRUD operations using Node.js and MongoDB Atlas, along with API testing and development using Postman.",
  },
  {
    date: "September 2025",
    title: "SIH Insider",
    speakers: [
      {
        id: 1,
        name: "Shravani Rasam",
        designation: "SIH Champion",
        image:
          "https://ui-avatars.com/api/?name=Shravani+Rasam&background=0D8ABC&color=fff&size=200",
      },
      {
        id: 2,
        name: "Darshan Khapekar",
        designation: "SIH Champion",
        image:
          "https://ui-avatars.com/api/?name=Darshan+Khapekar&background=0D8ABC&color=fff&size=200",
      },
    ],
    image: "/images/SIH Insider.jpg",
    description:
      "SIH Insider brings past SIH champions Shravani Rasam and Darshan Khapekar to share their real journey—from late-night brainstorming to the national stage. Two voices, one roadmap, and invaluable insights. If SIH 2025 is on your mind, this September workshop is your chance to get ahead.",
  },
  {
    date: "October 2025",
    title: "TestDrive - From Manual to Automation",
    speakers: [
      {
        id: 1,
        name: "Mr. Siddharth Rawlani",
        designation: "Trading Technologies",
        image:
          "https://ui-avatars.com/api/?name=Siddharth+Rawlani&background=0D8ABC&color=fff&size=200",
      },
    ],
    image: "/images/Test Drive.jpg",
    description:
      "TestDrive – From Manual to Automation is an October workshop led by Siddharth Rawlani from Trading Technologies. Learn to accelerate your workflow, master automation tools and frameworks, and explore real FinTech testing practices. This session offers industry insights, practical guidance, and a clear roadmap for moving beyond manual testing.",
  },
  {
    date: "October 2025",
    title: "CodeFlix: ML Special",
    speakers: [
      {
        id: 1,
        name: "Vaishnavi Avhad",
        designation: "Workshop Instructor",
        image:
          "https://ui-avatars.com/api/?name=Vaishnavi+Avhad&background=0D8ABC&color=fff&size=200",
      },
      {
        id: 2,
        name: "Harshita Singh",
        designation: "Workshop Instructor",
        image:
          "https://ui-avatars.com/api/?name=Harshita+Singh&background=0D8ABC&color=fff&size=200",
      },
      {
        id: 3,
        name: "Arnav Chaudhary",
        designation: "Workshop Instructor",
        image:
          "https://ui-avatars.com/api/?name=Arnav+Chaudhary&background=0D8ABC&color=fff&size=200",
      },
      {
        id: 4,
        name: "Atharva Lotankar",
        designation: "Workshop Instructor",
        image:
          "https://ui-avatars.com/api/?name=Atharva+Lotankar&background=0D8ABC&color=fff&size=200",
      },
    ],
    image: "/images/CodeFlix.png",
    description:
      "CodeFlix: ML Special is a 2-day beginner-friendly workshop this October featuring Vaishnavi Avhad, Harshita Singh, Arnav Chaudhary, and Atharva Lotankar. SE students will explore how machines learn from data, how intelligence forms, and how platforms like Netflix predict choices in this hands-on introduction to AI and ML.",
  },
  {
    date: "March 2025",
    title: "Invictus 2025",
    image:
      "https://res.cloudinary.com/bytewise0405/image/upload/v1742230930/QuestIT/Events/invictus-2025_heohwg.jpg",
    description:
      "ISTE-VESIT and Quest-IT, in collaboration with VESIT-IQAC, VESIT-IIC, and Network Marvels, hosted the Invictus Hackathon, powered by GeeksforGeeks and academically supported by Scrimba. This event encouraged participants to demonstrate teamwork, innovation, and coding skills in a competitive environment. Teams of 2-4 members competed for a chance to win cash prizes worth ₹30,000/- along with exciting goodies.",
  },
  {
    title: "Code Crack",
    date: "February 2025",
    speakers: [
      {
        id: 1,
        name: "Raghav Mundhara",
        designation: "Technical Lead",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736245319/QuestIT/Team/BE/raghav-mundhara_xvser5.jpg",
      },
      {
        id: 2,
        name: "Anket Kadam",
        designation: "Technical Lead",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736245320/QuestIT/Team/BE/anket-kadam_lj5i5d.png",
      },
    ],
    image:
      "https://res.cloudinary.com/bytewise0405/image/upload/v1742230929/QuestIT/Events/code-crack_upztto.jpg",
    description:
      "The road to placements is full of challenges—but with the right preparation, you can ace it! Join Raghav, Anket, Vishal, and Pratik as they take you through an intensive two-day workshop covering essential DSA concepts, problem-solving strategies, and a real-time aptitude and coding mock test.",
  },
  {
    date: "February 2025",
    title: "Flutter Voyage",
    speakers: [
      {
        id: 1,
        name: "Anish Tawade",
        designation: "JR Graphics Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736242752/QuestIT/Team/SE/anish-tawade_ejnuxi.jpg",
      },
      {
        id: 2,
        name: "Nupur Ghangarekar",
        designation: "JR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736258903/QuestIT/Team/SE/nupur-ghangarekar_uyebtz.jpg",
      },
      {
        id: 3,
        name: "Pranav Titambe",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736244063/QuestIT/Team/TE/pranav-titambe_faqqqs.jpg",
      },
      {
        id: 4,
        name: "Prajjwal Pandey",
        designation: "SR Technical Officer",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1736263872/QuestIT/Team/TE/prajjwal-pandey_s66qyy.jpg",
      },
    ],
    image:
      "https://res.cloudinary.com/bytewise0405/image/upload/v1742230928/QuestIT/Events/flutter-voyage_a55u5t.jpg",
    description:
      "Flutter isn't just a framework—it's a superpower! 🦸‍♂️ Learn to build cross-platform apps, master interactive UI widgets, and create your first Weather App in just two days! 🌦️📱",
  },
  {
    date: "February 2025",
    title: "Project Apex",
    speakers: [
      {
        id: 1,
        designation: "Guest",
        name: "Shumbam Nakashe",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1742230569/QuestIT/Team/Former%20Members/shumbam-nakashe_w5eqfh.jpg",
      },
      {
        id: 2,
        name: "Soham Shetye",
        designation: "Guest",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1742230569/QuestIT/Team/Former%20Members/soham-shetye_lqdj9e.jpg",
      },
      {
        id: 3,
        designation: "Guest",
        name: "Prajakta Upadhye",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1742230570/QuestIT/Team/Former%20Members/prajakta-upadhye_zkbhky.jpg",
      },
      {
        id: 4,
        designation: "Guest",
        name: "Shravani Pore",
        image:
          "https://res.cloudinary.com/bytewise0405/image/upload/v1742230568/QuestIT/Team/Former%20Members/shravani-pore_wbib0z.jpg",
      },
    ],
    image:
      "https://res.cloudinary.com/bytewise0405/image/upload/v1742230929/QuestIT/Events/project-apex_mkdwrn.jpg",
    description:
      "SEs, get ready to kickstart your Field Project! 📅 Join us for an expert-guided session where you'll receive top-notch advice and get your questions answered. This is your chance to set a strong foundation for success—don't miss it! 🎯",
  },
];

export default events;
