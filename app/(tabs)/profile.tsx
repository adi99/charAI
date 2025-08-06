import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Crown, Heart, Users, Video, Image as ImageIcon, CreditCard as Edit3, Share2, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface UserPost {
  id: string;
  type: 'video' | 'image';
  thumbnailUrl: string;
  likes: number;
  views: number;
}

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'liked'>('posts');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user, signOut } = useAuth();

  const userPosts: UserPost[] = [
    {
      id: '1',
      type: 'video',
      thumbnailUrl: 'https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=300',
      likes: 2847,
      views: 15200,
    },
    {
      id: '2',
      type: 'image',
      thumbnailUrl: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=300',
      likes: 3421,
      views: 22100,
    },
    {
      id: '3',
      type: 'video',
      thumbnailUrl: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=300',
      likes: 1926,
      views: 8700,
    },
    {
      id: '4',
      type: 'image',
      thumbnailUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300',
      likes: 4521,
      views: 31200,
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const PostItem = ({ post }: { post: UserPost }) => (
    <TouchableOpacity style={styles.postItem}>
      <Image source={{ uri: post.thumbnailUrl }} style={styles.postImage} />
      <View style={styles.postOverlay}>
        <View style={styles.postIcon}>
          {post.type === 'video' ? (
            <Video size={16} color="#ffffff" strokeWidth={2} />
          ) : (
            <ImageIcon size={16} color="#ffffff" strokeWidth={2} />
          )}
        </View>
        <View style={styles.postStats}>
          <Text style={styles.postStatsText}>{post.likes.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f172a']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton}>
              <Share2 size={20} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleSignOut}>
              <Settings size={20} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150' }}
                style={styles.avatar}
              />
              {isSubscribed && (
                <View style={styles.crownBadge}>
                  <Crown size={16} color="#ffd700" strokeWidth={2} fill="#ffd700" />
                </View>
              )}
            </View>

            <Text style={styles.username}>@{user?.email?.split('@')[0] || 'user'}</Text>
            <Text style={styles.displayName}>Alex Chen</Text>
            <Text style={styles.bio}>
              Creating stunning AI art & videos ✨{'\n'}
              SDXL & FLUX specialist 🎨
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24.5K</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1.2K</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>156</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>2.1M</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editButton}>
                <Edit3 size={16} color="#ffffff" strokeWidth={2} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.followButton}>
                <Users size={16} color="#ffffff" strokeWidth={2} />
                <Text style={styles.followButtonText}>Share Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.subscriptionSection}>
            <LinearGradient
              colors={['#ffd700', '#ffed4e']}
              style={styles.subscriptionCard}
            >
              <View style={styles.subscriptionHeader}>
                <Crown size={24} color="#1a1a2e" strokeWidth={2} fill="#1a1a2e" />
                <Text style={styles.subscriptionTitle}>AI Pro Subscription</Text>
              </View>

              <Text style={styles.subscriptionDescription}>
                Unlock unlimited generations, exclusive models, and priority processing
              </Text>

              <View style={styles.subscriptionFeatures}>
                <Text style={styles.subscriptionFeature}>✓ Unlimited video generations</Text>
                <Text style={styles.subscriptionFeature}>✓ Access to latest AI models</Text>
                <Text style={styles.subscriptionFeature}>✓ Priority queue processing</Text>
                <Text style={styles.subscriptionFeature}>✓ Advanced editing tools</Text>
              </View>

              {!isSubscribed ? (
                <TouchableOpacity
                  style={styles.subscribeButton}
                  onPress={() => setIsSubscribed(true)}
                >
                  <Text style={styles.subscribeButtonText}>Subscribe for $9.99/month</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.subscribedBadge}>
                  <Crown size={16} color="#1a1a2e" strokeWidth={2} fill="#1a1a2e" />
                  <Text style={styles.subscribedText}>Active Subscription</Text>
                </View>
              )}
            </LinearGradient>
          </View>

          <View style={styles.tabsSection}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'posts' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('posts')}
              >
                <ImageIcon size={20} color={activeTab === 'posts' ? '#8b5cf6' : '#9ca3af'} strokeWidth={2} />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'posts' && styles.activeTabText,
                  ]}
                >
                  Posts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'liked' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('liked')}
              >
                <Heart size={20} color={activeTab === 'liked' ? '#8b5cf6' : '#9ca3af'} strokeWidth={2} />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'liked' && styles.activeTabText,
                  ]}
                >
                  Liked
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.postsGrid}>
              {userPosts.map(post => (
                <PostItem key={post.id} post={post} />
              ))}
            </View>
          </View>
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
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#8b5cf6',
  },
  crownBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b5cf6',
    marginBottom: 2,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 12,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 12,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  subscriptionSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  subscriptionCard: {
    borderRadius: 20,
    padding: 20,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginLeft: 10,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: '#1a1a2e',
    marginBottom: 15,
    lineHeight: 20,
  },
  subscriptionFeatures: {
    marginBottom: 20,
  },
  subscriptionFeature: {
    fontSize: 12,
    color: '#1a1a2e',
    marginBottom: 5,
    fontWeight: '500',
  },
  subscribeButton: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  subscribedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
  },
  subscribedText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  tabsSection: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#8b5cf6',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 2,
  },
  postItem: {
    width: '32.5%',
    aspectRatio: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  postOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postIcon: {
    marginRight: 4,
  },
  postStats: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  postStatsText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
});