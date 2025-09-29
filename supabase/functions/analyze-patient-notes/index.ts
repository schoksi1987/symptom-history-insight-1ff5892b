import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { noteId, noteText, patientId } = await req.json();

    if (!noteId || !noteText || !patientId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update note status to processing
    await supabase
      .from('patient_notes')
      .update({ analysis_status: 'processing' })
      .eq('id', noteId);

    // Analyze note with AI
    const analysisPrompt = `
Analyze this patient note for a diabetes care management system. Extract:

1. SYMPTOMS: Identify any symptoms mentioned (fatigue, thirst, frequent urination, blurred vision, etc.)
2. DIABETES INSIGHTS: Assess diabetes-related concerns and provide confidence score (0-1)
3. SUMMARY: Create a concise physician summary (2-3 sentences max)

Patient Note: "${noteText}"

Respond with JSON in this exact format:
{
  "symptoms": [
    {
      "name": "symptom name",
      "severity": "mild|moderate|severe",
      "frequency": "rare|occasional|frequent|constant",
      "confidence": 0.8
    }
  ],
  "diabetesInsights": {
    "riskLevel": "low|moderate|high",
    "confidence": 0.85,
    "concerns": ["concern1", "concern2"],
    "recommendations": ["rec1", "rec2"]
  },
  "summary": "Brief physician summary of the note"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI assistant specializing in diabetes care. Provide accurate, structured analysis of patient notes.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const analysisText = aiData.choices[0].message.content;
    
    // Parse AI response
    let analysis;
    try {
      // Extract JSON from AI response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Failed to parse AI analysis');
    }

    // Calculate overall confidence score
    const overallConfidence = analysis.diabetesInsights?.confidence || 0.5;

    // Update patient note with analysis
    const { error: updateError } = await supabase
      .from('patient_notes')
      .update({
        ai_summary: analysis.summary,
        identified_symptoms: analysis.symptoms || [],
        diabetes_insights: analysis.diabetesInsights || {},
        confidence_score: overallConfidence,
        analysis_status: 'completed'
      })
      .eq('id', noteId);

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`);
    }

    // Add high-confidence symptoms to patient_symptoms table
    if (analysis.symptoms && analysis.symptoms.length > 0) {
      for (const symptom of analysis.symptoms) {
        if (symptom.confidence >= 0.7) { // Only add high-confidence symptoms
          const { error: symptomError } = await supabase
            .from('patient_symptoms')
            .upsert({
              patient_id: patientId,
              symptom_name: symptom.name,
              severity: symptom.severity,
              frequency: symptom.frequency,
              source: 'ai_detected',
              note_id: noteId,
              metadata: { confidence: symptom.confidence }
            }, {
              onConflict: 'patient_id,symptom_name,note_id',
              ignoreDuplicates: false
            });

          if (symptomError) {
            console.error('Error adding symptom:', symptomError);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary: analysis.summary,
        symptomsFound: analysis.symptoms?.length || 0,
        diabetesRisk: analysis.diabetesInsights?.riskLevel || 'low',
        confidence: overallConfidence
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Analysis error:', error);
    
    // unable to mark note as failed because request body cannot be re-read here

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});