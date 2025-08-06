import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Heart, MessageCircle, Share, MoveVertical as MoreVertical } from 'lucide-react-native';
import VideoPlayer from '@/components/VideoPlayer';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const mockVideos = [
  {
    id: '1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Futuristic City Skyline',
    description: 'AI-generated cyberpunk cityscape with neon lights and flying cars',
    author: '@ai_creator_01',
    likes: 12500,
    comments: 324,
    shares: 89,
    isLiked: false,
  },
  {
    id: '2',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Ocean Waves at Sunset',
    description: 'Peaceful ocean scene generated from "golden hour waves crashing"',
    author: '@wave_master',
    likes: 8900,
    comments: 156,
    shares: 45,
    isLiked: true,
  },
  {
    id: '3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Fantasy Forest Portal',
    description: 'Magical portal in an enchanted forest with glowing particles',
    author: '@fantasy_ai',
    likes: 15700,
    comments: 432,
    shares: 123,
    isLiked: false,
  },
];

export default function FeedScreen() {
  const [videos, setVideos] = useState(mockVideos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const toggleLike = (videoId: string) => {
    setVideos(prev =>
      prev.map(video =>
        video.id === videoId
          ? {
              ...video,
              isLiked: !video.isLiked,
              likes: video.isLiked ? video.likes - 1 : video.likes + 1,
            }
          : video
      )
    );
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderVideo = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.videoContainer}>
      <VideoPlayer
        source={{ uri: item.url }}
        shouldPlay={index === currentIndex}
        isLooping
        style={styles.video}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.leftContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleLike(item.id)}
          >
            <Heart
              size={28}
              color={item.isLiked ? '#EF4444' : '#FFFFFF'}
              fill={item.isLiked ? '#EF4444' : 'transparent'}
            />
            <Text style={styles.actionCount}>{formatCount(item.likes)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={28} color="#FFFFFF" />
            <Text style={styles.actionCount}>{formatCount(item.comments)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share size={28} color="#FFFFFF" />
            <Text style={styles.actionCount}>{formatCount(item.shares)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MoreVertical size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / SCREEN_HEIGHT);
          setCurrentIndex(index);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  leftContent: {
    flex: 1,
    marginRight: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 18,
  },
  rightActions: {
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionCount: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
  },
});