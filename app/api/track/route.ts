import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref")?.trim();
  if (!ref) return NextResponse.json({ error: "Please enter a reference number." }, { status: 400 });

  const application = await prisma.application.findUnique({
    where: { referenceNo: ref },
    include: { service: true, payment: true, appointment: true }
  });

  if (!application) return NextResponse.json({ error: "No application found with that reference number." }, { status: 404 });

  return NextResponse.json({
    application: {
      referenceNo: application.referenceNo,
      status: application.status,
      serviceName: application.service.name,
      officerRemark: application.officerRemark,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      payment: application.payment ? { status: application.payment.status, amount: application.payment.amount } : null,
      appointment: application.appointment ? { officeName: application.appointment.officeName, slotDate: application.appointment.slotDate, slotTime: application.appointment.slotTime } : null
    }
  });
}
