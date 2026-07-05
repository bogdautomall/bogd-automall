export interface Dictionary {
  nav: {
    home: string;
    inventory: string;
    about: string;
    contact: string;
  };
  home: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaInventory: string;
    ctaAbout: string;
    highlight1Title: string;
    highlight1Body: string;
    highlight2Title: string;
    highlight2Body: string;
    highlight3Title: string;
    highlight3Body: string;
    featuredTitle: string;
    featuredSeeAll: string;
    comingSoonTitle: string;
    comingSoonBody: string;
    comingSoonCta: string;
  };
  about: {
    title: string;
    slogan: string;
    intro: string;
    body1Title: string;
    body1: string;
    body2Title: string;
    point1: string;
    point2: string;
    point3: string;
    point4: string;
    ctaTitle: string;
    ctaButton: string;
  };
  contact: {
    title: string;
    subtitle: string;
    addressLabel: string;
    address: string;
    phoneLabel: string;
    emailLabel: string;
    hoursLabel: string;
    hours: string;
    formTitle: string;
    formName: string;
    formPhone: string;
    formMessage: string;
    formSubmit: string;
    formNote: string;
    mapTitle: string;
    socialTitle: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    rights: string;
  };
}

export const dictionaries: Record<"mn" | "en", Dictionary> = {
  mn: {
    nav: {
      home: "Нүүр",
      inventory: "Каталог",
      about: "Бидний тухай",
      contact: "Холбоо барих",
    },
    home: {
      eyebrow: "Bogd Automall",
      titleLine1: "Таны итгэлтэй",
      titleLine2: "автомашины сонголт",
      subtitle:
        "Богд Автомолл — чанар баталгаажсан автомашины том сонголт, ил тод үнэ, найдвартай үйлчилгээ нэг дороос.",
      ctaInventory: "Каталог үзэх",
      ctaAbout: "Бидний тухай",
      highlight1Title: "Баталгаат чанар",
      highlight1Body: "Машин бүр манай нарийн шалгуураар нягт нямбай шалгагдсан.",
      highlight2Title: "Уян хатан төлбөр",
      highlight2Body: "Бэлэн мөнгө болон 8.5–25 сая ₮ урьдчилгаатай зээлийн боломж.",
      highlight3Title: "Хүргэлтийн үйлчилгээ",
      highlight3Body: "Улаанбаатар хот дотор хүргэж өгөх боломжтой.",
      featuredTitle: "Онцлох машинууд",
      featuredSeeAll: "Бүгдийг үзэх →",
      comingSoonTitle: "Каталог бэлтгэгдэж байна",
      comingSoonBody:
        "Удахгүй манай бүрэн сонголтыг эндээс үзэх боломжтой болно. Одоохондоо машин сонголтын талаар лавлах бол бидэнтэй холбогдоно уу.",
      comingSoonCta: "Холбоо барих",
    },
    about: {
      title: "Бидний тухай",
      slogan: "БОДИТ ҮНЭ, СЭТГЭЛ ХАНАМЖ",
      intro:
        "Богд Автомолл нь Улаанбаатар хотын Яармаг дүүрэгт байрлах, автомашин худалдаалдаг найдвартай төв юм. Бид жил бүр мянга гаруй үйлчлүүлэгчдэдээ чанартай, баталгаат автомашин санал болгож ирсэн.",
      body1Title: "Бидний зорилго",
      body1:
        "Үйлчлүүлэгч бүрт тохирсон машиныг ил тод үнээр, шударга үйлчилгээгээр хүргэх нь бидний эрхэм зорилго. Бид худалдан авагчийн итгэлийг эрхэмлэн, чанар, найдвартай байдлыг эн тэргүүнд тавьдаг.",
      body2Title: "Яагаад биднийг сонгох вэ?",
      point1: "Нарийн шалгуураар шалгагдсан, баталгаат чанартай автомашин",
      point2: "Бэлэн мөнгө болон зээлийн уян хатан нөхцөл",
      point3: "Улаанбаатар хот дотор хүргэлтийн үйлчилгээ",
      point4: "Худалдан авалтын дараах дэмжлэг, зөвлөгөө",
      ctaTitle: "Машин сонголттой танилцахад бэлэн үү?",
      ctaButton: "Каталог үзэх",
    },
    contact: {
      title: "Холбоо барих",
      subtitle:
        "Асуулт байвал бидэнтэй чөлөөтэй холбогдоорой — доорх утас, и-мэйл, эсвэл сошиал хаягаар.",
      addressLabel: "Хаяг",
      address: "Яармаг, Food City худалдааны төв, 2 давхарт, Улаанбаатар",
      phoneLabel: "Утас",
      emailLabel: "И-мэйл",
      hoursLabel: "Ажиллах цаг",
      hours: "Өдөр бүр ажиллана",
      formTitle: "Мессеж илгээх",
      formName: "Таны нэр",
      formPhone: "Утасны дугаар",
      formMessage: "Мессеж",
      formSubmit: "Илгээх",
      formNote:
        "Товч дарахад таны имэйл клиент нээгдэж, бидэнд мессеж илгээх боломжтой болно.",
      mapTitle: "Байршил",
      socialTitle: "Сошиал хаяг",
    },
    footer: {
      tagline: "Таны итгэлтэй хамтрагч — чанартай автомашин сонголт, найдвартай үйлчилгээ.",
      quickLinks: "Шуурхай холбоос",
      legal: "Эрх зүй",
      privacy: "Нууцлалын бодлого",
      terms: "Үйлчилгээний нөхцөл",
      contact: "Холбоо барих",
      rights: "Бүх эрх хуулиар хамгаалагдсан.",
    },
  },
  en: {
    nav: {
      home: "Home",
      inventory: "Inventory",
      about: "About",
      contact: "Contact",
    },
    home: {
      eyebrow: "Bogd Automall",
      titleLine1: "Your trusted",
      titleLine2: "vehicle destination",
      subtitle:
        "Bogd Automall offers a large selection of quality-checked vehicles, transparent pricing, and reliable service — all in one place.",
      ctaInventory: "Browse Inventory",
      ctaAbout: "About Us",
      highlight1Title: "Verified Quality",
      highlight1Body: "Every vehicle passes our thorough inspection process.",
      highlight2Title: "Flexible Payment",
      highlight2Body: "Cash or financing with a ₮8.5M–25M down payment option.",
      highlight3Title: "Delivery Service",
      highlight3Body: "We can deliver within Ulaanbaatar city.",
      featuredTitle: "Featured Vehicles",
      featuredSeeAll: "See all →",
      comingSoonTitle: "Inventory coming soon",
      comingSoonBody:
        "Our full selection will be browsable here soon. In the meantime, contact us to ask about available vehicles.",
      comingSoonCta: "Contact Us",
    },
    about: {
      title: "About Us",
      slogan: "REAL PRICE, REAL SATISFACTION",
      intro:
        "Bogd Automall is a trusted vehicle dealership located in the Yarmag district of Ulaanbaatar. Every year we help thousands of customers find quality, verified vehicles.",
      body1Title: "Our Mission",
      body1:
        "Our mission is to match every customer with the right vehicle, at a transparent price, backed by honest service. We put customer trust, quality, and reliability first.",
      body2Title: "Why Choose Us",
      point1: "Thoroughly inspected, quality-verified vehicles",
      point2: "Cash or flexible financing options",
      point3: "Delivery available within Ulaanbaatar",
      point4: "Ongoing support and advice after purchase",
      ctaTitle: "Ready to explore our selection?",
      ctaButton: "Browse Inventory",
    },
    contact: {
      title: "Contact Us",
      subtitle:
        "Have a question? Reach out via phone, email, or social media below.",
      addressLabel: "Address",
      address: "2nd Floor, Food City Mall, Yarmag, Ulaanbaatar",
      phoneLabel: "Phone",
      emailLabel: "Email",
      hoursLabel: "Hours",
      hours: "Open daily",
      formTitle: "Send a Message",
      formName: "Your Name",
      formPhone: "Phone Number",
      formMessage: "Message",
      formSubmit: "Send",
      formNote:
        "Clicking send will open your email client with your message ready to send to us.",
      mapTitle: "Location",
      socialTitle: "Follow Us",
    },
    footer: {
      tagline: "Your trusted partner for quality vehicles and reliable service.",
      quickLinks: "Quick Links",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact",
      rights: "All rights reserved.",
    },
  },
};

export type Locale = "mn" | "en";
