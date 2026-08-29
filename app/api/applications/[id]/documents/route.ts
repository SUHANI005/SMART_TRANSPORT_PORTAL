import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  const { label, fileName, dataUrl, aiCheck } = await req.json();

  const doc = await prisma.document.create({
    data: {
      applicationId: params.id,
      label,
      fileName,
      dataUrl,
      aiCheck: aiCheck ? JSON.stringify(aiCheck) : null
    }
  });

  await prisma.application.update({ where: { id: params.id }, data: { status: "DOCS_PENDING" } });

  return NextResponse.json({ document: { id: doc.id, label: doc.label, fileName: doc.fileName } });
}
