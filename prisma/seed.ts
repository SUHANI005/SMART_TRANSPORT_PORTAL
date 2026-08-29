import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "citizen@demo.in" },
    update: {},
    create: {
      name: "Aisha Khan",
      email: "citizen@demo.in",
      passwordHash: pass,
      role: "CITIZEN",
      phone: "9876500001"
    }
  });

  await prisma.user.upsert({
    where: { email: "officer@demo.in" },
    update: {},
    create: {
      name: "R. Verma",
      email: "officer@demo.in",
      passwordHash: pass,
      role: "OFFICER",
      phone: "9876500002"
    }
  });

  await prisma.user.upsert({
    where: { email: "admin@demo.in" },
    update: {},
    create: {
      name: "S. Iyer",
      email: "admin@demo.in",
      passwordHash: pass,
      role: "ADMIN",
      phone: "9876500003"
    }
  });

  const services = [
    {
      slug: "apply-driving-licence",
      category: "Driving Licence",
      name: "Apply for Driving Licence",
      nameHi: "ड्राइविंग लाइसेंस के लिए आवेदन करें",
      summary: "Get a new driving licence after passing your driving test.",
      summaryHi: "ड्राइविंग टेस्ट पास करने के बाद नया लाइसेंस पाएं।",
      purpose: "A driving licence lets you legally drive a vehicle on public roads.",
      whoCanApply: "Anyone who holds a valid learner licence for at least 30 days and meets the minimum age requirement.",
      documents: JSON.stringify(["Learner Licence", "Address Proof", "Age Proof", "Passport-size Photo"]),
      fee: 700,
      steps: JSON.stringify(["Fill personal details", "Upload documents", "Pay fee", "Book driving test slot", "Attend test", "Receive licence"]),
      estTime: "7-15 working days",
      icon: "IdCard"
    },
    {
      slug: "renew-driving-licence",
      category: "Driving Licence",
      name: "Renew Driving Licence",
      nameHi: "ड्राइविंग लाइसेंस नवीनीकरण",
      summary: "Renew your driving licence before or after it expires.",
      purpose: "Keeps your driving licence valid so you can continue to drive legally.",
      whoCanApply: "Any existing driving licence holder whose licence has expired or is about to expire.",
      documents: JSON.stringify(["Existing Licence", "Address Proof", "Medical Certificate (if above 40)", "Passport-size Photo"]),
      fee: 400,
      steps: JSON.stringify(["Fill renewal details", "Upload documents", "Pay fee", "Track application", "Download renewed licence"]),
      estTime: "5-10 working days",
      icon: "RefreshCw"
    },
    {
      slug: "lost-licence-replacement",
      category: "Driving Licence",
      name: "Lost Licence Replacement",
      summary: "Get a duplicate licence if your original is lost, stolen, or damaged.",
      purpose: "Issues a duplicate copy of your driving licence.",
      whoCanApply: "Any licence holder who has lost or damaged their original licence.",
      documents: JSON.stringify(["Police FIR / Lost Report (if stolen)", "Address Proof", "Passport-size Photo"]),
      fee: 300,
      steps: JSON.stringify(["Fill details", "Upload documents", "Pay fee", "Track application", "Download duplicate licence"]),
      estTime: "5-7 working days",
      icon: "FileSearch"
    },
    {
      slug: "register-new-vehicle",
      category: "Vehicle Services",
      name: "Register a New Vehicle",
      summary: "Register your newly purchased vehicle with the transport office.",
      purpose: "Legally registers vehicle ownership and issues a Vehicle Registration Certificate.",
      whoCanApply: "Owners of a newly purchased vehicle.",
      documents: JSON.stringify(["Sale Invoice", "Vehicle Insurance", "PUC Certificate", "Address Proof", "ID Proof"]),
      fee: 1200,
      steps: JSON.stringify(["Fill vehicle details", "Upload documents", "Pay fee", "Book inspection appointment", "Receive registration certificate"]),
      estTime: "7-10 working days",
      icon: "Car"
    },
    {
      slug: "transfer-vehicle-ownership",
      category: "Vehicle Services",
      name: "Transfer Vehicle Ownership",
      summary: "Transfer registration of a vehicle to a new owner after sale or purchase.",
      purpose: "Updates official records so the vehicle is registered to its new owner.",
      whoCanApply: "Buyers and sellers of a used vehicle.",
      documents: JSON.stringify(["Sale Agreement", "Original Registration Certificate", "Insurance", "ID Proof of Buyer & Seller", "No Objection Certificate (if financed)"]),
      fee: 900,
      steps: JSON.stringify(["Fill transfer details", "Upload documents", "Pay fee", "Book appointment", "Track application", "Download updated certificate"]),
      estTime: "10-15 working days",
      icon: "ArrowLeftRight"
    },
    {
      slug: "pay-traffic-challan",
      category: "Payments",
      name: "Pay Traffic Challan",
      summary: "Check and pay pending traffic challans against your vehicle.",
      purpose: "Clears pending traffic fines linked to your vehicle number.",
      whoCanApply: "Any vehicle owner with a pending challan.",
      documents: JSON.stringify(["Vehicle Registration Number", "Challan Number (optional)"]),
      fee: 0,
      steps: JSON.stringify(["Enter vehicle number", "View pending challans", "Pay fee", "Download receipt"]),
      estTime: "Instant",
      icon: "Receipt"
    },
    {
      slug: "vehicle-permit",
      category: "Permits",
      name: "Apply for Vehicle Permit",
      summary: "Get a permit to operate a commercial vehicle on public roads.",
      purpose: "Authorises commercial use of a vehicle for goods or passenger transport.",
      whoCanApply: "Owners of commercial vehicles.",
      documents: JSON.stringify(["Vehicle Registration Certificate", "Fitness Certificate", "Insurance", "ID Proof"]),
      fee: 1500,
      steps: JSON.stringify(["Fill permit details", "Upload documents", "Pay fee", "Track application", "Download permit"]),
      estTime: "10-20 working days",
      icon: "ClipboardCheck"
    }
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s
    });
  }

  const notices = [
    { title: "Portal maintenance on Sundays 2-4 AM", body: "The portal will be briefly unavailable for scheduled maintenance." },
    { title: "New: Book driving test slots online", body: "You can now pick your driving test date and time directly after applying." },
    { title: "Reminder: Renew licences before expiry", body: "Avoid late fees by renewing your driving licence at least 30 days before it expires." }
  ];
  // Idempotent: safe to run on every deploy.
  await prisma.notice.deleteMany({});
  for (const n of notices) {
    await prisma.notice.create({ data: n });
  }

  console.log("Seed complete. Demo logins (password: password123):");
  console.log(" citizen@demo.in / officer@demo.in / admin@demo.in");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
