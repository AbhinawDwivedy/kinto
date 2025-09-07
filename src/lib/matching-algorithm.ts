import { User, Match } from '@/types';

export class MatchingAlgorithm {
  private static calculateMusicCompatibility(user1: User, user2: User): number {
    if (!user1.spotify || !user2.spotify) return 0;

    const artistsScore = this.calculateArraySimilarity(
      user1.spotify.topArtists,
      user2.spotify.topArtists
    );
    
    const genresScore = this.calculateArraySimilarity(
      user1.spotify.topGenres,
      user2.spotify.topGenres
    );

    const tracksScore = this.calculateArraySimilarity(
      user1.spotify.topTracks,
      user2.spotify.topTracks
    );

    return (artistsScore * 0.4 + genresScore * 0.4 + tracksScore * 0.2) * 100;
  }

  private static calculateInterestsCompatibility(user1: User, user2: User): number {
    return this.calculateArraySimilarity(user1.interests, user2.interests) * 100;
  }

  private static calculateLocationCompatibility(user1: User, user2: User): number {
    const distance = this.calculateDistance(
      user1.location.latitude,
      user1.location.longitude,
      user2.location.latitude,
      user2.location.longitude
    );

    // Normalize distance score (closer = higher score)
    const maxDistance = Math.max(user1.preferences.maxDistance, user2.preferences.maxDistance);
    if (distance > maxDistance) return 0;
    
    return Math.max(0, (1 - distance / maxDistance) * 100);
  }

  private static calculateArraySimilarity(arr1: string[], arr2: string[]): number {
    if (arr1.length === 0 || arr2.length === 0) return 0;
    
    const intersection = arr1.filter(item => arr2.includes(item));
    const union = [...new Set([...arr1, ...arr2])];
    
    return intersection.length / union.length;
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public static calculateCompatibility(user1: User, user2: User): Match['compatibility'] {
    const music = this.calculateMusicCompatibility(user1, user2);
    const interests = this.calculateInterestsCompatibility(user1, user2);
    const location = this.calculateLocationCompatibility(user1, user2);
    
    // Weighted overall score
    const overall = (music * 0.35 + interests * 0.35 + location * 0.3);

    return {
      overall: Math.round(overall),
      music: Math.round(music),
      interests: Math.round(interests),
      location: Math.round(location)
    };
  }

  public static isCompatible(user1: User, user2: User): boolean {
    // Check basic preferences
    const ageCompatible = user2.age >= user1.preferences.ageRange[0] && 
                         user2.age <= user1.preferences.ageRange[1] &&
                         user1.age >= user2.preferences.ageRange[0] && 
                         user1.age <= user2.preferences.ageRange[1];

    if (!ageCompatible) return false;

    // Check gender preferences
    const genderCompatible = user1.preferences.interestedIn.includes(user2.gender) &&
                            user2.preferences.interestedIn.includes(user1.gender);

    if (!genderCompatible) return false;

    // Check distance
    const distance = this.calculateDistance(
      user1.location.latitude,
      user1.location.longitude,
      user2.location.latitude,
      user2.location.longitude
    );

    const distanceCompatible = distance <= Math.max(user1.preferences.maxDistance, user2.preferences.maxDistance);

    return distanceCompatible;
  }

  public static findPotentialMatches(currentUser: User, allUsers: User[]): User[] {
    return allUsers
      .filter(user => user.id !== currentUser.id)
      .filter(user => this.isCompatible(currentUser, user))
      .map(user => ({
        ...user,
        compatibility: this.calculateCompatibility(currentUser, user)
      }))
      .sort((a, b) => (b.compatibility?.overall || 0) - (a.compatibility?.overall || 0));
  }
}