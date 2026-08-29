import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { genReference } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  const body = await req.json();
  const { serviceSlug, fullName, dob, address, vehicleOrLicenceNo } = body;

  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });

  const application = await prisma.application.create({
    data: {
      referenceNo: genReference(),
      userId: (session.user as any).id,
      serviceId: service.id,
      status: "SUBMITTED",
      fullName,
      dob,
      address,
      vehicleOrLicenceNo
    }
  });

  return NextResponse.json({ application });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  const applications = await prisma.application.findMany({
    where: { userId: (session.user as any).id },
    include: { service: true, payment: true, appointment: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ applications });
}
