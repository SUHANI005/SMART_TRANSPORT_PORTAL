import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { service: true, documents: true, payment: true, appointment: true, user: true }
  });
  if (!application) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const role = (session.user as any).role;
  const uid = (session.user as any).id;
  if (application.userId !== uid && role !== "OFFICER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  return NextResponse.json({ application });
}

// Officers/Admins update status; citizens can only edit while in DRAFT.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "OFFICER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Only transport officers can update application status." }, { status: 403 });
  }

  const body = await req.json();
  const { status, officerRemark } = body;

  const updated = await prisma.application.update({
    where: { id: params.id },
    data: { status, officerRemark }
  });

  return NextResponse.json({ application: updated });
}
