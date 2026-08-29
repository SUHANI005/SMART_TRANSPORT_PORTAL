import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { genTxnId } from "@/lib/utils";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  const application = await prisma.application.findUnique({ where: { id: params.id }, include: { service: true } });
  if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });

  const { method } = await req.json();

  const payment = await prisma.payment.upsert({
    where: { applicationId: params.id },
    update: { status: "PAID", method: method ?? "Mock UPI" },
    create: {
      applicationId: params.id,
      amount: application.service.fee,
      status: "PAID",
      method: method ?? "Mock UPI",
      transactionId: genTxnId()
    }
  });

  await prisma.application.update({ where: { id: params.id }, data: { status: "UNDER_REVIEW" } });

  return NextResponse.json({ payment });
}
