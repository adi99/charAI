import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Image as ImageIcon, Type, Zap, Settings, Upload } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type VideoMode = 'text-to-video' | 'image-to-video' | 'frame-interpolation';

export default function VideoScreen() {
  const [selectedMode, setSelectedMode] = useState<VideoMode>('text-to-video');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('Runway Gen-3');

  const videoModes = [
    {
      id: 'text-to-video' as VideoMode,
      title: 'Text to Video',
      description: 'Generate video from text prompt',
      icon: Type,
    },
    {
      id: 'image-to-video' as VideoMode,
      title: 'Image to Video',
      description: 'Animate existing images',
      icon: ImageIcon,
    },
    {
      id: 'frame-interpolation' as VideoMode,
      title: 'Frame Interpolation',
      description: 'Create video between two frames',
      icon: Zap,
    },
  ];

  const models = ['Runway Gen-3', 'Pika Labs', 'Stable Video', 'AnimateDiff'];

  const ModeCard = ({ mode }: { mode: typeof videoModes[0] }) => (
    <TouchableOpacity
      style={[
        styles.modeCard,
        selectedMode === mode.id && styles.selectedModeCard,
      ]}
      onPress={() => setSelectedMode(mode.id)}
    >
      <LinearGradient
        colors={
          selectedMode === mode.id
            ? ['#8b5cf6', '#7c3aed']
            : ['#374151', '#4b5563']
        }
        style={styles.modeCardGradient}
      >
        <mode.icon
          size={32}
          color="#ffffff"
          strokeWidth={2}
        />
        <Text style={styles.modeTitle}>{mode.title}</Text>
        <Text style={styles.modeDescription}>{mode.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f172a']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Video</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Creation Mode</Text>
            <View style={styles.modesContainer}>
              {videoModes.map(mode => (
                <ModeCard key={mode.id} mode={mode} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Model</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modelsScroll}>
              {models.map(model => (
                <TouchableOpacity
                  key={model}
                  style={[
                    styles.modelChip,
                    selectedModel === model && styles.selectedModelChip,
                  ]}
                  onPress={() => setSelectedModel(model)}
                >
                  <Text
                    style={[
                      styles.modelChipText,
                      selectedModel === model && styles.selectedModelChipText,
                    ]}
                  >
                    {model}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {selectedMode === 'text-to-video' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prompt</Text>
              <TextInput
                style={styles.promptInput}
                placeholder="Describe the video you want to generate..."
                placeholderTextColor="#9ca3af"
                multiline
                value={prompt}
                onChangeText={setPrompt}
              />
            </View>
          )}

          {selectedMode === 'image-to-video' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Source Image</Text>
              <TouchableOpacity style={styles.uploadArea}>
                <Upload size={32} color="#8b5cf6" strokeWidth={2} />
                <Text style={styles.uploadText}>Tap to upload image</Text>
                <Text style={styles.uploadSubtext}>JPG, PNG up to 10MB</Text>
              </TouchableOpacity>
              
              <TextInput
                style={styles.promptInput}
                placeholder="Describe how you want the image to animate..."
                placeholderTextColor="#9ca3af"
                multiline
                value={prompt}
                onChangeText={setPrompt}
              />
            </View>
          )}

          {selectedMode === 'frame-interpolation' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Frame Selection</Text>
              <View style={styles.frameContainer}>
                <TouchableOpacity style={styles.frameUpload}>
                  <Upload size={24} color="#8b5cf6" strokeWidth={2} />
                  <Text style={styles.frameText}>First Frame</Text>
                </TouchableOpacity>
                <View style={styles.frameDivider}>
                  <Text style={styles.frameDividerText}>→</Text>
                </View>
                <TouchableOpacity style={styles.frameUpload}>
                  <Upload size={24} color="#8b5cf6" strokeWidth={2} />
                  <Text style={styles.frameText}>Last Frame</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video Settings</Text>
            <View style={styles.settingsGrid}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Duration</Text>
                <Text style={styles.settingValue}>4 seconds</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Resolution</Text>
                <Text style={styles.settingValue}>720p</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Style</Text>
                <Text style={styles.settingValue}>Cinematic</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>FPS</Text>
                <Text style={styles.settingValue}>24</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.generateButton}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.generateButtonGradient}
            >
              <Play size={24} color="#ffffff" strokeWidth={2} />
              <Text style={styles.generateButtonText}>Generate Video</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  modesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modeCard: {
    width: '48%',
    marginBottom: 15,
  },
  selectedModeCard: {},
  modeCardGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  modeDescription: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 16,
  },
  modelsScroll: {
    marginTop: 10,
  },
  modelChip: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedModelChip: {
    backgroundColor: '#8b5cf6',
  },
  modelChipText: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedModelChipText: {
    color: '#ffffff',
  },
  promptInput: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  uploadArea: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4b5563',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  uploadSubtext: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 5,
  },
  frameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frameUpload: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    flex: 1,
    borderWidth: 2,
    borderColor: '#4b5563',
    borderStyle: 'dashed',
  },
  frameText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  frameDivider: {
    paddingHorizontal: 20,
  },
  frameDividerText: {
    color: '#8b5cf6',
    fontSize: 24,
    fontWeight: '600',
  },
  settingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  settingItem: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 10,
  },
  settingLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
  },
  settingValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  generateButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
});