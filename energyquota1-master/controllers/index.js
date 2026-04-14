const getLanding = (req, res) => {
  const landingPageConfig = {
    hero: {
      title: "Smart Energy Management for Modern Living",
      subtitle: "Empowering landlords and tenants with real-time energy insights, seamless unit recharges, and efficient property management.",
      button1Text: "Get Started as Owner",
      button1Link: "/owners/register",
      button2Text: "Tenant Login",
      button2Link: "/tenants_account/login",
      backgroundImage: "" // No external image; hero uses gradient only
    },
    navbarLinks: [
      { text: "Home", link: "/", isActive: true },
      { text: "Owner Login", link: "/owners/login", isActive: false },
      { text: "Tenant Login", link: "/tenants_account/login", isActive: false },
      { text: "Register", link: "/owners/register", isActive: false }
    ],
    ctaCards: [
      {
        iconPath: "<path d=\"M543.8 287.6c17 0 32-14 32-32.1c1-9-3-17-11-24L512 185V64c0-17.7-14.3-32-32-32H448c-17.7 0-32 14.3-32 32v36.7L309.5 7c-6-5-14-7-21-7s-15 1-22 8L10 231.5c-7 7-10 15-10 24c0 18 14 32.1 32 32.1h32V448c0 35.3 28.7 64 64 64H448.5c35.5 0 64.2-28.8 64-64.3l-.7-160.2h32zM288 160a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM176 400c0-44.2 35.8-80 80-80h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H192c-8.8 0-16-7.2-16-16z\"/>",
        title: "House Owner",
        description: "Manage your properties, tenants, and energy consumption with powerful tools and real-time data.",
        button1Text: "Register",
        button1Link: "/owners/register",
        button2Text: "Login",
        button2Link: "/owners/login"
      },
      {
        iconPath: "<path d=\"M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z\"/>",
        title: "Tenant",
        description: "Track your energy usage, monitor remaining units, and recharge easily from your dashboard.",
        button1Text: "Login",
        button1Link: "/tenants_account/login",
        button2Text: null, // No second button for tenant login
        button2Link: null
      }
    ],
    footer: {
      aboutText: "Smart metering solutions for a sustainable future.",
      quickLinks: [
        { text: "Home", link: "#" },
        { text: "Features", link: "#" },
        { text: "About Us", link: "#" },
        { text: "Contact", link: "#" }
      ],
      supportLinks: [
        { text: "FAQs", link: "#" },
        { text: "Privacy Policy", link: "#" },
        { text: "Terms of Service", link: "#" }
      ],
      contactInfo: {
        address1: "123 Smart Grid Street",
        address2: "Energy City, EQ 12345",
        email: "info@energyquota.com",
        phone: "+1 (555) 123-4567"
      },
      socialLinks: [
        { iconClass: "fab fa-facebook-f", link: "#" },
        { iconClass: "fab fa-twitter", link: "#" },
        { iconClass: "fab fa-linkedin-in", link: "#" },
        { iconClass: "fab fa-instagram", link: "#" }
      ],
      copyrightText: "© Copyright 2026, EnergyQuota | All Rights Reserved."
    }
  };

  return res.render("landing", { config: landingPageConfig });
};

module.exports = {
  getLanding,
};
