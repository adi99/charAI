import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, FileSliders as Sliders, Crop, Layers, Wand as Wand2, Save, Undo2, Redo2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface EditingTool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  active: boolean;
}

interface OutfitPreset {
  id: string;
  name: string;
  image: string;
  category: string;
}

const EDITING_TOOLS: EditingTool[] = [
  { id: 'outfit', name: 'Outfit', icon: Palette, active: true },
  { id: 'features', name: 'Features', icon: Sliders, active: false },
  { id: 'crop', name: 'Crop', icon: Crop, active: false },
  { id: 'mask', name: 'Mask', icon: Layers, active: false },
  { id: 'prompt', name: 'Prompt', icon: Wand2, active: false },
];

const OUTFIT_PRESETS: OutfitPreset[] = [
  {
    id: '1',
    name: 'Casual',
    image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Everyday',
  },
  {
    id: '2',
    name: 'Formal',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Business',
  },
  {
    id: '3',
    name: 'Summer',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Seasonal',
  },
  {
    id: '4',
    name: 'Athletic',
    image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports',
  },
];

export default function EditingScreen() {
  const [selectedTool, setSelectedTool] = useState('outfit');
  const [selectedImage, setSelectedImage] = useState(
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800'
  );
  const [promptText, setPromptText] = useState('');
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);

  const renderToolbar = () => (
    <View style={styles.toolbar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.toolsContainer}>
          {EDITING_TOOLS.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <TouchableOpacity
                key={tool.id}
                style={[
                  styles.toolButton,
                  selectedTool === tool.id && styles.activeToolButton,
                ]}
                onPress={() => setSelectedTool(tool.id)}
              >
                <IconComponent
                  size={20}
                  color={selectedTool === tool.id ? '#8B5CF6' : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.toolButtonText,
                    selectedTool === tool.id && styles.activeToolButtonText,
                  ]}
                >
                  {tool.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  const renderOutfitEditor = () => (
    <View style={styles.editorSection}>
      <Text style={styles.sectionTitle}>Outfit Customization</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.outfitGrid}>
          {OUTFIT_PRESETS.map((outfit) => (
            <TouchableOpacity
              key={outfit.id}
              style={[
                styles.outfitCard,
                selectedOutfit === outfit.id && styles.selectedOutfitCard,
              ]}
              onPress={() => setSelectedOutfit(outfit.id)}
            >
              <Image source={{ uri: outfit.image }} style={styles.outfitImage} />
              <Text style={styles.outfitName}>{outfit.name}</Text>
              <Text style={styles.outfitCategory}>{outfit.category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderFeatureEditor = () => (
    <View style={styles.editorSection}>
      <Text style={styles.sectionTitle}>Facial Features</Text>
      <View style={styles.slidersContainer}>
        {['Eye Size', 'Nose Shape', 'Lip Fullness', 'Jawline'].map((feature) => (
          <View key={feature} style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>{feature}</Text>
            <View style={styles.sliderTrack}>
              <View style={styles.sliderThumb} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPromptEditor = () => (
    <View style={styles.editorSection}>
      <Text style={styles.sectionTitle}>AI Prompt Editing</Text>
      <TextInput
        style={styles.promptInput}
        placeholder="Describe the changes you want..."
        placeholderTextColor="#9CA3AF"
        multiline
        value={promptText}
        onChangeText={setPromptText}
      />
      <TouchableOpacity style={styles.enhanceButton}>
        <LinearGradient
          colors={['#8B5CF6', '#3B82F6']}
          style={styles.enhanceGradient}
        >
          <Wand2 size={16} color="#FFFFFF" />
          <Text style={styles.enhanceButtonText}>Apply Changes</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderEditor = () => {
    switch (selectedTool) {
      case 'outfit':
        return renderOutfitEditor();
      case 'features':
        return renderFeatureEditor();
      case 'prompt':
        return renderPromptEditor();
      default:
        return (
          <View style={styles.editorSection}>
            <Text style={styles.sectionTitle}>Coming Soon</Text>
            <Text style={styles.comingSoonText}>
              This editing tool is under development.
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#111827', '#1F2937']} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>Image Editor</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Undo2 size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Redo2 size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton}>
              <Save size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {renderToolbar()}

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.editingImage} />
            <View style={styles.imageOverlay}>
              <TouchableOpacity style={styles.previewButton}>
                <Text style={styles.previewButtonText}>Live Preview</Text>
              </TouchableOpacity>
            </View>
          </View>

          {renderEditor()}
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
  },
  toolbar: {
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 12,
  },
  toolsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  toolButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeToolButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  toolButtonText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  activeToolButtonText: {
    color: '#8B5CF6',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  editingImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  previewButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  editorSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  outfitGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  outfitCard: {
    width: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  selectedOutfitCard: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  outfitImage: {
    width: '100%',
    height: 100,
  },
  outfitName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    padding: 8,
    paddingBottom: 4,
  },
  outfitCategory: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  slidersContainer: {
    gap: 20,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    width: 100,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    marginLeft: 16,
    position: 'relative',
  },
  sliderThumb: {
    position: 'absolute',
    left: '50%',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
  },
  promptInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  enhanceButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  enhanceGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  enhanceButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 40,
  },
});