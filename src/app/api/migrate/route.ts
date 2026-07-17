import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite } from '@/lib/portfolio/api-helpers'
import { hashPassword } from '@/lib/portfolio/password'

export const dynamic = 'force-static';

export async function GET() {
  return Response.json({ message: "Static API migration route" });
}
