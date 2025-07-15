import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  Settings,
  Image as ImageIcon,
  Download,
  Share,
  Zap,
  Clock,
  Star,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AIModel {
  id: string;
  name: string;
  description: string;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'basic' | 'standard' | 'high';
}

interface OutputSize {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'square' | 'portrait' | 'landscape';
}

interface QualitySetting {
  id: string;
  name: string;
  description: string;
  speed: string;
  icon: React.ComponentType<any>;
}

const AI_MODELS: AIModel[] = [
  {
    id: 'sdxl',
    name: 'SDXL',
    description: 'Stable Diffusion XL - High quality, versatile',
    speed: 'medium',
    quality: 'high',
  },
  {
    id: 'flux',
    name: 'FLUX',
    description: 'Latest model - Best quality, photorealistic',
    speed: 'slow',
    quality: 'high',
  },
  {
    id: 'turbo',
    name: 'Turbo',
    description: 'Fast generation - Good for previews',
    speed: 'fast',
    quality: 'standard',
  },
];

const OUTPUT_SIZES: OutputSize[] = [
  { id: 'sq_512', name: '512×512', width: 512, height: 512, category: 'square' },
  { id: 'sq_1024', name: '1024×1024', width: 1024, height: 1024, category: 'square' },
  { id: 'pt_512', name: '512×768', width: 512, height: 768, category: 'portrait' },
  { id: 'pt_1024', name: '1024×1536', width: 1024, height: 1536, category: 'portrait' },
  { id: 'ls_768', name: '768×512', width: 768, height: 512, category: 'landscape' },
  { id: 'ls_1536', name: '1536×1024', width: 1536, height: 1024, category: 'landscape' },
];

const QUALITY_SETTINGS: QualitySetting[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Fast generation',
    speed: '10-15s',
    icon: Zap,
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Balanced quality',
    speed: '20-30s',
    icon: Clock,
  },
  {
    id: 'high',
    name: 'High',
    description: 'Maximum quality',
    speed: '45-60s',
    icon: Star,
  },
];

export default function GeneratorScreen() {
  const [selectedModel, setSelectedModel] = useState('sdxl');
  const [selectedSize, setSelectedSize] = useState('sq_1024');
  const [selectedQuality, setSelectedQuality] = useState('standard');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [enhancePrompt, setEnhancePrompt] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate generation time based on quality
    const delays = { basic: 2000, standard: 3000, high: 4000 };
    
    setTimeout(() => {
      // Mock generated image
      setGeneratedImage(
        `https://images.pexels.com/photos/${1500 + Math.floor(Math.random() * 500)}/pexels-photo-${1500 + Math.floor(Math.random() * 500)}.jpeg?auto=compress&cs=tinysrgb&w=800`
      );
      setIsGenerating(false);
    }, delays[selectedQuality as keyof typeof delays]);
  };

  const renderModelSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AI Model</Text>
      <View style={styles.modelsContainer}>
        {AI_MODELS.map((model) => (
          <TouchableOpacity
            key={model.id}
            style={[
              styles.modelCard,
              selectedModel === model.id && styles.selectedModelCard,
            ]}
            onPress={() => setSelectedModel(model.id)}
          >
            <Text style={styles.modelName}>{model.name}</Text>
            <Text style={styles.modelDescription}>{model.description}</Text>
            <View style={styles.modelBadges}>
              <View style={[styles.badge, styles[`${model.speed}Badge`]]}>
                <Text style={styles.badgeText}>{model.speed}</Text>
              </View>
              <View style={[styles.badge, styles.qualityBadge]}>
                <Text style={styles.badgeText}>{model.quality}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSizeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Output Size</Text>
      <View style={styles.sizesGrid}>
        {OUTPUT_SIZES.map((size) => (
          <TouchableOpacity
            key={size.id}
            style={[
              styles.sizeCard,
              selectedSize === size.id && styles.selectedSizeCard,
            ]}
            onPress={() => setSelectedSize(size.id)}
          >
            <Text style={styles.sizeName}>{size.name}</Text>
            <Text style={styles.sizeCategory}>{size.category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderQualitySelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quality</Text>
      <View style={styles.qualityContainer}>
        {QUALITY_SETTINGS.map((quality) => {
          const IconComponent = quality.icon;
          return (
            <TouchableOpacity
              key={quality.id}
              style={[
                styles.qualityCard,
                selectedQuality === quality.id && styles.selectedQualityCard,
              ]}
              onPress={() => setSelectedQuality(quality.id)}
            >
              <IconComponent
                size={24}
                color={selectedQuality === quality.id ? '#8B5CF6' : '#9CA3AF'}
              />
              <Text style={styles.qualityName}>{quality.name}</Text>
              <Text style={styles.qualityDescription}>{quality.description}</Text>
              <Text style={styles.qualitySpeed}>{quality.speed}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#111827', '#1F2937']} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Generator</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.promptSection}>
            <Text style={styles.sectionTitle}>Prompt</Text>
            <TextInput
              style={styles.promptInput}
              placeholder="Describe what you want to generate..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={prompt}
              onChangeText={setPrompt}
            />
            
            <View style={styles.promptOptions}>
              <TouchableOpacity
                style={[styles.toggleButton, enhancePrompt && styles.activeToggle]}
                onPress={() => setEnhancePrompt(!enhancePrompt)}
              >
                <Sparkles size={16} color={enhancePrompt ? '#8B5CF6' : '#9CA3AF'} />
                <Text style={[styles.toggleText, enhancePrompt && styles.activeToggleText]}>
                  Enhance Prompt
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.negativePromptInput}
              placeholder="Negative prompt (optional)..."
              placeholderTextColor="#9CA3AF"
              value={negativePrompt}
              onChangeText={setNegativePrompt}
            />
          </View>

          {renderModelSelector()}
          {renderSizeSelector()}
          {renderQualitySelector()}

          {generatedImage && (
            <View style={styles.resultSection}>
              <Text style={styles.sectionTitle}>Generated Image</Text>
              <View style={styles.imageContainer}>
                <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
                <View style={styles.imageActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Download size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.disabledButton]}
            onPress={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            <LinearGradient
              colors={
                isGenerating || !prompt.trim()
                  ? ['#6B7280', '#4B5563']
                  : ['#8B5CF6', '#EC4899']
              }
              style={styles.generateGradient}
            >
              <Sparkles size={20} color="#FFFFFF" />
              <Text style={styles.generateText}>
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  promptSection: {
    padding: 20,
  },
  promptInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  promptOptions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    gap: 6,
  },
  activeToggle: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  toggleText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#8B5CF6',
  },
  negativePromptInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modelsContainer: {
    gap: 12,
  },
  modelCard: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedModelCard: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  modelBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fastBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  mediumBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
  },
  slowBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  qualityBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  badgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  sizesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeCard: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    minWidth: (width - 56) / 3,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSizeCard: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  sizeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sizeCategory: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  qualityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  qualityCard: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedQualityCard: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  qualityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  qualityDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    textAlign: 'center',
  },
  qualitySpeed: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  resultSection: {
    padding: 20,
    paddingTop: 0,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  generatedImage: {
    width: '100%',
    height: 300,
  },
  imageActions: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  generateButton: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.7,
  },
  generateGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  generateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});