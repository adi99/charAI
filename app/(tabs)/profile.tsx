import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Camera, CreditCard as Edit3, Crown, Clock, Image as ImageIcon, Download, Share, Trash2, Bell, Shield, CircleHelp as HelpCircle, LogOut, Star, Zap, Calendar } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  subscription: 'free' | 'pro' | 'premium';
  creditsRemaining: number;
  totalGenerations: number;
  modelsTrained: number;
}

interface TrainingHistory {
  id: string;
  modelName: string;
  status: 'completed' | 'training' | 'failed';
  createdAt: string;
  tier: 'quick' | 'standard' | 'professional';
  progress: number;
}

interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  model: string;
  createdAt: string;
  liked: boolean;
}

const MOCK_USER: UserProfile = {
  id: 'user_123',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
  joinDate: '2024-01-15',
  subscription: 'pro',
  creditsRemaining: 150,
  totalGenerations: 342,
  modelsTrained: 3,
};

const MOCK_TRAINING_HISTORY: TrainingHistory[] = [
  {
    id: 'train_1',
    modelName: 'Professional Headshots',
    status: 'completed',
    createdAt: '2024-01-20',
    tier: 'professional',
    progress: 100,
  },
  {
    id: 'train_2',
    modelName: 'Casual Style',
    status: 'completed',
    createdAt: '2024-01-18',
    tier: 'standard',
    progress: 100,
  },
  {
    id: 'train_3',
    modelName: 'Artistic Portrait',
    status: 'training',
    createdAt: '2024-01-22',
    tier: 'quick',
    progress: 65,
  },
];

