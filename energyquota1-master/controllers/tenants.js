const Tenant = require("../models/tenantModel");
const { sendSms } = require("../utils/sendSms");
const PDFDocument = require("pdfkit-table");

// function to generate passwords for registered tenants
const generateRandomPassword = (length) => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const getTenants = async (req, res) => {
  const user = req.user;
  const tenants = await Tenant.find({ house_owner: user._id });
  res.render("owner_tenants", {
    user,
    currentPage: "tenants",
    tenants,
  });
};

const getTenantsRegister = (req, res) => {
  const user = req.user;
  res.render("owner_tenants_register", {
    user,
    currentPage: "tenants",
    message: "",
  });
};

const postTenantRegister = async (req, res) => {
  const { name, email, phone_number, house_number, meter_number } = req.body;

  const user = req.user;

  //validate data
  if (!name || !email || !phone_number || !house_number) {
    return res.render("owner_tenants_register", {
      user,
      currentPage: "tenants",
      message: "",
    });
  }

  // check if user is already registered
  const tenant = await Tenant.findOne({ email: email });

  if (tenant) {
    return res.render("owner_tenants_register", {
      user,
      currentPage: "tenants",
      message: "Tenant already registered",
    });
  }

  // check if there is meter number with same house number
  const isHouseTaken = await Tenant.findOne({
    meter_number: meter_number,
    house_number: house_number,
  });

  if (isHouseTaken) {
    return res.render("owner_tenants_register", {
      user,
      currentPage: "tenants",
      message:
        "The house number is already assigned to a tenant with the same meter number.",
    });
  }

  // save tenant account
  try {
    const password = generateRandomPassword(8);

    const new_tenant = new Tenant({
      name,
      email,
      phone_number,
      house_number,
      password,
      house_owner: user.id,
      tenant_id: meter_number + house_number,
      meter_number,
    });

    await new_tenant.save();
    const loginUrl = `${process.env.FRONTEND_URL}/tenants_account/login`;

    // Send sms to the tenant
    const message = `Hi ${name}, 
your EnergyQuota account is set.

Email: ${email}, Password: ${password} 

Login link: ${loginUrl} 

Please keep this information secure.
    `;
    const tenantPhoneNumber = phone_number;

    await sendSms(message, tenantPhoneNumber);
    return res.render("owner_tenants_register", {
      user,
      currentPage: "tenants",
      message:
        "Tenant registered successfully, Login credentials sent to tenant email.",
    });
  } catch (error) {
    console.log(error);
  }
};

const getTenantEdit = async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  try {
    const tenant = await Tenant.findOne({ _id: id });
    return res.render("owner_tenants_edit", {
      user,
      currentPage: "tenants",
      message: "",
      tenant,
    });
  } catch (error) {
    console.log(error);
  }
};

const putTenantEdit = async (req, res) => {
  const { name, phone_number, house_number } = req.body;
  const id = req.params.id;
  try {
    await Tenant.findOneAndUpdate(
      { _id: id },
      { name: name, phone_number: phone_number, house_number: house_number },
      { new: true }
    );
    res.redirect("/tenants");
  } catch (error) {
    console.log(error);
  }
};

const deleteTenant = async (req, res) => {
  const { user_id } = req.body;
  try {
    await Tenant.findOneAndDelete({ _id: user_id });
    res.json({ message: "ok" });
  } catch (error) {
    console.log(error);
  }
};

const getTenantsDownload = async (req, res) => {
  const user = req.user;
  // Create a new PDF document
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 30, left: 50, right: 20 },
    compress: true,
    permissions: {
      printing: "highResolution",
      modifying: false,
    },
  });

  doc.font("Times-Bold").fontSize(18).text("EnergyQuota", {
    align: "center",
  });

  doc
    .font("Times-Roman")
    .fontSize(14)
    .text("Smart Electrical Meter for Multiple Tenants", {
      align: "center",
    });

  // Set line color and thickness
  doc.strokeColor("black").lineWidth(3); // Adjust the line color and thickness as needed

  // Calculate the position for the line based on 80% of the page width
  const pageWidth = doc.page.width;
  const lineWidth = pageWidth * 0.8;
  const linePosition = (pageWidth - lineWidth) / 2;

  // Draw the line
  doc
    .moveTo(linePosition, 90) // Adjust the Y-coordinate as needed
    .lineTo(linePosition + lineWidth, 90) // Adjust the Y-coordinate as needed
    .stroke();
  doc.moveDown(1);

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // Get today's date
  const today = new Date();
  // Format the date using the formatDate function
  const formattedDate = formatDate(today);
  doc.fontSize(14).font("Times-Bold").text(`Owner name: ${user.full_name}`, {
    align: "center",
  });

  doc
    .fontSize(14)
    .font("Times-Bold")
    .text(`Meter number: ${user.meter_number}`, {
      align: "center",
    });

  doc
    .fontSize(12)
    .font("Times-Roman")
    .text(`List of registered Tenants - ${formattedDate}`, {
      align: "center",
    });

  doc.moveDown(1);

  // create table of tenants
  const tenants = await Tenant.find({ house_owner: user._id });

  const table = {
    headers: [
      { label: "Name", property: "name", width: 100, renderer: null },
      { label: "Email", property: "email", width: 160, renderer: null },
      {
        label: "Phone number",
        property: "phone_number",
        width: 100,
        renderer: null,
      },
      {
        label: "House Number",
        property: "house_number",
        width: 100,
        renderer: null,
      },
    ],
    // complex data
    datas: tenants,
  };

  // the magic
  doc.table(table, {
    prepareHeader: () => doc.font("Times-Bold").fontSize(14),
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      doc.font("Times-Roman").fontSize(12);
    },
  });

  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${user.full_name}-tenants.pdf`
  );

  // Pipe the PDF content to the response stream
  doc.pipe(res);

  // Finalize the PDF
  doc.end();
};

module.exports = {
  getTenants,
  getTenantsRegister,
  postTenantRegister,
  getTenantEdit,
  putTenantEdit,
  deleteTenant,
  getTenantsDownload,
};
