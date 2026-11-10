import { NextResponse } from 'next/server';
import { clearSessionToken } from '../../../lib/session';
export async function DELETE(){await clearSessionToken();return NextResponse.json({ok:true})}
