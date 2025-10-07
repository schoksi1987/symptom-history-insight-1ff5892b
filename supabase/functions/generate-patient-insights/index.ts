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

    // Prepare AI prompt
    const prompt = `You are a clinical analytics AI analyzing a diabetes patient's data against clinical research, peer findings, and statistical trends.

PATIENT DATA:
Symptoms: ${JSON.stringify(symptoms)}
Recent Notes: ${JSON.stringify(notes?.map(n => ({ note_text: n.note_text, ai_summary: n.ai_summary })))}

CLINICAL NEWS:
${JSON.stringify(news?.map(n => ({ title: n.title, content: n.content, category: n.category })))}

PEER FINDINGS:
${JSON.stringify(peerFindings?.map(p => ({ title: p.finding_title, description: p.finding_description, demographics: p.patient_demographics, outcomes: p.outcome_data })))}

STATISTICAL TRENDS:
${JSON.stringify(trends?.map(t => ({ name: t.trend_name, category: t.trend_category, data: t.data_points })))}

Based on this data, provide a comprehensive analysis with:
1. Similarity Score (0-100): How similar is this patient to patterns in the data?
2. Matching Factors: Which specific symptoms, demographics, or characteristics match the research/peer data?
3. Risk Insights: What risks are indicated based on similar patient outcomes in the research?
4. Predictions: What outcomes or progression patterns are likely based on similar cases?
5. News References: Which news articles are most relevant?
6. Peer Finding References: Which peer findings are most applicable?
7. Statistical References: Which statistical trends apply?

Return your analysis in this JSON format:
{
  "similarity_score": <number>,
  "matching_factors": [{"factor": "string", "confidence": "high|medium|low", "details": "string"}],
  "risk_insights": [{"risk": "string", "severity": "high|medium|low", "evidence": "string"}],
  "predictions": [{"prediction": "string", "likelihood": "high|medium|low", "timeframe": "string"}],
  "news_references": [<array of news IDs from the provided data>],
  "peer_finding_references": [<array of peer finding IDs>],
  "statistical_references": [<array of statistical trend IDs>],
  "similar_patient_profile": {"description": "string", "key_characteristics": ["string"]},
  "recommendations": ["string"]
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
        risk_insights: analysis.risk_insights,
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
          predictions: analysis.predictions,
          recommendations: analysis.recommendations
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
