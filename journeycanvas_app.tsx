import React, { useState, useEffect, useRef } from 'react';
import { Palette, Calendar, Sparkles, Trash2, Download, Play, Pause, RotateCcw } from 'lucide-react';

const JourneyCanvas = () => {
  const canvasRef = useRef(null);
  const timelineCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FF6B9D');
  const [brushSize, setBrushSize] = useState(15);
  const [moods, setMoods] = useState([]);
  const [view, setView] = useState('create');
  const [selectedMood, setSelectedMood] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationRef = useRef(null);

  const moodPalette = [
    { name: 'Joy', color: '#FFD93D', gradient: 'from-yellow-400 to-orange-300' },
    { name: 'Calm', color: '#6BCB77', gradient: 'from-green-400 to-teal-300' },
    { name: 'Peaceful', color: '#4D96FF', gradient: 'from-blue-400 to-indigo-300' },
    { name: 'Love', color: '#FF6B9D', gradient: 'from-pink-400 to-rose-300' },
    { name: 'Energy', color: '#FF5722', gradient: 'from-red-400 to-orange-400' },
    { name: 'Mystery', color: '#9C27B0', gradient: 'from-purple-500 to-pink-400' },
    { name: 'Melancholy', color: '#607D8B', gradient: 'from-gray-500 to-blue-400' },
    { name: 'Hope', color: '#00BCD4', gradient: 'from-cyan-400 to-blue-300' },
  ];

  useEffect(() => {
    loadMoods();
    initCanvas();
  }, []);

  useEffect(() => {
    if (view === 'journey' && moods.length > 0) {
      renderTimeline();
    }
  }, [view, moods]);

  const loadMoods = async () => {
    try {
      const result = await window.storage.list('mood:');
      if (result && result.keys) {
        const loadedMoods = await Promise.all(
          result.keys.map(async (key) => {
            try {
              const data = await window.storage.get(key);
              return data ? JSON.parse(data.value) : null;
            } catch {
              return null;
            }
          })
        );
        setMoods(loadedMoods.filter(m => m).sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.log('Starting fresh - no moods yet');
      setMoods([]);
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    let x, y;
    if (e.type.includes('touch')) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    ctx.globalAlpha = 0.8;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
    gradient.addColorStop(0, currentColor);
    gradient.addColorStop(1, currentColor + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - brushSize, y - brushSize, brushSize * 2, brushSize * 2);
  };

  const clearCanvas = () => {
    initCanvas();
  };

  const saveMood = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    
    const dominantColors = extractDominantColors(canvas);
    
    const mood = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      date: new Date().toISOString(),
      imageData: dataUrl,
      colors: dominantColors,
      brushSize: brushSize
    };

    try {
      await window.storage.set(`mood:${mood.id}`, JSON.stringify(mood));
      setMoods([mood, ...moods]);
      clearCanvas();
      setView('gallery');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save mood. Please try again.');
    }
  };

  const extractDominantColors = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const colorMap = {};
    
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      if (a < 128) continue;
      
      const color = `rgb(${r},${g},${b})`;
      colorMap[color] = (colorMap[color] || 0) + 1;
    }
    
    return Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => color);
  };

  const deleteMood = async (id) => {
    try {
      await window.storage.delete(`mood:${id}`);
      setMoods(moods.filter(m => m.id !== id));
      if (selectedMood?.id === id) {
        setSelectedMood(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const downloadMood = (mood) => {
    const link = document.createElement('a');
    link.download = `mood-${new Date(mood.timestamp).toLocaleDateString()}.png`;
    link.href = mood.imageData;
    link.click();
  };

  const renderTimeline = () => {
    const canvas = timelineCanvasRef.current;
    if (!canvas || moods.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const sortedMoods = [...moods].reverse();
    const segmentWidth = canvas.width / sortedMoods.length;
    
    sortedMoods.forEach((mood, index) => {
      if (mood.colors && mood.colors.length > 0) {
        const gradient = ctx.createLinearGradient(
          index * segmentWidth,
          0,
          (index + 1) * segmentWidth,
          canvas.height
        );
        
        mood.colors.forEach((color, i) => {
          gradient.addColorStop(i / mood.colors.length, color);
        });
        
        ctx.fillStyle = gradient;
        ctx.fillRect(index * segmentWidth, 0, segmentWidth, canvas.height);
      }
    });
  };

  const startAnimation = () => {
    if (moods.length === 0) return;
    setIsAnimating(true);
    setAnimationFrame(0);
    animateTimeline(0);
  };

  const animateTimeline = (frame) => {
    if (frame >= moods.length) {
      setIsAnimating(false);
      return;
    }
    
    setAnimationFrame(frame);
    animationRef.current = setTimeout(() => {
      animateTimeline(frame + 1);
    }, 1000);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const resetAnimation = () => {
    stopAnimation();
    setAnimationFrame(0);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const getMoodStats = () => {
    if (moods.length === 0) return [];
    
    const colorFrequency = {};
    moods.forEach(mood => {
      mood.colors?.forEach(color => {
        colorFrequency[color] = (colorFrequency[color] || 0) + 1;
      });
    });
    
    return Object.entries(colorFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-3">
            JourneyCanvas
          </h1>
          <p className="text-gray-600 text-lg">Paint your emotions, visualize your journey</p>
        </header>

        <nav className="flex gap-2 mb-8 bg-white/80 backdrop-blur rounded-xl p-2 shadow-lg">
          <button
            onClick={() => setView('create')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
              view === 'create' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Palette className="w-5 h-5 inline mr-2" />
            Create
          </button>
          <button
            onClick={() => setView('gallery')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
              view === 'gallery' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Gallery ({moods.length})
          </button>
          <button
            onClick={() => setView('journey')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
              view === 'journey' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Journey
          </button>
        </nav>

        {view === 'create' && (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Express Your Mood</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Choose a mood color:</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {moodPalette.map((mood) => (
                    <button
                      key={mood.color}
                      onClick={() => setCurrentColor(mood.color)}
                      className={`relative group aspect-square rounded-xl transition-all hover:scale-110 ${
                        currentColor === mood.color ? 'ring-4 ring-purple-500 scale-110' : ''
                      }`}
                      style={{ backgroundColor: mood.color }}
                      title={mood.name}
                    >
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {mood.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 block mb-2">
                  Brush Size: {brushSize}px
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="relative rounded-xl overflow-hidden shadow-inner bg-gradient-to-br from-gray-100 to-gray-200">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                  className="w-full cursor-crosshair touch-none"
                  style={{ height: '400px' }}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={clearCanvas}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Clear
                </button>
                <button
                  onClick={saveMood}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Save Mood
                </button>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Expressing</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Let your emotions guide your brush strokes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold">•</span>
                  <span>Mix colors to represent complex feelings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>There's no right or wrong - just express yourself</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {view === 'gallery' && (
          <div>
            {moods.length === 0 ? (
              <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-12 text-center">
                <Palette className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">No Mood Art Yet</h3>
                <p className="text-gray-500 mb-6">Start creating to build your emotional journey</p>
                <button
                  onClick={() => setView('create')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Create Your First Mood
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {moods.map((mood) => (
                  <div key={mood.id} className="bg-white/90 backdrop-blur rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group">
                    <div className="relative aspect-square">
                      <img
                        src={mood.imageData}
                        alt="Mood art"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                        <div className="p-4 flex gap-2 w-full">
                          <button
                            onClick={() => downloadMood(mood)}
                            className="flex-1 bg-white/90 text-gray-800 py-2 px-3 rounded-lg hover:bg-white transition-colors text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => deleteMood(mood.id)}
                            className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(mood.timestamp).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <div className="flex gap-1">
                        {mood.colors?.slice(0, 5).map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'journey' && (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Emotional Timeline</h2>
                <div className="flex gap-2">
                  {!isAnimating ? (
                    <button
                      onClick={startAnimation}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Animate
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={stopAnimation}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                      >
                        <Pause className="w-4 h-4" />
                        Stop
                      </button>
                      <button
                        onClick={resetAnimation}
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {moods.length > 0 ? (
                <>
                  <div className="rounded-xl overflow-hidden shadow-inner mb-4">
                    <canvas
                      ref={timelineCanvasRef}
                      className="w-full"
                      style={{ height: '150px' }}
                    />
                  </div>
                  
                  {isAnimating && (
                    <div className="text-center text-gray-600">
                      Day {animationFrame + 1} of {moods.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Create mood art to see your journey timeline</p>
                </div>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Color Insights</h2>
              {getMoodStats().length > 0 ? (
                <div className="space-y-3">
                  {getMoodStats().map(([color, count], i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg shadow-md flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Color {i + 1}</span>
                          <span className="text-sm text-gray-500">{count} occurrences</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(count / moods.length) * 100}%`,
                              background: `linear-gradient(to right, ${color}, ${color}dd)`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No data yet - start creating!</p>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Journey Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{moods.length}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Moods</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {moods.length > 0 ? Math.ceil((Date.now() - moods[moods.length - 1].timestamp) / (1000 * 60 * 60 * 24)) : 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Days Tracked</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {getMoodStats().length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Unique Colors</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">
                    {moods.length > 0 ? Math.round(moods.reduce((sum, m) => sum + (m.colors?.length || 0), 0) / moods.length) : 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Avg Colors</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyCanvas;