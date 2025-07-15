import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, Play, Clock, CircleCheck as CheckCircle, Star, X, Camera, Image as ImageIcon, Trash2, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface TrainingTier {
  id: string;
  name: string;
  steps: number;
  duration: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

interface UploadedImage {
  id: string;
  uri: string;
}

const TRAINING_TIERS: TrainingTier[] = [
  {
    id: 'quick',
    name: 'Quick',
    steps: 600,
    duration: '15-20 min',
    price: '$5',
    features: ['Basic quality', 'Fast processing', 'Standard features'],
  },
  {
    id: 'standard',
    name: 'Standard',
    steps: 1200,
    duration: '30-45 min',
    price: '$10',
    features: ['Good quality', 'Balanced speed', 'Enhanced features'],
    recommended: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    steps: 2000,
    duration: '60-90 min',
    price: '$20',
    features: ['High quality', 'Premium features', 'Advanced customization'],
  },
];

export default function TrainingScreen() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('standard');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const handleCameraUpload = () => {
    setShowUploadOptions(false);
    // Mock camera capture - in real app, would use expo-image-picker with camera
    const newImage: UploadedImage = {
      id: `img_${Date.now()}`,
      uri: `https://images.pexels.com/photos/${1000 + Math.floor(Math.random() * 500)}/pexels-photo-${1000 + Math.floor(Math.random() * 500)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
    };
    setUploadedImages(prev => [...prev, newImage]);
  };

  const handleGalleryUpload = () => {
    setShowUploadOptions(false);
    // Mock gallery selection - in real app, would use expo-image-picker with gallery
    const newImages: UploadedImage[] = Array.from({ length: 3 }, (_, i) => ({
      id: `img_${uploadedImages.length + i}`,
      uri: `https://images.pexels.com/photos/${1000 + i}/pexels-photo-${1000 + i}.jpeg?auto=compress&cs=tinysrgb&w=400`,
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleStartTraining = () => {
    if (uploadedImages.length < 10) {
      Alert.alert('Insufficient Images', 'Please upload at least 10 images to start training.');
      return;
    }
    
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          Alert.alert('Training Complete!', 'Your model has been successfully trained.');
          return 100;
        }
        return prev + 2;
      });
    }, 500);
  };

  const renderUploadedImage = ({ item }: { item: UploadedImage }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.uploadedImage} />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveImage(item.id)}
      >
        <X size={12} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderUploadButton = () => (
    <TouchableOpacity 
      style={styles.uploadButton} 
      onPress={() => setShowUploadOptions(true)}
    >
      <Plus size={24} color="#8B5CF6" />
      <Text style={styles.uploadButtonText}>Add Photos</Text>
    </TouchableOpacity>
  );

  const renderUploadOptions = () => {
    if (!showUploadOptions) return null;

    return (
      <View style={styles.uploadOptionsOverlay}>
        <View style={styles.uploadOptionsContainer}>
          <Text style={styles.uploadOptionsTitle}>Add Photos</Text>
          
          <TouchableOpacity 
            style={styles.uploadOption}
            onPress={handleCameraUpload}
          >
            <Camera size={24} color="#8B5CF6" />
            <Text style={styles.uploadOptionText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.uploadOption}
            onPress={handleGalleryUpload}
          >
            <ImageIcon size={24} color="#8B5CF6" />
            <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelOption}
            onPress={() => setShowUploadOptions(false)}
          >
            <Text style={styles.cancelOptionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTierCard = (tier: TrainingTier) => (
    <TouchableOpacity
      key={tier.id}
      style={[
        styles.tierCard,
        selectedTier === tier.id && styles.selectedTierCard,
      ]}
      onPress={() => setSelectedTier(tier.id)}
    >
      <LinearGradient
        colors={
          selectedTier === tier.id
            ? ['#8B5CF6', '#3B82F6']
            : ['#374151', '#1F2937']
        }
        style={styles.tierGradient}
      >
        {tier.recommended && (
          <View style={styles.recommendedBadge}>
            <Star size={12} color="#FBBF24" />
            <Text style={styles.recommendedText}>Recommended</Text>
          </View>
        )}
        <Text style={styles.tierName}>{tier.name}</Text>
        <Text style={styles.tierSteps}>{tier.steps} steps</Text>
        <Text style={styles.tierDuration}>{tier.duration}</Text>
        <Text style={styles.tierPrice}>{tier.price}</Text>
        <View style={styles.featuresContainer}>
          {tier.features.map((feature, index) => (
            <Text key={index} style={styles.featureText}>
              • {feature}
            </Text>
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#111827', '#1F2937']} style={styles.gradient}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Character Training</Text>
            <Text style={styles.subtitle}>Train your AI model with personal photos</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Photos</Text>
            <Text style={styles.sectionSubtitle}>
              Upload 10-30 high-quality photos of yourself
            </Text>
            
            <FlatList
              data={[...uploadedImages, { id: 'upload-button' }]}
              renderItem={({ item }) => 
                item.id === 'upload-button' 
                  ? renderUploadButton() 
                  : renderUploadedImage({ item: item as UploadedImage })
              }
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.uploadGrid}
              columnWrapperStyle={styles.uploadRow}
            />
            
            <Text style={styles.imageCount}>
              {uploadedImages.length}/30 images uploaded
            </Text>
            
            {uploadedImages.length > 0 && (
              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={() => {
                  Alert.alert(
                    'Clear All Photos',
                    'Are you sure you want to remove all uploaded photos?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Clear All', 
                        style: 'destructive',
                        onPress: () => setUploadedImages([])
                      },
                    ]
                  );
                }}
              >
                <Trash2 size={16} color="#EF4444" />
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training Tiers</Text>
            <View style={styles.tiersContainer}>
              {TRAINING_TIERS.map(renderTierCard)}
            </View>
          </View>

          {isTraining && (
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Training in Progress</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${trainingProgress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{trainingProgress}% Complete</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.startButton, isTraining && styles.disabledButton]}
            onPress={handleStartTraining}
            disabled={isTraining}
          >
            <LinearGradient
              colors={isTraining ? ['#6B7280', '#4B5563'] : ['#8B5CF6', '#3B82F6']}
              style={styles.buttonGradient}
            >
              {isTraining ? (
                <Clock size={20} color="#FFFFFF" />
              ) : (
                <Play size={20} color="#FFFFFF" />
              )}
              <Text style={styles.buttonText}>
                {isTraining ? 'Training...' : 'Start Training'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
        
        {renderUploadOptions()}
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  uploadGrid: {
    paddingBottom: 12,
  },
  uploadRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    width: (width - 80) / 3,
    aspectRatio: 1,
    marginHorizontal: 2,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    marginHorizontal: 2,
  },
  uploadButtonText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  imageCount: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'center',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 6,
  },
  clearAllText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadOptionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  uploadOptionsContainer: {
    backgroundColor: '#374151',
    borderRadius: 16,
    padding: 24,
    width: width - 80,
    maxWidth: 300,
  },
  uploadOptionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
  },
  uploadOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cancelOption: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelOptionText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  tiersContainer: {
    gap: 12,
  },
  tierCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedTierCard: {
    transform: [{ scale: 1.02 }],
  },
  tierGradient: {
    padding: 16,
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  recommendedText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '600',
  },
  tierName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tierSteps: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 2,
  },
  tierDuration: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  tierPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  featuresContainer: {
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  progressSection: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  progressText: {
    fontSize: 14,
    color: '#8B5CF6',
    textAlign: 'center',
    fontWeight: '600',
  },
  startButton: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});