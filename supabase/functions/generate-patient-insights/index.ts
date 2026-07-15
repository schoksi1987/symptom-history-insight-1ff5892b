import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientId } = await req.json();
    
    if (!patientId) {
      return new Response(
        JSON.stringify({ error: 'Patient ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching patient data for:', patientId);

    // Fetch patient profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', patientId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Calculate age from date_of_birth
    let age = null;
    if (profile?.date_of_birth) {
      const birthDate = new Date(profile.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    // Fetch patient symptoms
    const { data: symptoms, error: symptomsError } = await supabase
      .from('patient_symptoms')
      .select('*')
      .eq('patient_id', patientId);

    if (symptomsError) {
      console.error('Error fetching symptoms:', symptomsError);
      throw new Error('Failed to fetch patient symptoms');
    }

    // Fetch patient notes
    const { data: notes, error: notesError } = await supabase
      .from('patient_notes')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (notesError) {
      console.error('Error fetching notes:', notesError);
      throw new Error('Failed to fetch patient notes');
    }

    // Fetch clinical news (diabetes-related)
    const { data: news, error: newsError } = await supabase
      .from('clinical_news')
      .select('*')
      .order('published_date', { ascending: false })
      .limit(10);

    console.log('Fetched news count:', news?.length || 0);

    // Fetch peer findings
    const { data: peerFindings, error: peerError } = await supabase
      .from('peer_findings')
      .select('*')
      .order('publication_date', { ascending: false })
      .limit(10);

    console.log('Fetched peer findings count:', peerFindings?.length || 0);

    // Fetch statistical trends
    const { data: trends, error: trendsError } = await supabase
      .from('statistical_trends')
      .select('*')
      .limit(10);

    console.log('Fetched trends count:', trends?.length || 0);

    // Fetch latest clinical examination
    const { data: exam } = await supabase
      .from('examinations')
      .select('*')
      .eq('patient_user_id', patientId)
      .order('examined_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Fetch latest computed risk score (deterministic model)
    const { data: modelRisk } = await supabase
      .from('patient_risk_scores')
      .select('*')
      .eq('patient_id', patientId)
      .order('computed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('Exam present:', !!exam, 'Model risk:', modelRisk?.score);

    const patientProfile = {
      age: age || 'unknown',
      symptoms: symptoms?.map(s => `${s.symptom_name} (${s.severity})`).join(', '),
      recentNotes: notes?.map(n => n.ai_summary || n.note_text).join('; ')
    };

    const examBlock = exam ? `
CLINICAL EXAMINATION (most recent, ${new Date(exam.examined_at).toISOString().slice(0,10)}):
- BMI: ${exam.bmi ?? 'n/a'}
- Blood pressure: ${exam.systolic_bp ?? '?'} / ${exam.diastolic_bp ?? '?'}
- HbA1c: ${exam.hba1c ?? 'n/a'} %
- Fasting glucose: ${exam.fasting_glucose ?? 'n/a'} mg/dL
- LDL / HDL / Triglycerides: ${exam.ldl ?? '?'} / ${exam.hdl ?? '?'} / ${exam.triglycerides ?? '?'}
- Family history of diabetes: ${exam.family_history_diabetes ? 'yes' : 'no'}
- Smoking: ${exam.smoking_status ?? 'unknown'} · Activity: ${exam.physical_activity_level ?? 'unknown'}
- Physician findings: ${exam.physician_findings ?? '—'}
` : 'CLINICAL EXAMINATION: none on file.';

    const modelBlock = modelRisk ? `
DETERMINISTIC MODEL RISK SCORE: ${modelRisk.score}/100 (probability ${modelRisk.probability}, ${modelRisk.model_version})
Top contributing factors (from logistic model):
${(modelRisk.contributions ?? []).slice(0,6).map((c: any) => `- ${c.label}: weight ${c.weight}`).join('\n')}
` : 'DETERMINISTIC MODEL RISK SCORE: not computed yet.';

    const prompt = `You are a clinical analytics AI analyzing a diabetes patient's specific risk profile against targeted clinical research, peer findings, and statistical trends.

PATIENT PROFILE:
- Age: ${patientProfile.age} years old
- Current Symptoms: ${patientProfile.symptoms || 'None reported'}
- Recent Clinical Notes: ${patientProfile.recentNotes || 'None'}

${examBlock}

${modelBlock}

YOUR TASK: Ground every recommendation in the actual examination values above. Cross-reference with the research/peer findings/trends provided.

AVAILABLE CLINICAL NEWS:
${JSON.stringify(news?.map(n => ({ id: n.id, title: n.title, content: n.content, category: n.category })))}

AVAILABLE PEER FINDINGS:
${JSON.stringify(peerFindings?.map(p => ({ id: p.id, title: p.finding_title, description: p.finding_description, demographics: p.patient_demographics, outcomes: p.outcome_data })))}

AVAILABLE STATISTICAL TRENDS:
${JSON.stringify(trends?.map(t => ({ id: t.id, name: t.trend_name, category: t.trend_category, data: t.data_points })))}

CRITICAL INSTRUCTIONS:
1. Use the DETERMINISTIC MODEL RISK SCORE as the authoritative risk_score — do not recompute. If missing, estimate 0–100 from exam + symptoms.
2. Each recommendation MUST cite a specific exam value or symptom (e.g. "HbA1c 8.2% → intensify glycemic control", "LDL 165 → discuss statin therapy", "Systolic 142 → 4-week BP recheck").
3. Only reference news/findings/trends that match this patient's age, vitals, or symptoms.
4. For each matching factor, explain WHY it applies to THIS patient's numbers.
5. Identify what worked best for similar patients in peer findings.

Return your analysis in this EXACT JSON format:
{
  "risk_score": <number>,
  "similarity_score": <number 0-100>,
  "matching_factors": [{"factor": "string", "confidence": "high|medium|low", "details": "why this applies to age ${patientProfile.age} with these vitals"}],
  "risk_insights": [{"risk": "string", "severity": "high|medium|low", "evidence": "specific evidence + exam value", "relevance": "why this applies to THIS patient"}],
  "predictions": [{"prediction": "string", "likelihood": "high|medium|low", "timeframe": "string", "based_on": "which peer findings/studies"}],
  "news_references": [<IDs>],
  "peer_finding_references": [<IDs>],
  "statistical_references": [<IDs>],
  "similar_patient_profile": {"description": "string", "key_characteristics": ["..."], "outcomes": "string"},
  "recommendations": ["Each item must cite the exam value or symptom that triggered it."],
  "targeted_insights": {
    "matching_research": "string",
    "similar_patient_outcomes": "string",
    "demographic_trends": "string",
    "examination_drivers": "one-sentence summary of which vitals drove the recommendations"
  }
}`;

    console.log('Calling Lovable AI for analysis...');

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a clinical analytics AI specializing in diabetes risk assessment and patient similarity analysis.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices[0].message.content;
    
    console.log('AI response received, parsing...');

    // Parse AI response
    let analysis;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('AI response:', analysisText);
      throw new Error('Failed to parse AI analysis');
    }

    // Store analysis in database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('patient_similarity_analysis')
      .insert({
        patient_id: patientId,
        similarity_score: analysis.similarity_score,
        matching_factors: analysis.matching_factors,
        risk_insights: {
          ...analysis.risk_insights,
          risk_score: analysis.risk_score
        },
        similar_patient_profile: analysis.similar_patient_profile,
        news_references: analysis.news_references || [],
        peer_finding_references: analysis.peer_finding_references || [],
        statistical_references: analysis.statistical_references || [],
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving analysis:', saveError);
      throw new Error('Failed to save analysis');
    }

    console.log('Analysis saved successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: {
          ...savedAnalysis,
          risk_score: analysis.risk_score,
          predictions: analysis.predictions,
          recommendations: analysis.recommendations,
          targeted_insights: analysis.targeted_insights
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-patient-insights:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
