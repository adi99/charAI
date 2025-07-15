import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Heart, Share, Bookmark, TrendingUp, Grid2x2 as Grid, List } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ExploreItem {
  id: string;
  title: string;
  image: string;
  author: string;
  likes: number;
  category: string;
  style: string;
  trending?: boolean;
  featured?: boolean;
}

interface FilterOption {
  id: string;
  name: string;
  type: 'style' | 'category';
}

const MOCK_ITEMS: ExploreItem[] = [
  {
    id: '1',
    title: 'Cyberpunk Portrait',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'AI_Artist_01',
    likes: 1247,
    category: 'Portrait',
    style: 'Cyberpunk',
    trending: true,
  },
  {
    id: '2',
    title: 'Fantasy Landscape',
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'DreamCreator',
    likes: 856,
    category: 'Landscape',
    style: 'Fantasy',
    featured: true,
  },
  {
    id: '3',
    title: 'Modern Art Style',
    image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'StyleMaster',
    likes: 634,
    category: 'Abstract',
    style: 'Modern',
  },
  {
    id: '4',
    title: 'Vintage Photography',
    image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'RetroGen',
    likes: 923,
    category: 'Photography',
    style: 'Vintage',
  },
  {
    id: '5',
    title: 'Anime Character',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'AnimeCreator',
    likes: 1502,
    category: 'Character',
    style: 'Anime',
    trending: true,
  },
  {
    id: '6',
    title: 'Realistic Portrait',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'PhotoAI',
    likes: 789,
    category: 'Portrait',
    style: 'Realistic',
  },
];

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', name: 'All', type: 'category' },
  { id: 'portrait', name: 'Portrait', type: 'category' },
  { id: 'landscape', name: 'Landscape', type: 'category' },
  { id: 'abstract', name: 'Abstract', type: 'category' },
  { id: 'cyberpunk', name: 'Cyberpunk', type: 'style' },
  { id: 'fantasy', name: 'Fantasy', type: 'style' },
  { id: 'anime', name: 'Anime', type: 'style' },
  { id: 'realistic', name: 'Realistic', type: 'style' },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [items, setItems] = useState<ExploreItem[]>(MOCK_ITEMS);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         item.category.toLowerCase() === selectedFilter ||
                         item.style.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSave = (itemId: string) => {
    setSavedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate loading new content
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderGridItem = ({ item }: { item: ExploreItem }) => (
    <TouchableOpacity style={styles.gridItem}>
      <Image source={{ uri: item.image }} style={styles.gridItemImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
        style={styles.gridItemOverlay}
      >
        <View style={styles.gridItemContent}>
          <Text style={styles.gridItemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.gridItemAuthor}>{item.author}</Text>
          <View style={styles.gridItemActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLike(item.id)}
            >
              <Heart
                size={16}
                color={likedItems.has(item.id) ? '#EC4899' : '#FFFFFF'}
                fill={likedItems.has(item.id) ? '#EC4899' : 'none'}
              />
              <Text style={styles.actionText}>{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSave(item.id)}
            >
              <Bookmark
                size={16}
                color={savedItems.has(item.id) ? '#8B5CF6' : '#FFFFFF'}
                fill={savedItems.has(item.id) ? '#8B5CF6' : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      {item.trending && (
        <View style={styles.trendingBadge}>
          <TrendingUp size={12} color="#FFFFFF" />
        </View>
      )}
      {item.featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: ExploreItem }) => (
    <TouchableOpacity style={styles.listItem}>
      <Image source={{ uri: item.image }} style={styles.listItemImage} />
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{item.title}</Text>
        <Text style={styles.listItemAuthor}>by {item.author}</Text>
        <View style={styles.listItemTags}>
          <Text style={styles.tag}>{item.category}</Text>
          <Text style={styles.tag}>{item.style}</Text>
        </View>
        <View style={styles.listItemActions}>
          <TouchableOpacity
            style={styles.listActionButton}
            onPress={() => handleLike(item.id)}
          >
            <Heart
              size={16}
              color={likedItems.has(item.id) ? '#EC4899' : '#9CA3AF'}
              fill={likedItems.has(item.id) ? '#EC4899' : 'none'}
            />
            <Text style={styles.listActionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listActionButton}
            onPress={() => handleSave(item.id)}
          >
            <Bookmark
              size={16}
              color={savedItems.has(item.id) ? '#8B5CF6' : '#9CA3AF'}
              fill={savedItems.has(item.id) ? '#8B5CF6' : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listActionButton}>
            <Share size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
      <View style={styles.filtersContent}>
        {FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.activeFilterButtonText,
              ]}
            >
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#111827', '#1F2937']} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.viewModeButton}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? (
                <List size={20} color="#9CA3AF" />
              ) : (
                <Grid size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search creations..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterIcon}>
            <Filter size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {renderFilters()}

        <FlatList
          data={filteredItems}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#8B5CF6"
            />
          }
        />
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
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
  },
  filterIcon: {
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  filtersContainer: {
    paddingBottom: 16,
  },
  filtersContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#374151',
  },
  activeFilterButton: {
    backgroundColor: '#8B5CF6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  gridItem: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gridItemImage: {
    width: '100%',
    height: 200,
  },
  gridItemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  gridItemContent: {
    gap: 4,
  },
  gridItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  gridItemAuthor: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  gridItemActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  trendingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 4,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featuredText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  listItemImage: {
    width: 80,
    height: 80,
  },
  listItemContent: {
    flex: 1,
    padding: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  listItemAuthor: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  listItemTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    fontSize: 12,
    color: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  listItemActions: {
    flexDirection: 'row',
    gap: 16,
  },
  listActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listActionText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});