const MOCK_GENERATED_IMAGES: GeneratedImage[] = [
  {
    id: 'gen_1',
    imageUrl: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    prompt: 'Professional business portrait',
    model: 'SDXL',
    createdAt: '2024-01-22',
    liked: true,
  },
  {
    id: 'gen_2',
    imageUrl: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    prompt: 'Artistic fantasy style',
    model: 'FLUX',
    createdAt: '2024-01-21',
    liked: false,
  },
  {
    id: 'gen_3',
    imageUrl: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400',
    prompt: 'Cyberpunk aesthetic',
    model: 'SDXL',
    createdAt: '2024-01-20',
    liked: true,
  },
  {
    id: 'gen_4',
    imageUrl: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400',
    prompt: 'Vintage photography style',
    model: 'Turbo',
    createdAt: '2024-01-19',
    liked: false,
  },
];

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile>(MOCK_USER);
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory[]>(MOCK_TRAINING_HISTORY);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(MOCK_GENERATED_IMAGES);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'gallery' | 'settings'>('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(profileData.name);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Update user data when auth user changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        email: user.email || prev.email,
        name: user.user_metadata?.username || prev.name,
      }));
    }
  }, [user]);

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'premium':
        return '#FBBF24';
      case 'pro':
        return '#8B5CF6';
      default:
        return '#9CA3AF';
    }
  };

  const getSubscriptionIcon = (subscription: string) => {
    switch (subscription) {
      case 'premium':
        return Crown;
      case 'pro':
        return Star;
      default:
        return User;
    }
  };

  const handleSaveProfile = () => {
    setProfileData(prev => ({ ...prev, name: editedName }));
    setEditingProfile(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleDeleteImage = (imageId: string) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setGeneratedImages(prev => prev.filter(img => img.id !== imageId));
          },
        },
      ]
    );
  };

  const toggleImageLike = (imageId: string) => {
    setGeneratedImages(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, liked: !img.liked } : img
      )
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const renderTabButton = (
    tab: 'overview' | 'history' | 'gallery' | 'settings',
    title: string,
    icon: React.ComponentType<any>
  ) => {
    const IconComponent = icon;
    return (
      <TouchableOpacity
        style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
        onPress={() => setActiveTab(tab)}
      >
        <IconComponent
          size={16}
          color={activeTab === tab ? '#8B5CF6' : '#9CA3AF'}
        />
        <Text
          style={[
            styles.tabButtonText,
            activeTab === tab && styles.activeTabButtonText,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOverview = () => {
    const SubscriptionIcon = getSubscriptionIcon(profileData.subscription);
    
    return (
      <View style={styles.tabContent}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Zap size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>{profileData.creditsRemaining}</Text>
            <Text style={styles.statLabel}>Credits Left</Text>
          </View>
          <View style={styles.statCard}>
            <ImageIcon size={24} color="#3B82F6" />
            <Text style={styles.statNumber}>{profileData.totalGenerations}</Text>
            <Text style={styles.statLabel}>Generated</Text>
          </View>
          <View style={styles.statCard}>
            <User size={24} color="#EC4899" />
            <Text style={styles.statNumber}>{profileData.modelsTrained}</Text>
            <Text style={styles.statLabel}>Models Trained</Text>
          </View>
        </View>

        <View style={styles.subscriptionCard}>
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.1)', 'rgba(59, 130, 246, 0.1)']}
            style={styles.subscriptionGradient}
          >
            <View style={styles.subscriptionHeader}>
              <SubscriptionIcon size={20} color={getSubscriptionColor(profileData.subscription)} />
              <Text style={[styles.subscriptionTitle, { color: getSubscriptionColor(profileData.subscription) }]}>
                {profileData.subscription.toUpperCase()} PLAN
              </Text>
            </View>
            <Text style={styles.subscriptionDescription}>
              {profileData.subscription === 'premium'
                ? 'Unlimited generations and priority processing'
                : profileData.subscription === 'pro'
                ? 'Enhanced features and faster processing'
                : 'Basic features with limited generations'}
            </Text>
            {profileData.subscription !== 'premium' && (
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {trainingHistory.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Clock size={16} color="#8B5CF6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{item.modelName}</Text>
                <Text style={styles.activityDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.statusBadge, styles[`${item.status}Badge`]]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderHistory = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Training History</Text>
      {trainingHistory.map((item) => (
        <View key={item.id} style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>{item.modelName}</Text>
            <View style={[styles.statusBadge, styles[`${item.status}Badge`]]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.historyTier}>{item.tier.toUpperCase()} TIER</Text>
          <Text style={styles.historyDate}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          {item.status === 'training' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${item.progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{item.progress}%</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderGallery = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Generated Images</Text>
      <View style={styles.imageGrid}>
        {generatedImages.map((image) => (
          <View key={image.id} style={styles.imageCard}>
            <Image source={{ uri: image.imageUrl }} style={styles.galleryImage} />
            <View style={styles.imageOverlay}>
              <TouchableOpacity
                style={styles.imageAction}
                onPress={() => toggleImageLike(image.id)}
              >
                <Star
                  size={16}
                  color={image.liked ? '#FBBF24' : '#FFFFFF'}
                  fill={image.liked ? '#FBBF24' : 'none'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageAction}>
                <Share size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageAction}>
                <Download size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imageAction}
                onPress={() => handleDeleteImage(image.id)}
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <View style={styles.imageInfo}>
              <Text style={styles.imagePrompt} numberOfLines={2}>
                {image.prompt}
              </Text>
              <Text style={styles.imageModel}>{image.model}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Settings</Text>
      
      <View style={styles.settingsGroup}>
        <Text style={styles.settingsGroupTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={20} color="#9CA3AF" />
            <Text style={styles.settingLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#374151', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.settingsGroup}>
        <Text style={styles.settingsGroupTitle}>Generation</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Download size={20} color="#9CA3AF" />
            <Text style={styles.settingLabel}>Auto-save Images</Text>
          </View>
          <Switch
            value={autoSave}
            onValueChange={setAutoSave}
            trackColor={{ false: '#374151', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.settingsGroup}>
        <Text style={styles.settingsGroupTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Shield size={20} color="#9CA3AF" />
            <Text style={styles.settingLabel}>Privacy & Security</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <HelpCircle size={20} color="#9CA3AF" />
            <Text style={styles.settingLabel}>Help & Support</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#111827', '#1F2937']} style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              {editingProfile ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={editedName}
                    onChangeText={setEditedName}
                    autoFocus
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveProfile}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>{profileData.name}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setEditingProfile(true)}
                  >
                    <Edit3 size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.userEmail}>{profileData.email}</Text>
              <Text style={styles.joinDate}>
                Member since {new Date(profileData.joinDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tabs}>
              {renderTabButton('overview', 'Overview', User)}
              {renderTabButton('history', 'History', Clock)}
              {renderTabButton('gallery', 'Gallery', ImageIcon)}
              {renderTabButton('settings', 'Settings', Settings)}
            </View>
          </ScrollView>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'history' && renderHistory()}
          {activeTab === 'gallery' && renderGallery()}
          {activeTab === 'settings' && renderSettings()}
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
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#8B5CF6',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 4,
  },
  profileInfo: {
    flex: 1,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    padding: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  joinDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#8B5CF6',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  subscriptionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  subscriptionGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  subscriptionDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  recentActivity: {
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activityDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  trainingBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
  },
  failedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  historyCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyTier: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#1F2937',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  progressText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    minWidth: 32,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageCard: {
    width: (width - 56) / 2,
    backgroundColor: '#374151',
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: 150,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  imageAction: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 6,
  },
  imageInfo: {
    padding: 12,
  },
  imagePrompt: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  imageModel: {
    fontSize: 10,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  settingsGroup: {
    marginBottom: 24,
  },
  settingsGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});