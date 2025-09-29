import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Brain, AlertTriangle, CheckCircle, Activity, Loader2 } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

interface PatientNote {
  id: string;
  note_text: string;
  ai_summary: string | null;
  identified_symptoms: Json;
  diabetes_insights: Json;
  confidence_score: number | null;
  analysis_status: string;
  created_at: string;
  note_type: string;
}

interface PatientNotesAnalysisProps {
  patientId: string;
}

export function PatientNotesAnalysis({ patientId }: PatientNotesAnalysisProps) {
  const [notes, setNotes] = useState<PatientNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [patientId]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_notes')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    setIsLoading(true);
    try {
      const { data: insertedNote, error } = await supabase
        .from('patient_notes')
        .insert({
          patient_id: patientId,
          note_text: newNote,
          note_type: 'general'
        })
        .select()
        .single();

      if (error) throw error;

      setNewNote("");
      await fetchNotes();
      
      // Trigger AI analysis
      await analyzeNote(insertedNote.id, newNote);
      
      toast.success('Note added and analysis started');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeNote = async (noteId: string, noteText: string) => {
    setIsAnalyzing(noteId);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-patient-notes', {
        body: {
          noteId,
          noteText,
          patientId
        }
      });

      if (error) throw error;

      await fetchNotes(); // Refresh notes to show analysis
      toast.success(`Analysis complete: ${data.symptomsFound} symptoms identified`);
    } catch (error) {
      console.error('Error analyzing note:', error);
      toast.error('Analysis failed');
    } finally {
      setIsAnalyzing(null);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'moderate': return 'secondary';
      default: return 'outline';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI-Powered Note Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter patient note for AI analysis..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-24"
            />
            <Button 
              onClick={addNote} 
              disabled={isLoading || !newNote.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Note...
                </>
              ) : (
                'Add Note & Analyze'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notes & Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">
                        {new Date(note.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {note.note_text}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {note.note_type}
                    </Badge>
                  </div>

                  {/* Analysis Status */}
                  <div className="flex items-center space-x-2">
                    {note.analysis_status === 'processing' || isAnalyzing === note.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Analyzing...</span>
                      </>
                    ) : note.analysis_status === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Analysis Complete</span>
                        {note.confidence_score && (
                          <span className={`text-sm ${getConfidenceColor(note.confidence_score)}`}>
                            ({Math.round(note.confidence_score * 100)}% confidence)
                          </span>
                        )}
                      </>
                    ) : note.analysis_status === 'failed' ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Analysis Failed</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => analyzeNote(note.id, note.note_text)}
                        >
                          Retry
                        </Button>
                      </>
                    ) : (
                      <>
                        <Activity className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-muted-foreground">Pending Analysis</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => analyzeNote(note.id, note.note_text)}
                        >
                          Analyze
                        </Button>
                      </>
                    )}
                  </div>

                  {/* AI Summary */}
                  {note.ai_summary && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-1" />
                        Physician Summary
                      </h4>
                      <p className="text-sm">{note.ai_summary}</p>
                    </div>
                  )}

                  {/* Symptoms Identified */}
                  {note.identified_symptoms && Array.isArray(note.identified_symptoms) && note.identified_symptoms.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Symptoms Identified:</h4>
                      <div className="flex flex-wrap gap-2">
                        {note.identified_symptoms.map((symptom: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {symptom.name} ({symptom.severity})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diabetes Insights */}
                  {note.diabetes_insights && typeof note.diabetes_insights === 'object' && note.diabetes_insights !== null && Object.keys(note.diabetes_insights).length > 0 && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Diabetes Risk Assessment
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Risk Level:</span>
                          <Badge variant={getRiskColor((note.diabetes_insights as any)?.riskLevel)}>
                            {(note.diabetes_insights as any)?.riskLevel?.toUpperCase()}
                          </Badge>
                        </div>
                        {(note.diabetes_insights as any)?.concerns && Array.isArray((note.diabetes_insights as any).concerns) && (note.diabetes_insights as any).concerns.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">Concerns:</span>
                            <ul className="text-sm list-disc list-inside ml-2">
                              {(note.diabetes_insights as any).concerns.map((concern: string, index: number) => (
                                <li key={index}>{concern}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {notes.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No notes yet. Add your first note to get started with AI analysis.
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientNotesAnalysis;