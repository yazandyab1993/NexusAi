import React, { useState } from 'react';
import { AIModel, ModelType, User, GeneratedAsset } from '../types';
import { api } from '../services/mockApi';
import { Sparkles, Image as ImageIcon, Video as VideoIcon, Loader2, PlayCircle } from 'lucide-react';

interface GeneratorProps {
  user: User;
  models: AIModel[];
  onAssetGenerated: (asset: GeneratedAsset) => void;
  onUpdateUser: (user: User) => void;
}

const Generator: React.FC<GeneratorProps> = ({ user, models, onAssetGenerated, onUpdateUser }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || '');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<GeneratedAsset | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedModel = models.find(m => m.id === selectedModelId);

  const handleGenerate = async () => {
    if (!selectedModel || !prompt.trim()) return;
    
    setError(null);
    setIsGenerating(true);
    setLastResult(null);

    try {
      const result = await api.generateContent(user.id, selectedModelId, prompt);
      
      // Update local state
      onAssetGenerated(result);
      setLastResult(result);
      
      // Refresh user to update credits
      const updatedUser = await api.getUser(user.id);
      if (updatedUser) onUpdateUser(updatedUser);

    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Configuration Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Studio</h2>
          <p className="text-slate-400 text-sm">Create stunning videos using our premium models.</p>
        </div>

        {/* Model Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-300">Select Model</label>
          <div className="grid grid-cols-1 gap-3">
            {models.map(model => (
              <button
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={`flex items-start p-3 rounded-xl border transition-all text-left ${
                  selectedModelId === model.id
                    ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg mr-3 ${selectedModelId === model.id ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                  {model.type === ModelType.TEXT_TO_VIDEO ? <VideoIcon size={20} /> : <ImageIcon size={20} />}
                </div>
                <div>
                  <h4 className={`font-semibold text-sm ${selectedModelId === model.id ? 'text-blue-400' : 'text-slate-200'}`}>
                    {model.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{model.description}</p>
                  <div className="mt-2 text-xs font-mono text-slate-400 bg-slate-900/50 inline-block px-2 py-1 rounded">
                    Cost: {model.costPerGeneration} Credits
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-300">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vision... e.g., 'A cyberpunk city with neon lights under heavy rain'"
            className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                    {error}
                </div>
            )}
            
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || (selectedModel ? user.credits < selectedModel.costPerGeneration : true)}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
              isGenerating || (selectedModel && user.credits < selectedModel.costPerGeneration)
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-900/30'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Generating Magic...</span>
              </>
            ) : (
              <>
                <Sparkles />
                <span>Generate ({selectedModel?.costPerGeneration || 0} credits)</span>
              </>
            )}
          </button>
          {selectedModel && user.credits < selectedModel.costPerGeneration && (
             <p className="text-center text-xs text-red-400 mt-2">Insufficient credits. Please recharge.</p>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-8 relative overflow-hidden min-h-[500px]">
        {isGenerating ? (
          <div className="text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
               <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-medium text-white">Synthesizing Pixels...</h3>
            <p className="text-slate-400 max-w-sm mx-auto">This usually takes about 10-30 seconds depending on the model complexity.</p>
          </div>
        ) : lastResult ? (
          <div className="w-full h-full flex flex-col">
             <div className="flex-1 relative group rounded-xl overflow-hidden bg-black shadow-2xl">
                <img src={lastResult.resultUrl} className="w-full h-full object-cover opacity-80" alt="Generated Result" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle size={64} className="text-white opacity-80" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <p className="text-white font-medium truncate">{lastResult.prompt}</p>
                </div>
             </div>
             <div className="mt-4 flex justify-end space-x-3">
                 <button className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg text-sm hover:bg-slate-700">Download</button>
                 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500">Share</button>
             </div>
          </div>
        ) : (
          <div className="text-center opacity-40">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">Ready to Create</h3>
            <p className="text-slate-500 mt-2">Select a model and type a prompt to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
