import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(req) {
  try {
    // Get the URL parameters
    const searchParams = new URL(req.url).searchParams;
    const studentId = searchParams.get('studentId') || '11b5549b-aa17-42df-a933-f2a043ca3a4d'; // Default to a known ID

    // Test Supabase connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('students')
      .select('count')
      .limit(1)
      .single();

    if (connectionError) {
      return NextResponse.json({ 
        error: 'Supabase connection error', 
        details: connectionError.message
      }, { status: 500 });
    }

    // Test student fetch
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    // Check available tables
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    // Test direct test_attempts query
    const { data: testAttempts, error: testAttemptsError } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('student_id', studentId);

    // Try more detailed query if basic one works
    let detailedAttempts = null;
    let detailedError = null;

    if (testAttempts && testAttempts.length > 0) {
      const { data, error } = await supabase
        .from('test_attempts')
        .select(`
          id,
          student_id,
          test_id,
          completed_at,
          tests(id, Title)
        `)
        .eq('student_id', studentId)
        .limit(1);
      
      detailedAttempts = data;
      detailedError = error;
    }

    return NextResponse.json({
      status: 'success',
      supabaseConnectionOk: true,
      student: student || null,
      studentError: studentError ? studentError.message : null,
      tables: tables || [],
      tablesError: tablesError ? tablesError.message : null,
      testAttempts: testAttempts || [],
      testAttemptsCount: testAttempts ? testAttempts.length : 0,
      testAttemptsError: testAttemptsError ? testAttemptsError.message : null,
      detailedAttempt: detailedAttempts ? detailedAttempts[0] : null,
      detailedAttemptError: detailedError ? detailedError.message : null,
      env: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return NextResponse.json({ 
      error: 'Failed to test Supabase connection', 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 