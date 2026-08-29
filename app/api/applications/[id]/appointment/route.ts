import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  const { officeName, slotDate, slotTime } = await req.json();

  const appointment = await prisma.appointment.upsert({
    where: { applicationId: params.id },
    update: { officeName, slotDate, slotTime },
    create: {
      applicationId: params.id,
      userId: (session.user as any).id,
      officeName,
      slotDate,
      slotTime
    }
  });

  return NextResponse.json({ appointment });
}
