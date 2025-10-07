import React, { useState } from 'react';
import { travelPlannerService } from '@/lib/api';
import { Loader2, Sparkles } from 'lucide-react';

interface EmotionResult {
  emotion: string;
  moodScore: number;
  confidence: number;
  aiSuggestions: string[];
  keywords: string[];
}

interface EmotionAnalyzerProps {
  title: string;
  content: string;
  onAnalyzed?: (result: EmotionResult) => void;
  className?: string;
}

// Lightweight emotion analyzer component to be embedded in story submission flow.
// Calls /travel/analyze-emotion (already implemented on backend) and surfaces
// detected emotion + AI suggestions for planning similar trips.
const EmotionAnalyzer: React.FC<EmotionAnalyzerProps> = ({ title, content, onAnalyzed, className = '' }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content || !title) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const { data, error } = await travelPlannerService.analyzeEmotion({
        storyContent: content,
        storyTitle: title,
      });
      if (error || !data) {
        setError(error || 'Failed to analyze emotion');
      } else {
        setResult(data);
        onAnalyzed?.(data);
      }
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`rounded-xl border border-white/15 bg-white/5 backdrop-blur-md p-4 text-sm text-white/90 ${className}`}>      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="h-4 w-4 text-purple-300" />
          <span>Emotion Insight</span>
        </div>
        <button
          type="button"
          disabled={isAnalyzing || !content}
          onClick={handleAnalyze}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium disabled:opacity-50 hover:from-blue-600 hover:to-purple-700 transition-colors"
        >
          {isAnalyzing ? (
            <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />Analyzing</span>
          ) : (
            'Analyze'
          )}
        </button>
      </div>
      {error && (
        <div className="text-red-300 text-xs mb-2">{error}</div>
      )}
      {result ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 rounded-md bg-white/10 text-xs uppercase tracking-wide">
              {result.emotion}
            </div>
            <div className="text-xs text-white/60">Mood Score: <span className="text-white/90 font-medium">{result.moodScore}</span></div>
            <div className="text-xs text-white/60">Confidence: <span className="text-white/90 font-medium">{Math.round(result.confidence * 100)}%</span></div>
          </div>
          {result.aiSuggestions?.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-1 text-white/70">Suggestions</div>
              <ul className="grid gap-1">
                {result.aiSuggestions.slice(0,3).map((s,i)=>(
                  <li key={i} className="text-xs text-white/70 leading-snug before:content-['•'] before:mr-1 before:text-purple-300">{s}</li>
                ))}
              </ul>
            </div>
          )}
          {result.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {result.keywords.slice(0,6).map(k => (
                <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">{k}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-white/50">Get instant mood & emotion tags for smarter trip suggestions.</p>
      )}
    </div>
  );
};

export default EmotionAnalyzer;