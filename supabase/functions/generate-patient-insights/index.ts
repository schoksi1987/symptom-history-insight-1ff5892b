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

    // Prepare AI prompt with patient-specific focus
    const patientProfile = {
      age: age || 'unknown',
      symptoms: symptoms?.map(s => `${s.symptom_name} (${s.severity})`).join(', '),
      recentNotes: notes?.map(n => n.ai_summary || n.note_text).join('; ')
    };

    const prompt = `You are a clinical analytics AI analyzing a diabetes patient's specific risk profile against targeted clinical research, peer findings, and statistical trends.

PATIENT PROFILE:
- Age: ${patientProfile.age} years old
- Current Symptoms: ${patientProfile.symptoms || 'None reported'}
- Recent Clinical Notes: ${patientProfile.recentNotes || 'None'}

YOUR TASK: Find ONLY the research, peer findings, and statistical trends that directly match THIS patient's profile (age: ${patientProfile.age}, symptoms: ${patientProfile.symptoms}).

AVAILABLE CLINICAL NEWS:
${JSON.stringify(news?.map(n => ({ id: n.id, title: n.title, content: n.content, category: n.category })))}

AVAILABLE PEER FINDINGS:
${JSON.stringify(peerFindings?.map(p => ({ id: p.id, title: p.finding_title, description: p.finding_description, demographics: p.patient_demographics, outcomes: p.outcome_data })))}

AVAILABLE STATISTICAL TRENDS:
${JSON.stringify(trends?.map(t => ({ id: t.id, name: t.trend_name, category: t.trend_category, data: t.data_points })))}

CRITICAL INSTRUCTIONS:
1. Calculate an overall diabetes risk score (0-100) based on patient age, symptoms, and matching research
2. ONLY reference news/findings/trends that match the patient's age group and symptoms
3. For each matching factor, explain WHY it matches this specific patient
4. Identify what worked best for similar patients in peer findings
5. Find statistical trends specific to the patient's demographic (e.g., "overweight 35-year-olds")

Return your analysis in this EXACT JSON format:
{
  "risk_score": <number 0-100>,
  "similarity_score": <number 0-100>,
  "matching_factors": [{"factor": "string explaining specific match to this patient", "confidence": "high|medium|low", "details": "why this applies to age ${patientProfile.age} with these symptoms"}],
  "risk_insights": [{"risk": "string", "severity": "high|medium|low", "evidence": "specific evidence from research matching this patient profile", "relevance": "explain why this applies to THIS patient"}],
  "predictions": [{"prediction": "string", "likelihood": "high|medium|low", "timeframe": "string", "based_on": "which peer findings or studies with similar patients"}],
  "news_references": [<IDs of news articles specifically relevant to patient age/symptoms>],
  "peer_finding_references": [<IDs of peer findings with similar patient demographics>],
  "statistical_references": [<IDs of trends matching patient age group and risk factors>],
  "similar_patient_profile": {"description": "profile of similar patients from peer findings", "key_characteristics": ["specific matching characteristics"], "outcomes": "what happened to similar patients"},
  "recommendations": ["specific actions based on what worked for similar patients"],
  "targeted_insights": {
    "matching_research": "summary of research specifically about patients like this one",
    "similar_patient_outcomes": "what happened to patients with same age/symptoms in peer findings",
    "demographic_trends": "statistical trends for this specific age group and risk profile"
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
