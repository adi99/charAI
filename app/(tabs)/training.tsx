import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Upload, Zap, Settings, X, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TrainingImage {
  id: string;
  uri: string;
}

export default function TrainingScreen() {
  const [trainingSteps, setTrainingSteps] = useState(1200);
  const [uploadedImages, setUploadedImages] = useState<TrainingImage[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  const trainingOptions = [
    { steps: 600, label: 'Fast', time: '~15 min', quality: 'Good' },
    { steps: 1200, label: 'Standard', time: '~30 min', quality: 'Better' },
    { steps: 2000, label: 'High Quality', time: '~60 min', quality: 'Best' },
  ];

  const mockImages: TrainingImage[] = Array.from({ length: 8 }, (_, i) => ({
    id: `img-${i}`,
    uri: `https://images.pexels.com/photos/${1542085 + i}/pexels-photo-${1542085 + i}.jpeg?auto=compress&cs=tinysrgb&w=400`,
  }));

  const handleImageUpload = () => {
    if (uploadedImages.length < 30) {
      const newImages = mockImages.slice(0, Math.min(8, 30 - uploadedImages.length));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const startTraining = () => {
    if (uploadedImages.length >= 10) {
      setIsTraining(true);
      // Simulate training process
      setTimeout(() => {
        setIsTraining(false);
      }, 3000);
    }
  };

  const TrainingOptionCard = ({ option }: { option: typeof trainingOptions[0] }) => (
    <TouchableOpacity
      style={[
        styles.trainingOption,
        trainingSteps === option.steps && styles.selectedTrainingOption,
      ]}
      onPress={() => setTrainingSteps(option.steps)}
    >
      <LinearGradient
        colors={
          trainingSteps === option.steps
            ? ['#8b5cf6', '#7c3aed']
            : ['#374151', '#4b5563']
        }
        style={styles.trainingOptionGradient}
      >
        <Text style={styles.trainingOptionSteps}>{option.steps}</Text>
        <Text style={styles.trainingOptionLabel}>{option.label}</Text>
        <Text style={styles.trainingOptionTime}>{option.time}</Text>
        <Text style={styles.trainingOptionQuality}>{option.quality}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const ImageItem = ({ item }: { item: TrainingImage }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.uploadedImage} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(item.id)}
      >
        <X size={16} color="#ffffff" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f172a']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Train LoRA</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training Steps</Text>
            <Text style={styles.sectionDescription}>
              Choose the training intensity for your custom LoRA model
            </Text>
            <View style={styles.trainingOptionsContainer}>
              {trainingOptions.map(option => (
                <TrainingOptionCard key={option.steps} option={option} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.uploadHeader}>
              <Text style={styles.sectionTitle}>Training Images</Text>
              <Text style={styles.imageCount}>
                {uploadedImages.length}/30 images
              </Text>
            </View>
            <Text style={styles.sectionDescription}>
              Upload 10-30 high-quality images for optimal results
            </Text>

            {uploadedImages.length === 0 ? (
              <TouchableOpacity style={styles.uploadArea} onPress={handleImageUpload}>
                <Upload size={32} color="#8b5cf6" strokeWidth={2} />
                <Text style={styles.uploadText}>Upload Training Images</Text>
                <Text style={styles.uploadSubtext}>
                  Select multiple images (JPG, PNG)
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <FlatList
                  data={uploadedImages}
                  renderItem={ImageItem}
                  keyExtractor={item => item.id}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={styles.imagesGrid}
                  ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                />
                
                {uploadedImages.length < 30 && (
                  <TouchableOpacity
                    style={styles.addMoreButton}
                    onPress={handleImageUpload}
                  >
                    <Plus size={20} color="#8b5cf6" strokeWidth={2} />
                    <Text style={styles.addMoreText}>Add More Images</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Configuration</Text>
            <View style={styles.configGrid}>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Base Model</Text>
                <Text style={styles.configValue}>SDXL</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Learning Rate</Text>
                <Text style={styles.configValue}>1e-4</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Rank</Text>
                <Text style={styles.configValue}>32</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Alpha</Text>
                <Text style={styles.configValue}>16</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.trainButton,
              (uploadedImages.length < 10 || isTraining) && styles.trainButtonDisabled,
            ]}
            onPress={startTraining}
            disabled={uploadedImages.length < 10 || isTraining}
          >
            <LinearGradient
              colors={
                uploadedImages.length >= 10 && !isTraining
                  ? ['#8b5cf6', '#7c3aed']
                  : ['#6b7280', '#4b5563']
              }
              style={styles.trainButtonGradient}
            >
              <Zap size={24} color="#ffffff" strokeWidth={2} />
              <Text style={styles.trainButtonText}>
                {isTraining
                  ? 'Training in Progress...'
                  : uploadedImages.length < 10
                  ? `Upload ${10 - uploadedImages.length} More Images`
                  : 'Start Training'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {isTraining && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Training Progress</Text>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  style={[styles.progressFill, { width: '45%' }]}
                />
              </View>
              <Text style={styles.progressSubtext}>
                Step 540 / {trainingSteps} - ETA: 15 minutes
              </Text>
            </View>
          )}
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
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 15,
    lineHeight: 20,
  },
  trainingOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trainingOption: {
    flex: 1,
    marginHorizontal: 5,
  },
  selectedTrainingOption: {},
  trainingOptionGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  trainingOptionSteps: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 5,
  },
  trainingOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  trainingOptionTime: {
    fontSize: 12,
    color: '#d1d5db',
    marginBottom: 2,
  },
  trainingOptionQuality: {
    fontSize: 12,
    color: '#d1d5db',
  },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  imageCount: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  uploadArea: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
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
  imagesGrid: {
    gap: 10,
  },
  imageContainer: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 3,
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
  },
  addMoreText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  configGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  configItem: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 10,
  },
  configLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
  },
  configValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  trainButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  trainButtonDisabled: {
    opacity: 0.6,
  },
  trainButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
  },
  trainButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  progressContainer: {
    backgroundColor: '#374151',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4b5563',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});